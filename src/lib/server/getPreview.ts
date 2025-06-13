"use server"
import { auth } from "@clerk/nextjs/server"
import { genPresignedUrl } from "./s3/module.genPresignedUrl"
import { File } from "@/app/components/State Manager/appManager";

export const getFileUrl = async (file : File) : Promise<string | undefined> => {
    const {userId} = await auth()

    if(!userId) {
        return undefined;
    }


    const url = await genPresignedUrl(userId, file.file_id, "GET")

    console.log("File Url", url)


    if(url){
        return url;
    }

    return undefined;
}