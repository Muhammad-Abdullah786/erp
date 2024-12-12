import nodemailer from "nodemailer";
// import logger from "../handlers/logger";
// import config from '../config/config';

export const sendEmail = async (
  recipient: string,
  subject: string,
  text: string,
  attachments: any[] = []
) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "khansuzair1@gmail.com",
      pass: "yena sysp bncd uwvz",
    },
  });

  await transporter.sendMail({
    from: "khansuzair1@gmail.com",
    to: recipient,
    subject,
    text,
    attachments,
  });
};
