import { Document } from 'mongoose';

interface IOtp extends Document {
  type: string;
  otp: string;
  expiration: Date;
  userId: string;
}

export interface IMailOption {
  subject: string;
  htmlContent: string;
  emailTo?: string | string[];
  replyTo?: string | string[];
  bcc?: string[];
}

export default IOtp;
