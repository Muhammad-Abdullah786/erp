import responseMessage from "../../../constant/responseMessage";
import parsers from "../../../utils/parsers";
import {
  ILoginRequest,
  IRegisterRequest,
} from "./types/authentication.interface";
import dateAndTime from "../../../utils/date-and-time";
import { CustomError } from "../../../utils/errors";
import query from "../_shared/repo/user.repository";
import hashing from "../../../utils/hashing";
import code from "../../../utils/code";
import { IUser } from "../_shared/types/users.interface";
import { EUserRoles } from "../../../constant/users";
import { sendEmail } from "../../../utils/emailSender";
import logger from "../../../handlers/logger";
import validate from "./validation/validations";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import jwt from "../../../utils/jwt";
import config from "../../../config/config";
import { IToken } from "../_shared/types/token.interface";
import tokenRepository from "../_shared/repo/token.repository";
import { generateRandomPassword } from "../_shared/automateRegistration/generateClient";
import userRepository from "../_shared/repo/user.repository";
dayjs.extend(utc);


export const registrationService = async (payload: IRegisterRequest) => {
  let { name, phoneNumber, email, password } = payload;
  logger.info(`The name from registration service is: ${name}`);

  // Ensure the name is unique
  const existingClient = await userRepository.findUserByName(name);
  if (existingClient) {
    throw new Error("Client with this username already exists");
  }

  // Parsing and validating phone number
  const { countryCode, internationalNumber, isoCode } =
    parsers.parsePhoneNumber("+" + phoneNumber);
  if (!countryCode || !internationalNumber || !isoCode) {
    throw new CustomError(responseMessage.auth.INVALID_PHONE_NUMBER, 422);
  }

  // Extracting country timezone
  const timezone = dateAndTime.countryTimezone(isoCode);
  if (!timezone || timezone.length === 0) {
    throw new CustomError(responseMessage.auth.INVALID_PHONE_NUMBER, 422);
  }

  // Validate if user already exists
  await validate.userAlreadyExistsViaEmail(email);

  // Generate random password if not provided
  password = generateRandomPassword();

  // Encrypting password
  const hashedPassword = await hashing.hashPassword(password);

  // Account confirmation token and code generation
  const token = code.generateRandomId();
  const OTP = code.generateOTP(6);

  // Adding user to db
  const userObj: IUser = {
    name: payload.name,
    email,
    phoneNumber: {
      countryCode,
      isoCode,
      internationalNumber,
    },
    accountConfimation: {
      status: false,
      token,
      code: OTP,
      timestamp: null,
    },
    passwordReset: {
      token: null,
      expiry: null,
      lastResetAt: null,
    },
    lastLoginAt: null,
    role: payload.role || EUserRoles.USER, // Default to USER if not provided
    timezone: timezone[0].name,
    password: hashedPassword,
    consent: true,
  };

  const newUser = await query.createUser(userObj);
  
  // Sending confirmation emails with username and password
  // const confirmationURL = `Frontendhost/confirmation/${token}?code=${OTP}`;
  const to = email;
  const subject = `Confirm your account`;
  const text = `Hey, your username is ${name} and \n your password is ${password}\n`;

  await sendEmail(to, subject, text).catch((error) => {
    logger.error("Error sending email", { meta: error });
  });

  return {
    success: true,
    _id: newUser._id,
  };
};

export const updateRoleService = async (userId: string, newRole: string) => {
  // Convert the string newRole into an EUserRoles enum if valid
  const roleEnumValue = (Object.values(EUserRoles) as string[]).find(
    (role) => role === newRole
  );

  if (!roleEnumValue) {
    throw new CustomError("Invalid role", 400);
  }

  // Update the user's role
  const updatedUser = await query.updateUserRole(
    userId,
    roleEnumValue as EUserRoles
  );

  if (!updatedUser) {
    throw new CustomError("User not found", 404);
  }

  return updatedUser;
};
export const accountConfirmationService = async (
  token: string,
  code: string
) => {
  const user = await query.findUserByConfirmationTokenAndCode(token, code);
  if (!user) {
    throw new CustomError(responseMessage.auth.USER_NOT_EXIST, 404);
  }

  //Check if account is already confirmed
  if (user.accountConfimation.status) {
    throw new CustomError(
      responseMessage.auth.ALREADY_CONFIRMED("Account"),
      400
    );
  }

  //if not, lets confirm
  user.accountConfimation.status = true;
  user.accountConfimation.timestamp = dayjs().utc().toDate();

  await user.save();

  //Sending confimation emails
  const to = user.email;
  const subject = `Welcome to the base! `;
  const text = `Account has been confirmed.`;

  sendEmail(to, subject, text).catch((error) => {
    logger.error("Error sending email", {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      meta: error,
    });
  });

  return {
    success: true,
    _id: user._id,
  };
};

export const loginService = async (payload: ILoginRequest) => {
  const { name, password } = payload;

  // Check if the user is registered
  const user = await query.findUserByName(name, "password role");
  if (!user) {
    throw new CustomError(responseMessage.NOT_FOUND("User"), 404);
  }

  // Validate password
  const isValidPassword = await hashing.comparePassword(
    password,
    user.password
  );
  if (!isValidPassword) {
    throw new CustomError(responseMessage.auth.INVALID_EMAIL_OR_PASSWORD, 400);
  }
  logger.info(`the total info of user from the service file is  is : `, {
    meta: user.role,
  });
  // Generate tokens
  const accessToken = jwt.generateToken(
    { userId: user._id },
    config.TOKENS.ACCESS.SECRET,
    config.TOKENS.ACCESS.EXPIRY
  );
  const refreshToken = jwt.generateToken(
    { userId: user._id },
    config.TOKENS.REFRESH.SECRET,
    config.TOKENS.REFRESH.EXPIRY
  );
  const roleGreetings = new Map([
    [EUserRoles.ADMIN, "admin"],
    [EUserRoles.EMPLOYEE_HR, "hr"],
    [EUserRoles.EMPLOYEE_SALES, "sales"],
    [EUserRoles.EMPLOYEE_ACCOUNTS, "accounts"],
    [EUserRoles.USER, "user"],
    [EUserRoles.DRIVER, "driver"],
  ]);

  const greetingMessage = roleGreetings.get(user.role);

  user.lastLoginAt = dayjs().utc().toDate();
  await user.save();

  // Storing refresh token into DB
  const token: IToken = {
    token: refreshToken,
  };
  await tokenRepository.createToken(token);

  // Return response with user info and tokens
  return {
    success: true,
    user: {
      ...user.toObject(), // Ensure user data is returned as plain object
      accessToken,
      refreshToken,
      greeting: greetingMessage,
    },
  };
};
