import nodemailer, { Transporter } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { IMailOption } from 'src/interfaces/mail';


const createTransporter = async (): Promise<Transporter> => {
  const emailConfig = {
      host:  'smtp.gmail.com',
      port: 465,
      auth: {
        user: 'mailfordevtest404@gmail.com',
        pass: 'nylqdfechcowgffv',
      },
      tls: {
        rejectUnauthorized: false,
      },
  };


  // Create the transporter with the selected configuration
  const transporter = nodemailer.createTransport(
    emailConfig as SMTPTransport.Options
  );
  return transporter;
};

const verifyTransporter = async (): Promise<void> => {
  try {
    const transporterInstance = await createTransporter();
    await transporterInstance.verify();
    console.log('Transporter verified successfully');
  } catch (error) {
    console.error('Error verifying transporter:', error);
    throw error;
  }
};

/**
 * Sends an email with the provided content.
 *
 * @param subject The email subject line.
 * @param htmlContent The HTML content of the email body.
 * @param emailTo The recipient email address.
 * @param replyTo The email address to set as the "Reply-To" header.
 * @param bcc The email recipients to be blind copied.
 * @returns A promise that resolves when the email is sent.
 * @throws {Error} Any error that occurs during email sending.
 */
const sendEmail = async (mailPayload: IMailOption): Promise<void> => {
  const mailOptions = {
    from: 'mailfordevtest404@gmail.com',
    to: mailPayload.emailTo,
    bcc: mailPayload.bcc,
    subject: mailPayload.subject,
    html: mailPayload.htmlContent,
    replyTo: mailPayload.replyTo,
  };

  await processSendEmail(mailOptions);
};

/**
 * Sends an email using the configured transporter.
 *
 * @param mailOptions Mail options object conforming to Nodemailer's format.
 * @returns A promise that resolves when the email is sent.
 * @throws Any error that occurs during email sending or verification.
 */
const processSendEmail = async (mailOptions: object): Promise<void> => {
  try {
    await verifyTransporter();
    const transporterInstance = await createTransporter();
    await transporterInstance.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

export default sendEmail;
