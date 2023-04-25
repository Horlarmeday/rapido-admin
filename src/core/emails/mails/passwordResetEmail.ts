import { mailGenerator } from '../mailgen';

export const passwordResetEmail = (firstname: string) => {
  const email = {
    body: {
      name: firstname,
      intro:
        'This is a confirmation that the password to your account has been changed successfully.',
      outro: 'Thank you for using our service',
    },
  };
  return mailGenerator.generate(email);
};
