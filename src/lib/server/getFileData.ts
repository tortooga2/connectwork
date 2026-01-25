import { db } from "@/db"
import { entryTable } from "@/db/schema"
import { eq } from "drizzle-orm"


export const getFileData = async (file_id : string) => {
    //fetch file data from database
    //return file data

    const file = await db
        .select()
        .from(entryTable)
        .where(eq(entryTable.id, file_id))
        .limit(1)
        .then(res => res[0]);

    return file || null;
}