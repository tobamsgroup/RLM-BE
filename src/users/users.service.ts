import {
  Inject,
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, RootFilterQuery, Types } from 'mongoose';
import { User, UserDocument, UserStatus } from './users.schema';
import { CreateUserDto, UpdateUserDto } from './users.dto';
import { OrganisationService } from 'src/organisation/organisation.service';
import { hashSync } from 'bcrypt';
import { v4 } from 'uuid';
import { MailService } from 'src/mail/mail.service';
import { schoolUserAdditionEmail } from 'utils/template';
import { SchoolService } from 'src/school/school.service';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USERS_MODEL')
    private userModel: Model<User>,
    private organisationService: OrganisationService,
    private mailService: MailService,
    private schoolService: SchoolService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    if (await this.findOne({ email: createUserDto.email?.toLowerCase() })) {
      throw new ConflictException('User Exists Already');
    }
    const ownerEmail = (
      await this.organisationService.findOne({
        _id: createUserDto.organisation,
      })
    )?.email?.toLowerCase();
    if (ownerEmail === createUserDto.email?.toLowerCase()) {
      throw new ConflictException("Cannot use organisation owner's email");
    }

    let password = createUserDto.password;
    if (!createUserDto.password) {
      password = v4();
    }

    const hashedPassword = hashSync(password!, 10);

    const { isUserSignUp, school, role, ...userData } = createUserDto;
    const createdUser = await this.userModel.create({
      ...userData,
      email: createUserDto?.email?.toLowerCase(),
      password: hashedPassword,
      isGoogleSignUp: false,
      status: isUserSignUp ? UserStatus.INACTIVE : UserStatus.PENDING,
      schoolRoles: [
        {
          school: school,
          roles: [role],
        },
      ],
    });

    const updatedSchool = await this.schoolService.addSchoolUser(createdUser._id, school);

    if (!isUserSignUp) {
      await this.mailService.sendEmail(
        createUserDto.email,
        `You have been added as a School ${role}`,
        schoolUserAdditionEmail(
          createUserDto.lastName,
          password!,
          updatedSchool?.name!,
          updatedSchool?.domain!,
          createUserDto.email,
          role,
        ),
      );
    }

    return createdUser;
  }

  async findAll(): Promise<UserDocument[]> {
    return this.userModel.find().populate('schoolRoles.school').exec();
  }

  async findById(id: Types.ObjectId): Promise<UserDocument> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async update(
    id: Types.ObjectId,
    updateUserDto: UpdateUserDto,
  ): Promise<UserDocument> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return updatedUser;
  }

  async remove(id: Types.ObjectId): Promise<UserDocument> {
    const deletedUser = await this.userModel.findByIdAndDelete(id).exec();
    if (!deletedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return deletedUser;
  }

  async findOne(filter: RootFilterQuery<User>) {
    return await this.userModel.findOne(filter);
  }
}
