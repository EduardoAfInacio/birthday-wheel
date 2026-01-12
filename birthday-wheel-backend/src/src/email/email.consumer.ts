import { Processor, Process } from '@nestjs/bull';
import { MailerService } from '@nestjs-modules/mailer';
import type { Job } from 'bull';
import { EmailJobData } from './email-job-data';

@Processor('email-queue')
export class EmailConsumer {
  constructor(private readonly mailerService: MailerService) {}

  @Process('send-prize-email')
  async handleSendEmail(job: Job<EmailJobData>) {
    const { user, prize } = job.data;
    console.log(`Sending email to: ${user.email}`);

    try {
      await this.mailerService.sendMail({
        to: user.email,
        subject: 'Congratulations, you have won a prize!!!',
        html: `
        <h1>Hello, ${user.name}!</h1>
        <p>Congratulations!!! You have just won a : <strong>${prize.name}</strong></p>
        <p>Description: ${prize.description}</p>
        <p>Prize code: ${prize.id}</p>
        <p>Send a message to xxxxxxx or email yyyyy or come to the nearest store to know more on how to get your prize!</p>
      `,
      });
    } catch (error) {
      console.log(`Error sending email to: ${user.email}`, error);
      throw error;
    }

    console.log(`Email sent to: ${user.email}`);
  }
}
