"use client"

import { useEffect, useState } from "react";
import { useFileStore } from "../State Manager/appManager";
import { getFileUrl } from "@/lib/server/getPreview";
import { getFileType } from "@/lib/client/getFileType"
import { VerticalDiv } from "../UILayout";

export const Preview = () => {
    const previewedFile = useFileStore((state) => state.previewedFile)
    const SetLayoutState = useFileStore((state)=>state.SetLayoutState)

    const [fileUrl, SetFileUrl] = useState<string | undefined>(undefined);
    const [fileType, SetFileType] = useState<string>(getFileType(File.name))




    useEffect(()=>{

        const GetFileUrl = async (file) => {
            console.log(file)
            const file_url = await getFileUrl(file);
            const file_type = getFileType(file.type);
            SetFileUrl(file_url)
            SetFileType(file_type)
            console.log("File Url", file_url, file_type)
            return file_url
        }


        if(previewedFile){
            GetFileUrl(previewedFile)
            
        }
    }, [previewedFile])


    const DisplayFile = () => {
        if(!fileUrl){
            return (<div>
                File not Found or something else when wrong...sorrry!
            </div>)
        }
        console.log(fileType)
        switch (fileType){
            case "Document": {
                const fileSrc = `https://docs.google.com/gview?url=${encodeURIComponent(fileUrl)}&embedded=true`;
                return(
                    
                        <iframe src={fileSrc} style={{
                            width : "90%",
                            height : "100%"
                        }} />
                    
                )
            }

            case "Image" : {
                return (
                    <img src={fileUrl} />
                )
            }

            default: {
                return <div>
                    File type unexpected.
                </div>
            }

            
        }

    }


    return (<VerticalDiv style={{
        alignItems : "center",
    }}>
        <button onClick={()=>SetLayoutState(0)}>Close</button>
        {DisplayFile()}
    </VerticalDiv>)
    
}