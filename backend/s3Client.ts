import AWS from "aws-sdk";
import dotenv from "dotenv";
dotenv.config();

AWS.config.update({
	accessKeyId: process.env.AWS_AK,
	secretAccessKey: process.env.SECRET_AK,
	region: "us-east-2",
});

export const s3 = new AWS.S3();
