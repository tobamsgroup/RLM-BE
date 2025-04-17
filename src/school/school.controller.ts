import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Req,
} from '@nestjs/common';
import { SchoolService } from './school.service';
import { CreateSchoolDto } from './school.dto';
import { ActivityLogsService } from 'src/activityLogs/activityLogs.service';

@Controller('school')
export class SchoolController {
  constructor(
    private readonly schoolService: SchoolService,
    private activityLogService: ActivityLogsService,
  ) {}

  @Get('list')
  getSchool() {
    return this.schoolService.getSchools();
  }

  @Post('create')
  async createSchool(@Body() schoolDto: CreateSchoolDto, @Req() req: Request) {
    if (req['organisationId'] !== schoolDto.organisation) {
      throw new HttpException(
        "Organisation Id doesn't match",
        HttpStatus.FORBIDDEN,
      );
    }

   const resp = await this.schoolService.createSchool(schoolDto);
    await this.activityLogService.addLog({
      action: 'New School Created Successfully',
    });
    return resp
  }
//   @Post('add-user')
//   async addUser(@Body() schoolDto: CreateSchoolDto, @Req() req: Request) {
//     if (req['organisationId'] !== schoolDto.organisation) {
//       throw new HttpException(
//         "Organisation Id doesn't match",
//         HttpStatus.FORBIDDEN,
//       );
//     }

//    const resp = await this.schoolService.addSchoolUser(schoolDto);
   
//    await this.activityLogService.addLog({
//     action: `New User Profile Added to School ${school?.name}`,
//   });
//     return resp
//   }
}
