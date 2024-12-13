import { Request } from "express";
import { EUserRoles } from "../../../../constant/users";

// export interface IRegisterRequest {
//   name: string;
//   email: string;
//   phoneNumber: string;
//   password: string;
//   consent: boolean;
// }
export interface IRegisterRequest {
  name: string;
  email: string;
  phoneNumber: string;
  consent?: boolean;
  password?: string;
  role?: EUserRoles;
}

export interface IRegister extends Request {
  body: IRegisterRequest;
}

export interface IConfirmRegistration extends Request {
  params: {
    token: string;
  };
  query: {
    code: string;
  };
}

export interface ILoginRequest {
  name: string;
  password: string;
}

export interface ILogin extends Request {
  body: ILoginRequest;
}
