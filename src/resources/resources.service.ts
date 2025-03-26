import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { Organisation } from 'src/organisation/schemas/organisation.schemas';
import { OrganisationService } from 'src/organisation/organisation.service';
import { Resources } from './resources.schema';
import { SaveResourcesDto } from './resources.dto';

@Injectable()
export class ResourcesService {
  constructor(
    @Inject('RESOURCES_MODEL')
    private resourcesModel: Model<Resources>,
    private organisationService: OrganisationService,
  ) {}

  async listResources(
    search: string = '',
    category?: string,
    schoolId?: string,
    page = 1,
    perPage = 10,
  ) {
    const filter: any = {
      ...(search
        ? {
            $or: [{ name: { $regex: search.trim(), $options: 'i' } }],
          }
        : {}),
      ...(category && category.length > 0
        ? {
            category: { $in: category },
          }
        : {}),
      ...(schoolId
        ? {
            schoolId,
          }
        : {}),
    };

    const [data, total] = await Promise.all([
      this.resourcesModel
        .find(filter)
        .skip((page - 1) * perPage)
        .limit(perPage)
        .exec(),

      this.resourcesModel.countDocuments(filter),
    ]);

    return { data, total, lastPage: Math.ceil(total / perPage), page, perPage };
  }

  async saveResource(resourceDto: SaveResourcesDto) {
    return await this.resourcesModel.create(resourceDto)
  }

  async deleteResource(id:string) {
    const deletedResource = await this.resourcesModel.findByIdAndDelete(id).exec();

    if (!deletedResource) {
      throw new NotFoundException(`Resource with ID ${id} not found`);
    }
  
    return { message: "Resource deleted successfully", deletedResource };
  }
}
