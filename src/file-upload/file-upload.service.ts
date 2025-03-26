import { Injectable, UnauthorizedException } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
import {v4} from 'uuid'

@Injectable()
export class FileUploadService {
  private readonly s3Client = new S3({
    region: this.configService.getOrThrow('AWS_S3_REGION'),
    credentials:{
      accessKeyId: this.configService.getOrThrow('AWS_ACCESS_KEY'),
      secretAccessKey: this.configService.getOrThrow('AWS_SECRET_KEY')
    }
  });

  constructor(private readonly configService: ConfigService) {}

  async upload(fileName: string, file: Buffer, mimetype:string, organisationId:string, type?:"image" | "video" | "document") {
    if(!organisationId){
      throw new UnauthorizedException('Not Allowed')
    }
    const targetLocation = type ?  `${organisationId}/${type}/${v4()}/${fileName}` : `${organisationId}/${v4()}/${fileName}`
    const params = {
      Bucket: this.configService.getOrThrow('AWS_S3_BUCKET_NAME'),
      Key: targetLocation,
      Body: file,
      ContentType: mimetype,
      ContentDisposition: 'inline',
      ACL: 'public-read'
    };
   const resource = await this.s3Client.upload(params).promise()

    return {url: resource.Location}
  }
}