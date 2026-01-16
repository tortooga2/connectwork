"use server"
import { getFileUrl } from "./getPreview"
import { getLinks } from "./getLinks"


export const getBundle = async (file_id : string) => {
    const linked_files = await getLinks(file_id) //returns an array of files connected to the bundle

    const files_data : {url: string | undefined, data: any}[] = []

    await Promise.all(linked_files.map(async (file) => {
        const file_url = await getFileUrl(file.entries as any, true)
        files_data.push({
            url: file_url?.[0]?.url,
            data: file_url?.[0]?.data
        })
    }))
    return files_data
}