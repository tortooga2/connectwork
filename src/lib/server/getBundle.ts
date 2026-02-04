"use server"
import { getFileData } from "./getFileData"
import { getFileUrl } from "./getFileUrl"
import { getLinks } from "./getLinks"


export const getBundle = async (file_id : string) => {
    const linked_files = await getLinks(file_id) //returns an array of files connected to the bundle

    const files_data : {url: string | undefined, data: any}[] = []

    await Promise.all(linked_files.map(async (file) => {
        const file_url = await getFileUrl(file.entries as any, true)
        const fileData = await getFileData(file.entries.id);
        files_data.push({
            url: file_url?.[0]?.url,
            data: fileData
        })
    }))
    return files_data
}