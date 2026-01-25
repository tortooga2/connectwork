import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

import { auth } from "@clerk/nextjs/server";

import { genPresignedUrl } from "@/lib/server/s3/module.genPresignedUrl";

import { isFileOwner } from "@/lib/server/getFileOwnership";

export async function GET(request : NextRequest, {params} : {params : {file_id : string}}) {
    const { userId } = await auth()
    
    if(!userId){
        redirect("/")
    }

    
    const file_id = params.file_id;

    const isOwner = await isFileOwner(file_id, userId);

    if(!isOwner){
        return NextResponse.json({"message" : "You do not have permission to access this file."}, {status : 403})
    }

    

    const presigned_url = await genPresignedUrl(userId, file_id, "GET", 60).catch(err => {
        console.log(err);
        return null;
    });

    if(!presigned_url){
        return NextResponse.json({"message" : "Failed to get Presigned Url"}, {status : 501})
    }

    console.log(presigned_url)


    return NextResponse.json({"message" : "Successfully Generated Url", "url" : presigned_url}, {status : 200})
}