import { Body, Controller, Delete, Get, Inject, Param, Patch, Post, Query } from '@nestjs/common';
import { ResourcesService } from './resources.service';
import { SaveResourcesDto } from './resources.dto';

@Controller('resources')
export class ResourcesController {
    constructor (
        private readonly resourcesService: ResourcesService,
    ){}

    @Get('list')
    getNotifications(
      @Query('search') search?: string,
      @Query('category') category?: string,
      @Query('schoolId') schoolId?: string,
      @Query('page') page = '1',
      @Query('perPage') perPage = '10'
    ){
      const pageNum = parseInt(page, 10);
      const perPageNum = parseInt(perPage, 10);
  
       return this.resourcesService.listResources(search, category, schoolId, pageNum, perPageNum)
    }

    @Post('save')
    saveResources(
      @Body() resourceDto:SaveResourcesDto
    ){
      return this.resourcesService.saveResource(resourceDto)
    }

    @Delete('delete/:id')
    deleteResources(
      @Param('id') id:string
    ){
      return this.resourcesService.deleteResource(id)
    }
}
