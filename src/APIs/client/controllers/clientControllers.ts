// import { registerClient, loginClient } from "../services/clientService";
// import { clientValidation } from "../validations/clientValidation";
// import { IClient } from "../models/clientModel";
// import jwt from "jsonwebtoken";
// import config from "../../../config/config";
// import { loginValidation } from "../validations/clientValidation";
// import bcrypt from "bcrypt";
// import Joi from "joi";
// import {
//   verifyResetToken,
//   updateClientPassword,
//   findClientByEmail,
//   saveResetToken,
// } from "../repository/clientRepository";
// import { v4 as uuidv4 } from "uuid";
// import { Resend } from "resend";

// const JWT_SECRET = config.TOKENS.ACCESS.SECRET;
// export const createClient = async (req: any, res: any) => {
//   try {
//     // Validate client input
//     const { error } = clientValidation.validate(req.body);
//     if (error) return res.status(400).json({ error: error.details[0].message });

//     // Register the client
//     const clientData: IClient = req.body;
//     const newClient = await registerClient(clientData);

//     // Generate JWT token
//     const token = jwt.sign(
//       { id: newClient._id, email: newClient.email },
//       JWT_SECRET || "secretKey", // Use an environment variable for secret in production
//       { expiresIn: "1h" } // Token expires in 1 hour
//     );

//     // Return the client data and token in response
//     res.status(201).json({ client: newClient, token });
//   } catch (err: any) {
//     res.status(500).json({ error: err.message });
//   }
// };

// export const loginClientController = async (req: any, res: any) => {
//   try {
//     // Validate login input
//     const { error } = loginValidation.validate(req.body);
//     if (error) return res.status(400).json({ error: error.details[0].message });

//     const { email, password } = req.body;

//     // Attempt login
//     const { token, client } = await loginClient(email, password);

//     // Return the token and client info in response
//     res.status(200).json({ token, client });
//   } catch (err: any) {
//     res.status(400).json({ error: err.message });
//   }
// };
// const passwordValidation = (password: string) => {
//   const upperCasePattern = /[A-Z]/; // At least one uppercase letter
//   const numberPattern = /[0-9]/; // At least one number
//   const specialCharacterPattern = /[!@#$%^&*(),.?":{}|<>]/; // At least one special character

//   return (
//     upperCasePattern.test(password) &&
//     numberPattern.test(password) &&
//     specialCharacterPattern.test(password) &&
//     password.length >= 8 // Optional: enforce minimum length
//   );
// };

// export const updatePassword = async (req: any, res: any): Promise<Response> => {
//   try {
//     const { token, newPassword } = req.body;

//     // Validate the new password
//     if (!passwordValidation(newPassword)) {
//       return res.status(400).json({
//         message:
//           "Password must contain at least one uppercase letter, one number, one special character, and be at least 8 characters long.",
//       });
//     }

//     // Verify the reset token
//     const client = await verifyResetToken(token);

//     if (!client) {
//       return res
//         .status(400)
//         .json({ message: "Invalid or expired reset token" });
//     }

//     // Hash the new password
//     client.password = await bcrypt.hash(newPassword, 10);

//     // Save the updated client document
//     await updateClientPassword(client.id, client.password);

//     return res.status(200).json({ message: "Password updated successfully" });
//   } catch (error: any) {
//     return res.status(400).json({ message: error.message });
//   }
// };
// const EMAIL_API_KEY = config.EMAIL_API_KEY;

// const resend = new Resend(EMAIL_API_KEY);

// const sendResetEmail = async (email: string, token: string) => {
//   const resetUrl = `http://localhost:3001/updatePassword?token=${token}`;

//   try {
//     // Use a verified domain in the 'from' field
//     const response = await resend.emails.send({
//       from: `khansuzair1@gmail.com <onboarding@resend.dev>`,
//       to: email,
//       subject: "Password Reset Request",
//       html: `<p>You requested a password reset. Click <a href="${resetUrl}">here</a> to reset your password.</p>`,
//     });

//     console.log("Email sent successfully:", response);
//   } catch (error) {
//     console.error("Error sending reset email:", error);
//     throw new Error("Failed to send reset email");
//   }
// };

// export const resetPassword = async (req: any, res: any): Promise<Response> => {
//   const { email } = req.body;

//   // Validate email input
//   const { error } = Joi.object({
//     email: Joi.string().email().required().messages({
//       "string.email": "Please enter a valid email address",
//       "any.required": "Email is required",
//     }),
//   }).validate(req.body);

