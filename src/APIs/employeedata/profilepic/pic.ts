// import express, { Request, Response, Application } from "express";
// import multer from "multer";
// // import { v2 as cloudinary } from "cloudinary";
// import logger from "../../../handlers/logger";
// // const cloudinary= require("../utils/cloudinary.ts")
// import cloudinary from "../utils/cloudinary";

// const app: Application = express();
// const PORT = 4050;

// const storage = multer.diskStorage({
//   //@ts-ignore
//   filename: (req, file, cb) => {
//     cb(null, file.originalname);
//   },
// });
// const upload = multer({ storage });

// //@ts-ignore
// app.post("/upload", upload.single("image"), (req: Request, res: Response) => {
//   // Ensure `req.file` is not undefined
//   if (!req.file) {
//     return res.status(400).json({
//       success: false,
//       message: "No file uploaded",
//     });
//   }

//   // Upload file to Cloudinary
//   //@ts-ignore
//   cloudinary.uploader.upload(req.file.path, (err, result) => {
//     if (err) {
//       console.error(err);
//       return res.status(500).json({
//         success: false,
//         message: "Error uploading file",
//       });
//     }

//     // Success response
//     res.status(200).json({
//       success: true,
//       message: "Uploaded successfully!",
//       data: result,
//     });
//   });
// });

// app.listen(PORT, () => {
//   logger.info(`App is listening at port ${PORT}...`);
// });

// export default app;

// import express, { Request, Response, Application } from "express";
// import multer, { MulterError } from "multer";
// import path from "path";
// import logger from "../../../handlers/logger";
// // const app = express();

// const app: Application = express();
// const PORT = 4050;

// // Storage Engine Configuration
// const storage = multer.diskStorage({
//   destination: "./upload/images", // Upload directory
//   //@ts-ignore
//   filename: (req, file, cb) => {
//     const uniqueName = `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`;
//     cb(null, uniqueName);
//   },
// });

// // Multer Configuration
// const upload = multer({
//   storage,
//   limits: {
//     fileSize: 10 * 1024 * 1024, // 10 MB limit
//   },
// });

// // Middleware to serve static files
// app.use("/profile", express.static(path.join(__dirname, "upload/images")));

// // File Upload Endpoint
// //@ts-ignore
// app.post("/upload", upload.single("profile"), (req: Request, res: Response) => {
//   if (!req.file) {
//     return res.status(400).json({ success: 0, message: "No file uploaded" });
//   }
//   res.json({
//     success: 1,
//     profile_url: `http://localhost:4000/profile/${req.file.filename}`,
//   });
// });

// // Error Handler Middleware
// //@ts-ignore
// function errHandler(err: any, req: Request, res: Response, next: NextFunction) {
//   if (err instanceof MulterError) {
//     // Multer-specific errors
//     return res.status(400).json({
//       success: 0,
//       message: err.message,
//     });
//   } else if (err) {
//     // Other errors
//     return res.status(500).json({
//       success: 0,
//       message: "An unexpected error occurred",
//     });
//   }
//   next();
// }
// app.use(errHandler);

// app.listen(PORT, () => {
//   logger.info(`App is listening at port ${PORT}...`);
// });

// export default app;
