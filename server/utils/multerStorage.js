import multer from "multer";
import { GridFsStorage } from "multer-gridfs-storage";
import mongoose from "mongoose";

let storage;
mongoose.connection.once("open", () => {
  storage = new GridFsStorage({
    db: mongoose.connection.db,
    file: (req, file) => {
      return {
        filename: file.originalname,
        bucketName: "documents", // must match your GridFSBucket
      };
    },
  });
});

const upload = multer({ storage });
