const Contaier_BD = require("../models/container_models");
import {
  generateRandomPassword,
  generateUniqueUsername,
  generateRandomString,
} from "../../user/_shared/automateRegistration/generateClient";
import { IRegisterRequest } from "../../user/authentication/types/authentication.interface";
import { registrationService } from "../../user/authentication/authentication.service";
import userRepository from "../../user/_shared/repo/user.repository";
import logger from "../../../handlers/logger";
import axios from "axios";


export default {
  save_book_container: async (body: any , devices : any) => {
    try {
      // Check if the user already exists
      const existingUser = await userRepository.findUserByEmail(body.sender_details.email, "name");
  
      let finalUsername: string;
      let password: string | null = null; // Initialize password as null
  
      if (existingUser) {
        // User already exists
        finalUsername = existingUser.name;
        logger.info(`Existing user found. Using existing username: ${finalUsername}`);
      } else {
        // Generate new username and password for new users
        const username = await generateUniqueUsername(body.sender_details.name);
        const randomStr = generateRandomString(4, 7);
        finalUsername = `${username}${randomStr}`;
        password = generateRandomPassword(); // Generate password only for new users
  
        const clientData: IRegisterRequest = {
          name: finalUsername,
          email: body.sender_details.email,
          phoneNumber: body.sender_details.phone,
          password,
          consent: true,
        };
  
        logger.info(`Registering new user: ${clientData.name}`);
  
        // Register the user
        await registrationService(clientData);
      }

      const deviceIds = devices.result.map((device : any) => device.id);
      const existingDevices = await Contaier_BD.find({ tracking_id: { $in: deviceIds } });
      // Extract the IDs that exist in the database
    const existingDeviceIds = existingDevices.map((container : any) => container.tracking_id);
      // IDs not found in the database
    const missingDeviceIds = deviceIds.filter((id : any) => !existingDeviceIds.includes(id));
    console.log(missingDeviceIds);
  
      // Save container details
      body.sender_details.name = finalUsername; // Assign the final username to sender_details.name
      body.tracking_id = missingDeviceIds[0];
      const container = new Contaier_BD(body);
      const savedContainer = await container.save();
  
      if (!savedContainer) {
        throw new Error("Failed to book container");
      }
  
      return { container: savedContainer, user: finalUsername };
    } catch (error) {
      logger.error("Error saving container and registering client", {
        meta: error,
      });
      throw error;
    }
  },
  


  // FIXME: if something went wrong use below code its working
  // save_book_conatiner: async (body: any) => {
  //   try {
  //     // Generate username and password
  //     const username = await generateUniqueUsername(body.sender_details.name);
  //     const randomStr = generateRandomString(4, 7); // Generate the random string
  //     const finalUsername = `${username}${randomStr}`; // Combine the username with the random string
  //     const password = generateRandomPassword();

  //     const clientData: IRegisterRequest = {
  //       name: finalUsername, 
  //       email: body.sender_details.email,
  //       phoneNumber: body.sender_details.phone,
  //       password,
  //       consent: true,
  //     };

  //     logger.info(`the data of client is: `, { meta: clientData.name });

  //     // Save container details
  //     //FIXME: you need to save the unique user name here
  //     body.sender_details.name = finalUsername; // Assign the final username to sender_details.name
  //     const container = new Contaier_BD(body);
  //     const savedContainer = await container.save();

  //     if (!savedContainer) {
  //       throw new Error("Failed to book container");
  //     }

  //     // Validate and register the user
  //     const newClient = await registrationService(clientData); // Register the user with the final username

  //     // Generate PDF and send email
  //     const pdfDir = "D:\\New_ERP_Containers\\erp\\src\\APIs\\container\\pdfs";
  //     const pdfFileName = `booking_${container._id}.pdf`;
  //     const pdfPath = `${pdfDir}\\${pdfFileName}`;

  //     if (!fs.existsSync(pdfDir)) {
  //       fs.mkdirSync(pdfDir, { recursive: true });
  //     }

  //     await generatePDF(savedContainer, pdfPath);

  //     // Send email with PDF and login details
  //     const emailBody = `
  //       Booking Confirmation Attached.\n
  //       Login Details:
  //       Username: ${clientData.name}
  //       Password: ${clientData.password}
  //     `;

  //     await sendEmail(clientData.email, "Booking Confirmation", emailBody, [
  //       { filename: pdfFileName, path: pdfPath },
  //     ]);

  //     return { container: savedContainer, client: newClient };
  //   } catch (error) {
  //     logger.error("Error saving container and registering client", {
  //       meta: error,
  //     });
  //     throw error;
  //   }
  // },

  update_book_conatiner_tracking: async (body: any, id: any) => {
    try {
      const { tracking_status, tracking_stages } = body;
      const container = await Contaier_BD.findById(id);
      if (!container) {
        throw new Error("Container not found");
      }

      // Update the tracking status and tracking stages
      container.tracking_status = tracking_status || container.tracking_status;

      // If tracking stages are provided, update them as well
      if (tracking_stages) {
        container.tracking_stages = {
          pickup: tracking_stages.pickup || { status: false, timestamp: null },
          inTransit: tracking_stages.inTransit || {
            status: false,
            timestamp: null,
          },
          delivered: tracking_stages.delivered || {
            status: false,
            timestamp: null,
          },
        };
      }

      // Save the updated container
      const updated = await container.save();
      return updated;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  get_container_details: async (user_id: any) => {
    try {
      const get_data = await Contaier_BD.find({ sender_id: user_id });
      if (!get_data) {
        throw new Error(`No Contaier History `);
      }
      return get_data;
    } catch (e) {
      console.log(e);
      throw e;
    }
  },
  // get_all_orders_container: async () => {
  //   try {
  //     const get_all_orders = await Contaier_BD.find({});
  //     if (!get_all_orders) {
  //       throw new Error("No Containers found");
  //     }
  //     return get_all_orders;
  //   } catch (e) {}
  // },
  get_all_orders_container: async () => {
    try {
      const get_all_orders = await Contaier_BD.find({});
      if (!get_all_orders) {
        throw new Error("No Containers found");
      }
      return get_all_orders;
    } catch (e) {
      console.error(e); // Log the error
      return []; // Return a default value like an empty array
    }
  },

  find_filter_orders: async (filter_body: any) => {
    try {
      const get_all_orders = await Contaier_BD.find(filter_body);
      if (!get_all_orders) {
        throw new Error("No Orders found");
      }
      return get_all_orders;
    } catch (error) {
      throw error;
    }
  },
  update_client_installment: async (body: any) => {
    try {
      const { containerId, installmentId, amount } = body;
      // Validate inputs
      if (!containerId || !installmentId || !amount) {
        throw new Error("Missing required fields.");
      }

      // Find the container by ID
      const container = await Contaier_BD.findById(containerId);
      if (!container) {
        throw new Error("Container not found.");
      }

      // Find the specific installment by ID
      const installment = container.installmentDetails.id(installmentId);
      if (!installment) {
        throw new Error("Installment not found.");
      }

      installment.status = "paid";
      installment.due_date = undefined; // Remove due date if paid

      // Update the remaining amount
      container.remaining_amount -= amount;
      if (container.remaining_amount < 0) container.remaining_amount = 0;

      // Save the updated container
      const updated_installment = await container.save();

      return updated_installment;
    } catch (error: any) {
      throw error;
    }
  },
  find_tracking_id  : async(tracking_id : any) => {
        try{
              const find_track = await axios.get(`https://flespi.io/gw/devices/${tracking_id}/messages` ,{
                    headers : {
                       Authorization : `FlespiToken o2fTkbO5RlrtKDlID7bc6sIibkyXQnqaNT5Br1Xtlb3Ufis06SIDE0weYKY6Dh8A`
                    }
              });
              return find_track.status;
        }
        catch(e){
          throw e;
        }
  }
};
