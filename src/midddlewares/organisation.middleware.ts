import {
  Injectable,
  NestMiddleware,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { OrganisationService } from 'src/organisation/organisation.service';

@Injectable()
export class OrganisationMiddleware implements NestMiddleware {
  constructor(private organisationService: OrganisationService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const organisationId = req.headers['x-organisation-id']?.toString();
    if (!organisationId) {
      throw new BadRequestException('X-ORGANISATION-ID not provided');
    }

    const organisationExists = await this.organisationService.getOrganisation(organisationId)
    if(!organisationExists){
        throw new NotFoundException('Organisation does not exists')
    }
    req['organisationId'] = organisationId;
    next();
  }
}
@Injectable()
export class OrganisationRequestMiddleware implements NestMiddleware {
  constructor(private organisationService: OrganisationService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const organisationId = req.headers['x-organisation-id']?.toString();
    if (!organisationId) {
      throw new BadRequestException('X-ORGANISATION-ID not provided');
    }

    const organisationExists = await this.organisationService.getOrganisation(organisationId)
    if(!organisationExists){
        throw new NotFoundException('Organisation does not exists')
    }
    req['organisationId'] = organisationId;
    next();
  }
}
