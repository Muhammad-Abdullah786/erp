// import nodemailer from "nodemailer";
// // import logger from "../handlers/logger";
// // import config from '../config/config';

// export const sendEmail = async (
//   recipient: string,
//   subject: string,
//   text: string,
//   attachments: any[] = []
// ) => {
//   const transporter = nodemailer.createTransport({
//     service: "Gmail",
//     auth: {
//       user: "khansuzair1@gmail.com",
//       pass: "yena sysp bncd uwvz",
//     },
//   });

//   await transporter.sendMail({
//     from: "khansuzair1@gmail.com",
//     to: recipient,
//     subject,
//     text,
//     attachments,
//   });
// };

import nodemailer from "nodemailer";
import logger from "../handlers/logger";

export const sendEmail = async (
  recipient: string,
  subject: string,
  text: string,
  attachments = []
) => {
  const transporter = nodemailer.createTransport({
    port: 465,
    host: "smtp.gmail.com",
    auth: {
      user: "khansuzair1@gmail.com",
      pass: "yena sysp bncd uwvz",
    },
    // secure: false, // Use SSL
  });

  await new Promise((resolve, reject) => {
    // Verify connection configuration
    transporter.verify((error, success) => {
      if (error) {
        logger.error("Error verifying SMTP connection:", error);
        reject(error);
      } else {
        logger.info("SMTP server is ready to send messages.");
        resolve(success);
      }
    });
  });

  const mailData = {
    from: {
      name: "Your Name or App Name",
      address: "khansuzair1@gmail.com",
    },
    to: recipient,
    subject,
    text,
    html: text, // Optionally include HTML content
    attachments,
  };

  await new Promise((resolve, reject) => {
    // Send mail
    transporter.sendMail(mailData, (err, info) => {
      if (err) {
        logger.error("Error sending email:", err);
        reject(err);
      } else {
        logger.info("Email sent successfully:", info);
        resolve(info);
      }
    });
  });
};
