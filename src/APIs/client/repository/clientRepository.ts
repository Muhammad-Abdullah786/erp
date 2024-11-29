import { Client, IClient } from "../models/clientModel";

export const createClient = async (clientData: IClient): Promise<IClient> => {
  const client = new Client(clientData);
  return client.save();
};

export const getClientByEmail = async (
  email: string
): Promise<IClient | null> => {
  return Client.findOne({ email });
};

// In clientRepository.ts

export const findClientByEmail = async (email: string) => {
  return Client.findOne({ email });
};

export const saveResetToken = async (
  clientId: string,
  resetToken: string,
  tokenExpiration: number
) => {
  return Client.findByIdAndUpdate(
    clientId,
    { resetPasswordToken: resetToken, resetPasswordExpires: tokenExpiration },
    { new: true }
  );
};

export const updateClientPassword = async (
  clientId: string,
  newPassword: string
) => {
  return Client.findByIdAndUpdate(
    clientId,
    {
      password: newPassword,
      resetPasswordToken: null,
      resetPasswordExpires: null,
    },
    { new: true }
  );
};

export const verifyResetToken = async (token: string) => {
  const client = await Client.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  });

  return client;
};
