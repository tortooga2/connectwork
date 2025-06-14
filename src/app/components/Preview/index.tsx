"use client"

import { useEffect, useState, useRef } from "react";
import { useFileStore } from "../State Manager/appManager";
import { getFileUrl } from "@/lib/server/getPreview";
import { getFileType } from "@/lib/client/getFileType"
import { VerticalDiv } from "../UILayout";

export const Preview = () => {
    const previewedFile = useFileStore((state) => state.previewedFile)
    const SetLayoutState = useFileStore((state)=>state.SetLayoutState)
    const layoutState = useFileStore((state)=>state.layoutState)

    const [fileUrl, SetFileUrl] = useState<string | undefined>(undefined);
    const [fileType, SetFileType] = useState<string>(getFileType(previewedFile?.name!))

    const videoRef = useRef<HTMLVideoElement>(null);


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


        if(previewedFile && previewedFile.type !== "Bundle"){
            GetFileUrl(previewedFile)
        }else{
            console.log("Bundle file")
        }
    }, [previewedFile])


    useEffect(()=>{
        if(layoutState === 1 && videoRef.current){
            videoRef.current.play()
        }
        else if(layoutState === 0 && videoRef.current){
            videoRef.current.pause()
        }
    }, [layoutState, videoRef])


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

            case "Recording" : {
                return (
                    <video src={fileUrl} ref={videoRef} autoPlay={true} muted={true} style={{
                        width : "90%",
                        height : "100%"
                    }} controls={true}/>
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