import { NextRequest, NextResponse } from 'next/server';
import { s3Client, bucketName } from '@/lib/s3/module.s3client'; // Update path as needed
import { HeadObjectCommand } from '@aws-sdk/client-s3';
import { auth, clerkClient } from '@clerk/nextjs/server'; // Or your auth solution
import { db } from '@/db'; // Update path to your Drizzle db instance
import { entryTable } from '@/db/schema'; // Update path to your schema
import { S3ServiceException } from "@aws-sdk/client-s3";


// Types
interface FileData {
  owner_id: string;
  creator_id: string;
  name: string;
  type: string;
  file_id: string;
  creator_email : string;
}

interface RequestBody {
  keys: string[];
  fileNames: string[];
}

const checkObjExistence = async (profileId: string, key: string): Promise<boolean> => {
  if (typeof key !== "string") {
    throw new TypeError("All values within keys must be strings");
  }

  const command = new HeadObjectCommand({
    Bucket: bucketName,
    Key: `${profileId}/${key}`,
  });

  try {
    await s3Client.send(command);
    return true; // No errors thrown, so the object exists
  } catch (err : unknown) {
    if( !(err instanceof(S3ServiceException))){
        return false
    }

    if (
      err.$metadata?.httpStatusCode === 404 ||
      err.$metadata?.httpStatusCode === 403
    ) {
      return false; // File doesn't exist if Amazon throws this error
    }

    console.log("Couldn't check objects existence: ", err);
    throw new Error("Couldn't check objects existence");
  }
};

export async function POST(request: NextRequest) {
  try {
    // Get user authentication
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({
        okay: false,
        error: "Unauthorized",
        message: "User not authenticated",
      }, { status: 401 });
    }

    // Parse request body
    const body: RequestBody = await request.json();
    const { keys, fileNames } = body;

    // Use Drizzle transaction
    const result = await db.transaction(async (tx) => {
      const sentFiles: FileData[] = []; // All existing files will be copied to this array for bulk creation

      if (!Array.isArray(keys) || !Array.isArray(fileNames)) {
        throw new Error("keys and fileNames must be arrays!");
      }

      // Check if each file exists in bucket
      for (let index = 0; index < keys.length; index++) {
        if (await checkObjExistence(userId, keys[index])) {
          if (typeof fileNames[index] !== "string") {
            throw new Error("All values within fileNames must be strings!");
          }

          let email = ""

           const client = await clerkClient()

        const user = await client.users.getUser(userId)

        const emailObj = user.primaryEmailAddress
        if(emailObj?.emailAddress){
           email = emailObj?.emailAddress
        }

          sentFiles.push({
            owner_id: userId,
            creator_id: userId,
            name: fileNames[index],
            type: fileNames[index].split('.').pop() || 'unknown',
            file_id: keys[index], // Store the S3 key as file_id,
            creator_email: email
          });
        }
      }

      if (sentFiles.length === 0) {
        throw new Error("FILES_NOT_FOUND");
      }

      // Bulk insert files into database using Drizzle
      const createdEntries = await tx.insert(entryTable).values(sentFiles).returning();
      
      return {
        createdEntries,
        totalRequested: keys.length,
        totalCreated: sentFiles.length
      };
    });

    // Success response
    if (result.totalRequested === result.totalCreated) {
      return NextResponse.json({
        okay: true,
        message: "All files were successfully uploaded!",
        data: result.createdEntries,
      }, { status: 201 });
    }

    return NextResponse.json({
      okay: true,
      message: "Some files did not upload successfully",
      data: result.createdEntries,
    }, { status: 201 });

  } catch (err : unknown) {
    // Drizzle transactions automatically rollback on errors

    if(!(err instanceof(Error))){
        return
    }
    
    if (err.message === "keys and fileNames must be arrays!") {
      return NextResponse.json({
        okay: false,
        error: "Bad request",
        message: err.message,
      }, { status: 400 });
    }

    if (err.message === "All values within fileNames must be strings!") {
      return NextResponse.json({
        okay: false,
        error: "Bad request",
        message: err.message,
      }, { status: 400 });
    }

    if (err.message === "FILES_NOT_FOUND") {
      return NextResponse.json({
        okay: false,
        error: "Files not found",
        message: "Files were not uploaded to the bucket",
      }, { status: 404 });
    }

    if (err instanceof TypeError) {
      return NextResponse.json({
        okay: false,
        error: "Bad request",
        message: err.message,
      }, { status: 400 });
    }

    console.log(err);
    return NextResponse.json({
      okay: false,
      error: "Internal server error",
      message: "The server encountered an unexpected condition",
    }, { status: 500 });
  }
}