//   if (error) {
//     return res.status(400).json({ message: error.details[0].message });
//   }

//   // Find user by email
//   const user = await findClientByEmail(email);
//   if (!user) {
//     return res.status(404).json({ message: "User not found" });
//   }

//   // Generate a reset token and expiration time
//   const resetToken = uuidv4(); // Consider using a JWT for more security
//   const tokenExpiration = Date.now() + 3600000; // 1 hour

//   // Save reset token and expiration
//   await saveResetToken(user.id, resetToken, tokenExpiration);
//   await sendResetEmail(email, resetToken); // You’ll need to implement this

//   return res.status(200).json({ message: "Password reset email sent" });
// };

import { registerClient, loginClient } from "../services/clientService";
import { clientValidation } from "../validations/clientValidation";
import { IClient } from "../models/clientModel";
import jwt from "jsonwebtoken";
import { loginValidation } from "../validations/clientValidation";
import bcrypt from "bcrypt";
import config from "../../../config/config";
import Joi from "joi";
import {
  verifyResetToken,
  updateClientPassword,
  findClientByEmail,
  saveResetToken,
} from "../repository/clientRepository";
import { v4 as uuidv4 } from "uuid";
import nodemailer from "nodemailer"; // Importing nodemailer

// Nodemailer Transporter Configuration
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: config.EMAIL_USER || "", // Your email
    pass: config.EMAIL_PASS || "", // Your email app password
  },
});

const JWT_SECRET = config.TOKENS.ACCESS.SECRET;

export const createClient = async (req: any, res: any) => {
  try {
    const { error } = clientValidation.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const clientData: IClient = req.body;
    const newClient = await registerClient(clientData);

    const token = jwt.sign(
      { id: newClient._id, email: newClient.email },
      JWT_SECRET || "secretKey",
      { expiresIn: "1h" }
    );

    res.status(201).json({ client: newClient, token });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const loginClientController = async (req: any, res: any) => {
  try {
    const { error } = loginValidation.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { email, password } = req.body;
    const { token, client } = await loginClient(email, password);

    res.status(200).json({ token, client });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

const passwordValidation = (password: string) => {
  const upperCasePattern = /[A-Z]/;
  const numberPattern = /[0-9]/;
  const specialCharacterPattern = /[!@#$%^&*(),.?":{}|<>]/;

  return (
    upperCasePattern.test(password) &&
    numberPattern.test(password) &&
    specialCharacterPattern.test(password) &&
    password.length >= 8
  );
};

export const updatePassword = async (req: any, res: any): Promise<Response> => {
  try {
    const { token, newPassword } = req.body;

    if (!passwordValidation(newPassword)) {
      return res.status(400).json({
        message:
          "Password must contain at least one uppercase letter, one number, one special character, and be at least 8 characters long.",
      });
    }

    const client = await verifyResetToken(token);
    if (!client) {
      return res
        .status(400)
        .json({ message: "Invalid or expired reset token" });
    }

    client.password = await bcrypt.hash(newPassword, 10);
    await updateClientPassword(client.id, client.password);

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

// Function to send reset email using Nodemailer
const sendResetEmail = async (email: string, token: string) => {
  const resetUrl = `https://erp-woad-pi.vercel.app/v1/updatePassword?token=${token}`;

  try {
    const response = await transporter.sendMail({
      from: `"Your Name" <${config.EMAIL_USER}>`, // Sender email address
      to: email, // Receiver's email
      subject: "Password Reset Request",
      html: `<p>You requested a password reset. Click <a href="${resetUrl}">here</a> to reset your password.</p>`,
    });

    console.log("Email sent successfully:", response);
  } catch (error) {
    console.error("Error sending reset email:", error);
    throw new Error("Failed to send reset email");
  }
};

export const resetPassword = async (req: any, res: any): Promise<Response> => {
  const { email } = req.body;

  const { error } = Joi.object({
    email: Joi.string().email().required().messages({
      "string.email": "Please enter a valid email address",
      "any.required": "Email is required",
    }),
  }).validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const user = await findClientByEmail(email);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const resetToken = uuidv4();
  const tokenExpiration = Date.now() + 3600000;

  await saveResetToken(user.id, resetToken, tokenExpiration);
  await sendResetEmail(email, resetToken);

  return res.status(200).json({ message: "Password reset email sent" });
};
