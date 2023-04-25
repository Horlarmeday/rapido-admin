import * as Mailgen from 'mailgen';

export const mailGenerator = new Mailgen({
  theme: 'default',
  product: {
    // Appears in header & footer of e-mails
    name: 'Rapid Capsule',
    link: 'https://rapidcapsule.com/',
    copyright: `Copyright © ${new Date().getFullYear()} Rapid Capsule. All rights reserved.`,
    // Optional product logo
    // logo: 'https://mailgen.js/img/logo.png'
  },
});
