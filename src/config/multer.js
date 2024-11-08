import multer from "multer";
import multerS3 from "multer-s3";
import { S3Client } from "@aws-sdk/client-s3";
import path from "path";

import dotenv from 'dotenv'

dotenv.config()

const acessKeyId = process.env.KEY_ID
const secretKey = process.env.SECRET_KEY
const awsBucket = process.env.AWS_BUCKET

// Configurar o cliente S3
const s3 = new S3Client({
  region: "sa-east-1",
  credentials: {
    accessKeyId: acessKeyId,
    secretAccessKey: secretKey,
  }
});

// Configurar o armazenamento Multer com S3
export const storage = multerS3({
  s3: s3,
  bucket: awsBucket,
  metadata: (req, file, cb) => {
    cb(null, { fieldName: file.fieldname });
  },
  key: (req, file, cb) => {
    const time = new Date().getTime();
    const fileName = `${time}_${file.originalname}`;
    cb(null, fileName);
  },
  acl: 'public-read',
});

const upload = multer({ storage: storage });

export default upload;
