import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { AuthenticationGuard } from 'src/guards/authentication.guard';

@Controller('notification')
@UseGuards(AuthenticationGuard)
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get('list')
  getNotifications() {
    return this.notificationService.getNotifications();
  }

  @Post('delete')
  deletNotifications(@Body() { notificationIds }) {
    return this.notificationService.deleteNotifications(
      notificationIds as string[],
    );
  }

  @Get('read-all')
  markAllAsRead() {
    return this.notificationService.markAllAsRead();
  }

  @Get('unread/count')
  unreadCount() {
    return this.notificationService.unreadCount();
  }

  @Post()
  sendNotifications(@Body() { type, data }, @Req() req: Request) {
    return this.notificationService.createNotification(
      req['organisationId'],
      type,
      data,
    );
  }
}
