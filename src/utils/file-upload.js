"use server";
import crypto from "crypto";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getEnv } from "./get-env";

// Random filename
const generateFilename = (bytes = 32) =>
  crypto.randomBytes(bytes).toString("hex");

const s3 = new S3Client({
  region: getEnv("AWS_BUCKET_REGION"),
  credentials: {
    accessKeyId: getEnv("AWS_ACCESS_KEY"),
    secretAccessKey: getEnv("AWS_SECRET_ACCESS_KEY"),
  },
});

export async function getSignedURL(files, userId) {
  if (!userId) throw new Error("You are not authorized.");
  const uploadedUrls = [];

  for (const file of files) {
    const base64Data = Buffer.from(file.baseData?.split(",")[1], "base64");
    const key = generateFilename();

    const putObjectCommand = new PutObjectCommand({
      Bucket: getEnv("AWS_BUCKET_NAME"),
      Key: key,
      ContentType: file.type,
    });

    const url = await getSignedUrl(s3, putObjectCommand, {
      expiresIn: 120,
    });

    if (url) {
      await fetch(url, {
        method: "PUT",
        body: base64Data,
        "Content-Type": file.type,
      });
    }

    const publicUrl = `https://${getEnv("AWS_BUCKET_NAME")}.s3.${getEnv(
      "AWS_BUCKET_REGION"
    )}.amazonaws.com/${key}`;
    uploadedUrls.push(publicUrl);
  }

  return uploadedUrls;
}
