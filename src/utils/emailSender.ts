import nodemailer from "nodemailer";
import config from "../config/config";
import logger from "../handlers/logger";

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
  logger.info(`the email is `, { meta: transporter });
  await transporter.sendMail({
    from: "khansuzair1@gmail.com",
    to: recipient,
    subject,
    text,
    attachments,
  });
};

// logger.info(`the email is send: `,{meta:sendEmail})
