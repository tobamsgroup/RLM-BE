import {
  Controller,
  Get,
  UseGuards
} from '@nestjs/common';
import { ActivityLogsService } from './activityLogs.service';
import { AuthenticationGuard } from 'src/guards/authentication.guard';

@Controller('activity-logs')
export class ActivityLogsController {
  constructor(private readonly activityLogsService: ActivityLogsService) {}

  @Get()
  @UseGuards(AuthenticationGuard)
  async list() {
    return this.activityLogsService.listLogs();
  }
}
