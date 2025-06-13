import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

import { auth } from "@clerk/nextjs/server";

import { genPresignedUrl } from "@/lib/server/s3/module.genPresignedUrl";

export async function GET(request : NextRequest) {
    const { userId } = await auth()
    
    if(!userId){
        redirect("/")
    }

    const params = request.nextUrl.searchParams;
    const file_id = params.get("file_id");



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