import mongoose from "mongoose";
import { IEmployeeModel } from "../types/employeeinterface";

const EmployeeSchema = new mongoose.Schema<IEmployeeModel>({
  name: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, "Please use a valid email address."],
  },
  password: { type: String, required: true },
  confirmPassword: { type: String, required: true },
  phoneno: { type: String, required: true },
  address: { type: String, required: true },
  cnic_no: { type: String, required: true, unique: true },
  profilePic: { type: String, default: "" }, // Store uploaded image path
});

const Employee = mongoose.model<IEmployeeModel>("Employee", EmployeeSchema);
export default Employee;
