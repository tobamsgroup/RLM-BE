import { Body, Controller, Get, Inject, Param, Patch, Post } from '@nestjs/common';
import { NotificationService } from './notification.service';

@Controller('notification')
export class NotificationController {
    constructor (
        private readonly notificationService: NotificationService,
    ){}

    @Get('list')
    getNotifications(){
       return this.notificationService.getNotifications()
    }
}
