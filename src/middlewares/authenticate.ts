import { NextFunction, Request, Response } from "express";
// import { IAuthenticateRequest, IDecryptedJwt } from "../types/types";
import jwt from "../utils/jwt";
import config from "../config/config";
// import query from "../APIs/user/_shared/repo/user.repository";
import userModel from "../APIs/user/_shared/models/user.model";
import httpError from "../handlers/errorHandler/httpError";
import responseMessage from "../constant/responseMessage";
import asyncHandler from "../handlers/async";
declare global {
  namespace Express {
    interface Request {
      authenticatedUser?: any;
    }
  }
}

// export default asyncHandler(
//   async (request: Request, _response: Response, next: NextFunction) => {
//     try {
//       const req = request as IAuthenticateRequest;

//       const { cookies } = req;

//       const { accessToken } = cookies as {
//         accessToken: string | undefined;
//       };
//       const token = req.headers.token;
//       if (accessToken) {
//         const { userId } = jwt.verifyToken(
//           token as string,
//           config.TOKENS.ACCESS.SECRET
//         ) as IDecryptedJwt;

//         const user = await query.findUserById(userId);
//         if (user) {
//           req.authenticatedUser = user;
//           return next();
//         }
//       }
//       httpError(next, new Error(responseMessage.UNAUTHORIZED), request, 401);
//     } catch (error) {
//       httpError(next, error, request, 500);
//     }
//   }
// );

export default asyncHandler(
  async (request: Request, _response: Response, next: NextFunction) => {
    try {
      const token: any = request.headers.token;
      // console.log("toke n hy yeh " + token);
         console.log(token);
      if (token) {
        const {userId}: any = jwt.verifyToken(token, config.TOKENS.ACCESS.SECRET);
  
        // console.log(userId);
        const user = await userModel.findById({_id : userId });
        console.log('user' , user);
        // console.log("user", user);
        if (user) {
          request.authenticatedUser = user;
          return next();
        }
      }
      httpError(next, new Error(responseMessage.UNAUTHORIZED), request, 401);
    } catch (error) {
      httpError(next, error, request, 500);
    }
  }
);