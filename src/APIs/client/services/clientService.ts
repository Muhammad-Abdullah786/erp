import {
  createClient,
  getClientByUsername,
} from "../repository/clientRepository";
import { IClient } from "../models/clientModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../../../config/config";

// Replace with your secret
const JWT_SECRET = config.TOKENS.ACCESS.SECRET;

// Register a new client
export const registerClient = async (clientData: IClient): Promise<IClient> => {
  const { username, password } = clientData;

  // Check if client with email or username already exists
  const existingClient = await getClientByUsername(username);
  if (existingClient) {
    throw new Error("Client with this username already exists");
  }

  // Hash the password
  const salt = await bcrypt.genSalt(10);
  clientData.password = await bcrypt.hash(password, salt);

  return createClient(clientData);
};

// Login client
export const loginClient = async (
  username: string,
  password: string
): Promise<{ token: string; client: IClient }> => {
  const client = await getClientByUsername(username); // Find by username
  if (!client) {
    throw new Error("Invalid username or password");
  }

  const isMatch = await bcrypt.compare(password, client.password);
  if (!isMatch) {
    throw new Error("Invalid username or password");
  }

  // Generate token
  const token = jwt.sign({ _id: client._id }, JWT_SECRET);

  return { token, client };
};
