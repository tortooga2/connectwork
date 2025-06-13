import { db } from "@/db";
import { linkTable } from "@/db/schema";


export const linkFiles = async (to_ids : string[], from_id : string) : Promise<typeof linkTable.$inferSelect[]> => {
    const links : typeof linkTable.$inferSelect[] = [];
    for(const to_id of to_ids) {
        const link = await db.insert(linkTable).values({
            to_id,
            from_id
        }).returning();
        links.push(link[0]);
    }

    return links;
}