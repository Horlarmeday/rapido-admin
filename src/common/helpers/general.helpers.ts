import { v4 as uuidv4 } from 'uuid';
import { Messages } from '../../core/messages/messages';
import { BadGatewayException, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { chain } from 'lodash';
import * as moment from 'moment';

type GenerateEmailAndSendType = {
  email: string;
  subject: Messages | string;
  emailBody: any;
  attachments?: any[];
};

const logger = new Logger();

export class GeneralHelpers {
  generateRandomNumbers(length: number) {
    return Math.floor(
      Math.pow(10, length - 1) + Math.random() * 9 * Math.pow(10, length - 1),
    );
  }

  generateRandomCharacters(length: number) {
    const uniq = uuidv4();
    return uniq
      .split('-')
      .join('')
      .substring(uniq.length - length - 4)
      .toUpperCase();
  }

  paginate(data: any, page: number | undefined, limit: number, total: number) {
    const currentPage = page || 1;
    const pages = Math.ceil(total / limit);
    const perPage = limit;

    return { total, docs: data, pages, perPage, currentPage };
  }

  calcLimitAndOffset(page: number, size: number | undefined) {
    const limit = size || 10;
    const offset = page ? (page - 1) * limit : 0;

    return { limit, offset };
  }

  genTxReference() {
    const currentDate = new Date().toISOString().slice(0, 11);
    return `${currentDate}-${this.generateRandomCharacters(10)}`;
  }

  groupBy(data: any, fieldToGroupBy: string) {
    return chain(data)
      .groupBy((x) => x?.[fieldToGroupBy])
      .map((value, key) => ({
        date: key,
        data: value,
      }))
      .value();
  }

  groupByDate(data: any, fieldToGroupBy: string) {
    return chain(data)
      .groupBy((x) => this.withoutTime(x?.[fieldToGroupBy]))
      .map((value, key) => ({
        date: moment(key).format('YYYY-MM-DD'),
        data: value,
      }))
      .value();
  }

  withoutTime(dateTime) {
    const date = new Date(dateTime.getTime());
    date.setHours(0, 0, 0, 0);
    return date;
  }

  generateEmailAndSend({
    email,
    subject,
    emailBody,
    attachments,
  }: GenerateEmailAndSendType) {
    // Send email
    this.sendMail(email, subject, emailBody, attachments);
  }

  nodeMailerTransport() {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: 587,
      secure: false, // upgrade later with STARTTLS
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  sendMail(
    email: string,
    subject: Messages | string,
    emailBody: any,
    attachments: any[] = [],
  ) {
    const message = {
      from: `'Rapid Capsules' <${process.env.EMAIL_SENDER}>`,
      to: email,
      subject,
      html: emailBody,
      attachments,
    };
    const transport = this.nodeMailerTransport();
    try {
      transport.verify(function (error, success) {
        if (error) {
          logger.error(`Error: ${error}`);
        } else {
          transport.sendMail(message, (error, info) => {
            if (error) {
              logger.error(`Error: ${error}`);
            }
            logger.log(`Email sent to ${email}!`);
          });
        }
      });
    } catch (e) {
      throw new BadGatewayException(e);
    }
  }
}
