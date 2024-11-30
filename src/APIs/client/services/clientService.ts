import { createClient, getClientByEmail } from "../repository/clientRepository";
import { IClient } from "../models/clientModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
// import config from "../../../config/config";

// const JWT_SECRET = config.TOKENS.ACCESS.SECRET;
// const JWT_SECRET = config.JWT_SECRET_KEY;

export const registerClient = async (clientData: IClient): Promise<IClient> => {
  const { email, password } = clientData;
  // Check if client already exists
  const existingClient = await getClientByEmail(email);
  if (existingClient) {
    throw new Error("Client with this email already exists");
  }

  // Hash the password before saving
  const salt = await bcrypt.genSalt(10);
  clientData.password = await bcrypt.hash(password, salt);

  return createClient(clientData);
};

export const loginClient = async (
  email: string,
  password: string
): Promise<{ token: string; client: IClient }> => {
  // Find client by email
  const client = await getClientByEmail(email);
  if (!client) {
    throw new Error("Invalid email or password");
  }

  // Compare the provided password with the hashed password in the database
  const isMatch = await bcrypt.compare(password, client.password);
  if (!isMatch) {
    throw new Error("Invalid email or password");
  }
  console.log(client._id);
  // Generate JWT token
  const token = jwt.sign(
    { _id: client._id },
    "suzair" // Use env var in production
  );
  // Use env var // Use env var in production

  return { token, client };
};
