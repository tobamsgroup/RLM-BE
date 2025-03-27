import { Connection } from 'mongoose';
import { Notification, NotificationSchema } from 'src/notifications/notification.schemas';
import { Resources, ResourcesSchema } from 'src/resources/resources.schema';
import { School, SchoolSchema } from 'src/school/school.schemas';
import { User, UserSchema } from 'src/users/users.schema';

/**
 * Multitenancy approach to get the correct organisation db and correct model
 * this injects the ORGANISATION_CONNECTION provider to get the correct databse
 * and return the correct model.
 * 
 * Any new model that is used within the multitenancy should be added here.
 */
export const organisationModels = {
  schoolModel: {
    provide: 'SCHOOL_MODEL',
    useFactory: async (organisationConnection: Connection) => {
      return organisationConnection.model(School.name, SchoolSchema);
    },
    inject: ['ORGANISATION_CONNECTION'],
  },

  notificationModel: {
    provide: 'NOTIFICATION_MODEL',
    useFactory: async (organisationConnection: Connection) => {
      return organisationConnection.model(Notification.name, NotificationSchema);
    },
    inject: ['ORGANISATION_CONNECTION'],
  },

  resourcesModel: {
    provide: 'RESOURCES_MODEL',
    useFactory: async (organisationConnection: Connection) => {
      return organisationConnection.model(Resources.name, ResourcesSchema);
    },
    inject: ['ORGANISATION_CONNECTION'],
  },

  usersModel: {
    provide: 'USERS_MODEL',
    useFactory: async (organisationConnection: Connection) => {
      return organisationConnection.model(User.name, UserSchema);
    },
    inject: ['ORGANISATION_CONNECTION'],
  },
};
