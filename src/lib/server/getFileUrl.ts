"use server"
import { auth } from "@clerk/nextjs/server"
import { genPresignedUrl } from "./s3/module.genPresignedUrl"
import { File } from "@/app/components/State Manager/appManager";
import { getBundle } from "./getBundle";

export const getFileUrl = async (file : {id : string, file_id : string, type: string}, is_bundle: boolean) : Promise<{url: string | undefined, data: any}[] | undefined> => {
    const {userId} = await auth()

    if(!userId) {
        return undefined;
    }

    if (file.type === "Bundle" && !is_bundle){
        const bundle_contents = await getBundle(file.id)
        return bundle_contents
    }

    const url = await genPresignedUrl(userId, file.file_id, "GET")

    if(url){
        return [{url: url, data: file}];
    }

    return undefined;
}