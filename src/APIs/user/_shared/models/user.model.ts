import mongoose from "mongoose";
import { IUser } from "../types/users.interface";
import { EUserRoles } from "../../../../constant/users";

const userSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      minlength: 2,
      maxlength: 72,
      required: true,
<<<<<<< HEAD
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    phoneNumber: {
      _id: false,
      isoCode: {
        type: String,
        required: true,
      },
      countryCode: {
        type: String,
        required: true,
      },
      internationalNumber: {
        type: String,
        required: true,
      },
    },
    timezone: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      //   required: true,
      default: "Abbaxi!212",
      select: false,
    },
    role: {
      type: String,
      default: EUserRoles.USER,
      enum: EUserRoles,
      required: true,
    },
    accountConfimation: {
      _id: false,
      status: {
        type: Boolean,
        default: false,
        required: true,
      },
      token: {
        type: String,
        rquired: true,
      },
      code: {
        type: String,
        rquired: true,
      },
      timestamp: {
        type: Date,
        rquired: true,
      },
    },
    passwordReset: {
      _id: false,
      token: {
        type: String,
        default: null,
      },
      expiry: {
        type: Number,
        default: null,
      },
      lastResetAt: {
        type: Date,
        default: null,
      },
    },
    lastLoginAt: {
      type: Date,
      default: null,
    },
    consent: {
      type: Boolean,
      default: true,
      //   required: true,
    },
  },
  { timestamps: true }
);

=======
      unique: true,
    },

    email: {
      type: String,
      unique: true,
      required: true,
    },
    phoneNumber: {
      _id: false,
      isoCode: {
        type: String,
        required: true,
      },
      countryCode: {
        type: String,
        required: true,
      },
      internationalNumber: {
        type: String,
        required: true,
      },
    },
    timezone: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      default: EUserRoles.USER,
      enum: EUserRoles,
      required: true,
    },
    accountConfimation: {
      _id: false,
      status: {
        type: Boolean,
        default: false,
        required: true,
      },
      token: {
        type: String,
        rquired: true,
      },
      code: {
        type: String,
        rquired: true,
      },
      timestamp: {
        type: Date,
        rquired: true,
      },
    },
    passwordReset: {
      _id: false,
      token: {
        type: String,
        default: null,
      },
      expiry: {
        type: Number,
        default: null,
      },
      lastResetAt: {
        type: Date,
        default: null,
      },
    },
    lastLoginAt: {
      type: Date,
      default: null,
    },
    consent: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true }
);

>>>>>>> 8212b5bd73cab692a6cb1939a7d3550f900a10df
export default mongoose.model<IUser>("User", userSchema);
