import userModel from "../models/user.model";
import { IUser } from "../types/users.interface";

export default {
  findUserByEmail: (email: string, select: string = "") => {
    return userModel.findOne({ email }).select(select);
  },
  findUserById: (id: string) => {
    return userModel.findById(id);
  },
  findUserByName: (name: string, select: string = "") => {
    return userModel.findOne({ name }).select(select);
  },
  findUserByConfirmationTokenAndCode: (token: string, code: string) => {
    return userModel.findOne({
      "accountConfimation.token": token,
      "accountConfimation.code": code,
    });
  },
  updateUserRole: (id: string, newRole: string) => {
    return userModel.findByIdAndUpdate(id, { role: newRole }, { new: true });
  },
  createUser: (payload: IUser) => {
    return userModel.create(payload);
  },
};
