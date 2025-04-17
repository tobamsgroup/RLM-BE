import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ActivityLogs } from './activityLogs.schema';
import { Model } from 'mongoose';
import { CreateLogsDto } from './activityLogs.dto';

@Injectable()
export class ActivityLogsService {
  constructor(
    @Inject('ACTIVITY_LOGS_MODEL')
    private ActivityLogsModel: Model<ActivityLogs>,
  ) {}

  async listLogs() {
    return await this.ActivityLogsModel.find().lean();
  }

  async addLog(logs:CreateLogsDto) {
    await this.ActivityLogsModel.create(logs)
  }
}
