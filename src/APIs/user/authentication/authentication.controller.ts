import { NextFunction, Request, Response } from "express";
import httpResponse from "../../../handlers/httpResponse";
import responseMessage from "../../../constant/responseMessage";
import httpError from "../../../handlers/errorHandler/httpError";
import {
  IConfirmRegistration,
  ILogin,
  ILoginRequest,
  IRegister,
  IRegisterRequest,
} from "./types/authentication.interface";
import { validateSchema } from "../../../utils/joi-validate";
import { loginSchema, registerSchema } from "./validation/validation.schema";
import {
  accountConfirmationService,
  loginService,
  registrationService,
  updateRoleService,
} from "./authentication.service";
import { CustomError } from "../../../utils/errors";
import asyncHandler from "../../../handlers/async";
import health from "../../../utils/health";
import { EApplicationEnvironment } from "../../../constant/application";
import config from "../../../config/config";
import query from "../_shared/repo/token.repository";
import logger from "../../../handlers/logger";
import { EUserRoles } from "../../../constant/users";
import {
  generateRandomPassword,
  generateUniqueUsername,
  generateRandomString,
} from "../_shared/automateRegistration/generateClient";
import userRepository from "../_shared/repo/user.repository";
import userModel from "../_shared/models/user.model";
export default {
  // register: asyncHandler(
  //   async (request: Request, response: Response, next: NextFunction) => {
  //     try {
  //       const { body } = request as IRegister;

  //       //Payload validation
  //       const { error, payload } = validateSchema<IRegisterRequest>(
  //         registerSchema,
  //         body
  //       );
  //       if (error) {
  //         return httpError(next, error, request, 422);
  //       }

  //       const registrationResult = await registrationService(payload);
  //       if (registrationResult.success === true) {
  //         httpResponse(
  //           response,
  //           request,
  //           201,
  //           responseMessage.auth.USER_REGISTERED,
  //           registrationResult
  //         );
  //       }
  //     } catch (error) {
  //       if (error instanceof CustomError) {
  //         httpError(next, error, request, error.statusCode);
  //       } else {
  //         httpError(next, error, request, 500);
  //       }
  //     }
  //   }
  // ),
  // register: asyncHandler(
  //   async (request: Request, response: Response, next: NextFunction) => {
  //     try {
  //       const { body } = request as IRegister;

  //       // Payload validation
  //       const { error, payload } = validateSchema<IRegisterRequest>(
  //         registerSchema,
  //         body
  //       );
  //       if (error) {
  //         return httpError(next, error, request, 422);
  //       }

  //       // Check if user already exists
  //       const existingUser = await userRepository.findUserByEmail(
  //         payload.email,
  //         "name"
  //       );

  //       let finalUsername: string;
  //       let password: string | null = null; // Initialize password as null

  //       if (existingUser) {
  //         // User already exists
  //         finalUsername = existingUser.name;
  //         logger.info(
  //           `Existing user found. Using existing username: ${finalUsername}`
  //         );
  //       } else {
  //         // Generate new username and password for new users
  //         const username = await generateUniqueUsername(payload.name);
  //         const randomStr = generateRandomString(4, 7);
  //         finalUsername = `${username}${randomStr}`;
  //         password = generateRandomPassword(); // Generate password only for new users

  //         const clientData: IRegisterRequest = {
  //           name: finalUsername,
  //           email: payload.email,
  //           phoneNumber: payload.phoneNumber,
  //           password,
  //           consent: true,
  //         };

  //         logger.info(`Registering new user: ${clientData.name}`);

  //         // Register the user
  //         await registrationService(clientData);
  //       }

  //       const registrationResult = { success: true, user: finalUsername };

  //       // Send success response
  //       if (registrationResult.success === true) {
  //         httpResponse(
  //           response,
  //           request,
  //           201,
  //           responseMessage.auth.USER_REGISTERED,
  //           registrationResult
  //         );
  //       }
  //     } catch (error) {
  //       if (error instanceof CustomError) {
  //         httpError(next, error, request, error.statusCode);
  //       } else {
  //         httpError(next, error, request, 500);
  //       }
  //     }
  //   }
  // ),

  get_employee: async (request: any, response: any) => {
    try {
      if (request) {
      }
      // Find users whose role is either 'HR', 'Accounts', or 'Sales'
      const employees = await userModel.find({
        role: {
          $in: [
            EUserRoles.EMPLOYEE_HR,
            EUserRoles.EMPLOYEE_ACCOUNTS,
            EUserRoles.EMPLOYEE_SALES,
          ],
        },
      });

      if (employees.length === 0) {
        return response.status(404).json({ message: "No employees found." });
      }

      response.status(200).json({ employees });
    } catch (e) {
      response
        .status(500)
        .json({ message: "An error occurred while fetching employees." });
    }
  },

  register: asyncHandler(
    async (request: Request, response: Response, next: NextFunction) => {
      try {
        const { body } = request as IRegister;

        // Payload validation
        const { error, payload } = validateSchema<IRegisterRequest>(
          registerSchema,
          body
        );
        if (error) {
          return httpError(next, error, request, 422);
        }

        // Check if user already exists
        const existingUser = await userRepository.findUserByEmail(
          payload.email,
          "name"
        );
        logger.info(`Checking if user with email ${payload.email} exists`);
        console.log("Existing user.....----", existingUser); // Isse aapko pata chalega ke actual mein user mil raha hai ya nahi

        let finalUsername: string;
        let password: string | null = null; // Initialize password as null

        if (existingUser) {
          finalUsername = existingUser.name;
          logger.info(
            `Existing user found. Using existing username: ${finalUsername}`
          );
          // Correct response for existing user
          return httpResponse(
            response,
            request,
            409, // Conflict status code for already registered user
            "User already registered", // Custom message
            { success: false, user: finalUsername } // Return existing user info
          );
        } else {
          // Generate new username and password for new users
          const username = await generateUniqueUsername(payload.name);
          const randomStr = generateRandomString(4, 7);
          finalUsername = `${username}${randomStr}`;
          password = generateRandomPassword(); // Generate a random password

          // const clientData: IRegisterRequest = {
          //   name: finalUsername.toLowerCase(),
          //   email: payload.email,
          //   phoneNumber: payload.phoneNumber,
          // };
          const clientData: IRegisterRequest = {
            name: finalUsername.toLowerCase(),
            email: payload.email,
            phoneNumber: payload.phoneNumber,
            role: payload.role || EUserRoles.USER, // Default to USER if not provided
          };

          logger.info(`Registering new user: ${clientData.name}`);

          // Register the user
          await registrationService({ ...clientData, password }); // Send password to service
        }

        const registrationResult = { success: true, user: finalUsername };

        // Send success response
        if (registrationResult.success === true) {
          httpResponse(
            response,
            request,
            201,
            responseMessage.auth.USER_REGISTERED,
            registrationResult
          );
        }
      } catch (error) {
        if (error instanceof CustomError) {
          httpError(next, error, request, error.statusCode);
        } else {
          httpError(next, error, request, 500);
        }
      }
    }
  ),

  editUserRole: asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { id } = req.params;
        const { role } = req.body;
        console.log("Role", role);
        const updatedUser = await updateRoleService(id, role);
        httpResponse(
          res,
          req,
          200,
          "User role updated successfully",
          updatedUser
        );
      } catch (error) {
        if (error instanceof CustomError) {
          next(error);
        } else {
          next(new CustomError("Internal Server Error", 500));
        }
      }
    }
  ),
  confirmRegistration: asyncHandler(
    async (request: Request, response: Response, next: NextFunction) => {
      try {
        const { params, query } = request as IConfirmRegistration;

        const { token } = params;
        const { code } = query;

        const user = await accountConfirmationService(token, code);

        httpResponse(
          response,
          request,
          201,
          responseMessage.auth.USER_REGISTERED,
          user
        );
      } catch (error) {
        if (error instanceof CustomError) {
          httpError(next, error, request, error.statusCode);
        } else {
          httpError(next, error, request, 500);
        }
      }
    }
  ),

  login: asyncHandler(
    async (request: Request, response: Response, next: NextFunction) => {
      try {
        const { body } = request as ILogin;

        // Payload validation
        const { error, payload } = validateSchema<ILoginRequest>(
          loginSchema,
          body
        );
        if (error) {
          return httpError(next, error, request, 422);
        }

        // Call login service
        const isLoggedIn = await loginService(payload);
        if (isLoggedIn.success === true) {
          // Sending cookies
          const DOMAIN = health.getDomain();
          response
            .cookie("accessToken", isLoggedIn.user.accessToken, {
              path: "/v1",
              domain: DOMAIN,
              sameSite: "strict",
              maxAge: 1000 * config.TOKENS.ACCESS.EXPIRY,
              httpOnly: true,
              secure: !(config.ENV === EApplicationEnvironment.DEVELOPMENT),
            })
            .cookie("refreshToken", isLoggedIn.user.refreshToken, {
              path: "/v1",
              domain: DOMAIN,
              sameSite: "strict",
              maxAge: 1000 * config.TOKENS.REFRESH.EXPIRY,
              httpOnly: true,
              secure: !(config.ENV === EApplicationEnvironment.DEVELOPMENT),
            });

          // Role-based greeting using Map for better scalability

          logger.info(`the role of this user is : `, {
            meta: isLoggedIn,
          });

          // Respond with the greeting message and tokens
          httpResponse(
            response,
            request,
            200,
            responseMessage.auth.LOGIN_SUCCESSFUL,
            {
              accessToken: isLoggedIn.user.accessToken,
              refreshToken: isLoggedIn.user.refreshToken,
              greeting: isLoggedIn.user.greeting,
            }
          );
        }
      } catch (error) {
        if (error instanceof CustomError) {
          httpError(next, error, request, error.statusCode);
        } else {
          httpError(next, error, request, 500);
        }
      }
    }
  ),

  logout: asyncHandler(
    async (request: Request, response: Response, next: NextFunction) => {
      try {
        const { cookies } = request;
        const { refreshToken } = cookies as {
          refreshToken: string | undefined;
        };
        if (refreshToken) {
          await query.deleteToken(refreshToken);
        }

        const DOMAIN = health.getDomain();
        //Clearing cookies
        response
          .clearCookie("accessToken", {
            path: "/v1",
            domain: DOMAIN,
            sameSite: "strict",
            maxAge: 1000 * config.TOKENS.ACCESS.EXPIRY,
            httpOnly: true,
            secure: !(config.ENV === EApplicationEnvironment.DEVELOPMENT),
          })
          .clearCookie("refreshToken", {
            path: "/v1",
            domain: DOMAIN,
            sameSite: "strict",
            maxAge: 1000 * config.TOKENS.REFRESH.EXPIRY,
            httpOnly: true,
            secure: !(config.ENV === EApplicationEnvironment.DEVELOPMENT),
          });

        httpResponse(response, request, 200, responseMessage.SUCCESS, null);
      } catch (error) {
        httpError(next, error, request, 500);
      }
    }
  ),
};
