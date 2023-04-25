import { mailGenerator } from '../mailgen';
import { Types } from 'mongoose';
import * as process from 'process';

type ForgotPasswordEmailType = {
  firstname: string;
  token: string;
  userId: Types.ObjectId;
  baseUrl: string;
};

export const forgotPasswordEmail = ({
  firstname,
  token,
  userId,
  baseUrl = <string>process.env.BASE_URL,
}: ForgotPasswordEmailType) => {
  const email = {
    body: {
      name: firstname,
      intro:
        'You have received this email because a password reset request for your account was received.',
      action: {
        instructions: 'Click the button below to reset your password:',
        button: {
          color: '#22BC66', // Optional action button color
          text: 'Reset Password',
          link: `${baseUrl}/forgot-password?token=${token}&userId=${userId}`,
        },
      },
      outro:
        'If you did not request a password reset, no further action is required on your part.',
    },
  };
  return mailGenerator.generate(email);
};
