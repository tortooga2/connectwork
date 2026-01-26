import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createFile } from "@/lib/server/createFile";
import type { FileData } from "@/lib/Types/Types";
import { linkFiles } from "@/lib/server/linkFiles";


export async function POST(request : NextRequest) {
    const {userId} = await auth();

    if(!userId) {
        return NextResponse.json({
            okay: false,
            error: "Unauthorized",
            message: "User not authenticated",
        }, { status: 401 });
    }

    const {file_ids} = await request.json();

    console.log("file_ids", file_ids);



    const newBunde : FileData = {
        owner_id : userId,
        creator_id : userId,
        name : "Bundle",
        type : "bundle",
    }

    const createdEntries = await createFile([newBunde], userId);

    const links = await linkFiles(file_ids, createdEntries[0].id);

    return NextResponse.json({
        okay: true,
        message: "Files linked successfully",
        data: {
            bundle : createdEntries[0],
            links : links,
        },
    }, { status: 200 });

    

    
}