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
import userRepository from "../_shared/repo/user.repository";

dayjs.extend(utc);

export const registrationService = async (payload: IRegisterRequest) => {
  let { name, phoneNumber, email, password } = payload;

  logger.info(`the name from registration service is : ${name}`);

  const existingClient = await userRepository.fintUserByName(name); // Ensure the name is unique

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

  //Validate if user already exists
  await validate.userAlreadyExistsViaEmail(email);

  //Encrypting password
  const hashedPassword = await hashing.hashPassword(password);

  //Account confimation token and code generation
  const token = code.generateRandomId();
  const OTP = code.generateOTP(6);

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
    role: EUserRoles.USER,
    timezone: timezone[0].name,
    password: hashedPassword,
    consent: true,
  };

  //adding user to db
  const newUser = await query.createUser(userObj);

  //Sending confimation emails
  const confimationURL = `Frontendhost/confimation/${token}?code=${OTP}`;
  const to = email;
  const subject = `Confirm your account`;
  const text = `Hey , Your username is ${name}  and \n  your Password is ${password}\n${confimationURL}`;

  sendEmail(to, subject, text).catch((error) => {
    logger.error("Error sending email", {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      meta: error,
    });
  });

  return {
    success: true,
    _id: newUser._id,
  };
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
  const user = await query.fintUserByName(name, "password role");
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
    [EUserRoles.ADMIN, "Welcome Admin!"],
    [EUserRoles.EMPLOYEE_MANAGER, "Hello Employee Manager!"],
    [EUserRoles.EMPLOYEE_STAFF, "Hello Employee Staff!"],
    [EUserRoles.EMPLOYEE_INTERN, "Welcome Intern!"],
    [EUserRoles.USER, "Hello User!"],
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
