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

export const sendEmail = async (
  recipient: string,
  subject: string,
  text: string,
  attachments: any[] = [],
  replyTo?: string
) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "khansuzair1@gmail.com",
      pass: "yena sysp bncd uwvz", // Consider using environment variables for better security
    },
    secure: true, // Ensures TLS encryption
  });

  // Verify transporter connection
  await new Promise((resolve, reject) => {
    transporter.verify((error, success) => {
      if (error) {
        console.error("Error verifying transporter:", error);
        reject(error);
      } else {
        console.log("Transporter is ready to send emails");
        resolve(success);
      }
    });
  });

  const mailData = {
    from: "khansuzair1@gmail.com",
    to: recipient,
    subject,
    text,
    html: `<p>${text}</p>`, // Include HTML format for rich-text compatibility
    attachments,
    replyTo: replyTo || "khansuzair1@gmail.com", // Default to sender's email if replyTo is not provided
  };

  // Send the email
  await new Promise((resolve, reject) => {
    transporter.sendMail(mailData, (err, info) => {
      if (err) {
        console.error("Error sending email:", err);
        reject(err);
      } else {
        console.log("Email sent successfully:", info);
        resolve(info);
      }
    });
  });
};
