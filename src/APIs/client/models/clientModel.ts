import mongoose, { Schema, Document } from 'mongoose';

export interface IClient extends Document {
  name: string;
  username: string; // Added username here
  email: string;
  password: string;
  phone: string;
  address: string;
  cnicOrPassport: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: number;
}

const clientSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true }, // Unique username
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    cnicOrPassport: { type: String, required: true, unique:true },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Number },
  },
  { timestamps: true }
);

export const Client = mongoose.model<IClient>('Client', clientSchema);
