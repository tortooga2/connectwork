import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { and, eq } from "drizzle-orm";
import { linkTable } from "@/db/schema";


type FileLinkRequest = {
    file_to : string;
    file_from : string; 
}



export async function POST(request : NextRequest) {
    const {userId} = await auth();
    if(!userId) {
        return NextResponse.json({error : "Unauthorized"}, {status : 401});
    }

    const {links} = await request.json();
    const linksArray : FileLinkRequest[] = links;

    for(const link of linksArray) {
        const {file_to, file_from} = link;
        const existingLink = await db.select().from(linkTable).where(and(eq(linkTable.to_id, file_to), eq(linkTable.from_id, file_from)));
        if(existingLink.length > 0) {
            continue;
        }
        await db.insert(linkTable).values({
            to_id : file_to,
            from_id : file_from
        });
    }

    return NextResponse.json({message : `Successfully linked ${linksArray.length} files`}, {status : 200});
}
