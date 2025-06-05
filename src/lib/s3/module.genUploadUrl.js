import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from "crypto";
import { s3Client, bucketName } from "./module.s3client.js";

export const generateUploadUrl = async (req, res) => {
    console.log("Generating upload URL");
    const fileKey = crypto.randomBytes(16).toString("hex");
    const { profile_id } = req.user;

    try {
        const command = new PutObjectCommand({
            Bucket: bucketName,
            Key: `${profile_id}/${fileKey}`,
        });
        console.log("Getting signed URL");
        const url = await getSignedUrl(s3Client, command, { expiresIn: 60 });
        console.log("Generated URL: ", url);
        console.log("Generated Key: ", fileKey);
        res.status(200).json({
            okay: true,
            url: url,
            key: fileKey,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            okay: false,
            error: "Unhandled exception",
            message: "The server encountered an unexpected condition",
        });
    }
};
