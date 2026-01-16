import { auth } from "@clerk/nextjs/server"

import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { entryTable } from "@/db/schema";
import { redirect } from "next/navigation";



export async function GET() {
    const {userId} = await auth();

    if(!userId){
        redirect("/")
    }

    const files = await db.select({
        id : entryTable.id,
        creator_id : entryTable.creator_id,
        creator_email : entryTable.creator_email,
        createdAt : entryTable.createdAt,
        file_id : entryTable.file_id,
        type: entryTable.type,
        name : entryTable.name,
        description : entryTable.description
    }).from(entryTable).where(
        eq(entryTable.owner_id, userId!)
    )




    return NextResponse.json({data : files}, {status : 200})
}