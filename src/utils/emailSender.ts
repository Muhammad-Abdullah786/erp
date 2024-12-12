import nodemailer from "nodemailer";
// import logger from "../handlers/logger";
import config from "../config/config";

export const sendEmail = async (
  recipient: string,
  subject: string,
  text: string,
  attachments: any[] = []
) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: config.EMAIL_USER,
      pass: config.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: config.EMAIL_USER,
    to: recipient,
    subject,
    text,
    attachments,
  });
};
