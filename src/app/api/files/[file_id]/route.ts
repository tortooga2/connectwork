import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

import { auth } from "@clerk/nextjs/server";

import { isFileOwner } from "@/lib/server/getFileOwnership";
import { getFileData } from "@/lib/server/getFileData";



import { s3Client, bucketName } from "../../../../lib/server/s3/module.s3client";
import { DeleteObjectsCommand } from "@aws-sdk/client-s3";
import { deleteFile } from "@/lib/server/deleteFile";


export async function GET(
    request: NextRequest, 
    { params }: { params: Promise<{ file_id: string }> } 
) {
    const { userId } = await auth();
    
    if (!userId) {
        // Note: Using redirect in a GET API route is okay, 
        // but often returning a 401 JSON response is cleaner for APIs.
        redirect("/");
    }

    // 2. Await the params
    const { file_id } = await params;

    const isOwner = await isFileOwner(file_id, userId);
    if (!isOwner) {
        return NextResponse.json({ "message": "You do not have permission..." }, { status: 403 });
    }

    const fileData = await getFileData(file_id);
    if (!fileData) {
        return NextResponse.json({ "message": "Failed to get File Data" }, { status: 501 });
    }

    return NextResponse.json({ "message": "Success", "data": fileData }, { status: 200 });
}






export async function DELETE(request : NextRequest, {params} : {params : Promise<{file_id : string}>}) {
    const { userId } = await auth()
    
    if(!userId){
        return NextResponse.json({"message" : "Unauthorized"}, {status : 401})
    }

    const { file_id } = await params;
    const isOwner = await isFileOwner(file_id, userId);

    if(!isOwner){
        return NextResponse.json({"message" : "You do not have permission to access this file."}, {status : 403})
    }

    // Get file id from database
    const fileData = await getFileData(file_id);

    if(!fileData){
        return NextResponse.json({"message" : "Failed to get File Data"}, {status : 501})
    }

    const file_bucket_id = fileData.file_id;

    await deleteFile(file_id);


    

    // Delete the file from our bucket
    const command = new DeleteObjectsCommand({
        Bucket: bucketName,
        Delete: {
            Objects: [file_bucket_id].map(key => ({Key: `${userId}/${key}`})),
        },
    });
    await s3Client.send(command);
    
    return NextResponse.json({
        okay: true,
        message: "Successfully deleted files",
    }, {status : 200})
}