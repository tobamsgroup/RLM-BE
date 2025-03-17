import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { School } from './school.schemas';
import { CreateSchoolDto } from './school.dto';
import { NotificationService } from 'src/notifications/notification.service';
import { NotificationType } from 'src/notifications/notification.schemas';

@Injectable()
export class SchoolService {
  constructor(
    @Inject('SCHOOL_MODEL') private SchoolModel: Model<School>,
    private readonly notificationService: NotificationService,
  ) {}

  async getSchools() {
    return this.SchoolModel.find();
  }

  async createSchool(schoolDto: CreateSchoolDto) {
    const isExist = await this.SchoolModel.find({ name: schoolDto.name });

    if (isExist) {
      throw new HttpException('School Already Exist', HttpStatus.CONFLICT);
    }

   const school = await this.SchoolModel.create({
      ...schoolDto,
    });

    // Send response immediately
    setImmediate(async () => {
      try {
        await this.notificationService.sendNotification(
          schoolDto.organisation,
          NotificationType.NewSchoolCreated,
          {
            title: 'School Created Successfully',
            message: `${schoolDto?.name} has been successfully created. You can now assign or invite a School Admin to manage the school and start adding courses and users.`,
          },
        );
      } catch (error) {
        console.error('Failed to send notification:', error);
      }
    });

    return school
  }
}
