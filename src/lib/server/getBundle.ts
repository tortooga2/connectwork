"use server"
import type { entryTable } from "@/db/schema"
import { getFileDataForUser } from "./getFileData"
import { getFileUrl } from "./getFileUrl"
import { getLinks } from "./getLinks"

type EntryRow = typeof entryTable.$inferSelect

export const getBundle = async (file_id: string, userId: string) => {
    const linked_files = await getLinks(file_id) //returns an array of files connected to the bundle

    const files_data : {url: string | undefined, data: EntryRow | null}[] = []

    await Promise.all(linked_files.map(async (file: { entries: EntryRow }) => {
        const owned = await getFileDataForUser(file.entries.id, userId)
        if (!owned) return
        const file_url = await getFileUrl(owned, true)
        files_data.push({
            url: file_url?.[0]?.url,
            data: owned,
        })
    }))
    return files_data
}