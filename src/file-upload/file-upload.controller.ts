import {
  Controller,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Query
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadService } from './file-upload.service';
import { AuthenticationGuard } from 'src/guards/authentication.guard';
import { Request } from 'express';

@Controller('file-upload')
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(AuthenticationGuard)
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 20971520  }), //20mb
        ],
      }),
    )
    file: Express.Multer.File,
    @Req () req:Request,
    @Query('type') type?: "image" | "video" | "document"
  ) {
    return await this.fileUploadService.upload(file.originalname, file.buffer, file.mimetype, req['organisationId'], type);
  }
}