import joi from "joi";
import {
  ILoginRequest,
  IRegisterRequest,
} from "../types/authentication.interface";
import { EUserRoles } from "../../../../constant/users";
export const registerSchema = joi.object<IRegisterRequest, true>({
  name: joi.string().min(2).max(72).trim().required(),
  email: joi.string().email().required(),
  phoneNumber: joi.string().min(4).max(20).required(),
  password: joi
    .string()
    .min(8)
    .max(24)
    .regex(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/)
    .trim()
    .required(),
  consent: joi.boolean().valid(true).required(),
  role: joi
    .string()
    .valid(...Object.values(EUserRoles))
    .optional(), // Allow role
});

export const loginSchema = joi.object<ILoginRequest, true>({
  name: joi.string().min(2).max(72).trim().required(),
  // password: joi
  //   .string()
  //   .min(8)
  //   .max(24)
  //   .regex(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/)
  //   .trim()
  //   .required(),
  password: joi.string().required().messages({
    "string.min": "Password must be at least 8 characters long.",
    "string.max": "Password must be at most 24 characters long.",
    "string.pattern.base":
      "Password must contain at least one uppercase letter, one lowercase letter, and one special character.",
    "any.required": "Password is required.",
  }),
});
