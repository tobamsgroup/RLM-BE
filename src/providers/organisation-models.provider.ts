import { Connection } from 'mongoose';
import { School, SchoolSchema } from 'src/school/school.schemas';

export const organisationModels = {
  schoolModel: {
    provide: 'SCHOOL_MODEL',
    useFactory: async (organisationConnection: Connection) => {
      return organisationConnection.model(School.name, SchoolSchema);
    },
    inject: ['ORGANISATION_CONNECTION'],
  },
};
