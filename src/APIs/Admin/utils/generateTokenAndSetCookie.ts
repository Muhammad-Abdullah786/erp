<<<<<<< HEAD
import jwt from "jsonwebtoken";
import { Response } from "express";
=======
import jwt from 'jsonwebtoken';
import { Response } from 'express';
>>>>>>> main

// Typing the function parameters
export const generateTokenAndSetCookie = (
  res: Response,
  userId: string
): string => {
  if (!process.env.JWT_SECRET) {
<<<<<<< HEAD
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Ensures the cookie is only sent over HTTPS in production
    sameSite: "strict",
=======
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Ensures the cookie is only sent over HTTPS in production
    sameSite: 'strict',
>>>>>>> main
    maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie expiration in milliseconds (7 days)
  });

  return token;
};
