import { File, useFileStore } from "@/app/components/State Manager/appManager";
import { VerticalDiv } from "@/app/components/UILayout";
import { getFileType } from "@/lib/client/getFileType";
import { useEffect, useRef, useState } from "react";


const NoteView = ({fileUrl, title}: {fileUrl: string, title: string}) => {
    const [fileSrc, setFileSrc] = useState<string | undefined>(undefined)
    useEffect(()=>{
        const GetFileSrc = async () => {
            const fileSrc = await fetch(fileUrl as string)
            const fileText = await fileSrc.text()
            setFileSrc(fileText)
        }
        GetFileSrc()
    }, [fileUrl])

    if(!fileSrc){
        return <div>
            Loading...
        </div>
    }
    return (
        <div style={{
            width : "100%",
            height : "100%",
            display : "flex",
            flexDirection : "column",
            gap : "1rem",
            alignItems : "left",
        }}>
            <h1 style={{fontSize : "2.5rem"}}>{title}</h1>
            <div dangerouslySetInnerHTML={{__html: fileSrc}} />
        </div>
    )
}


const Bundle = ({bundle_data}: {bundle_data: {url: string | undefined, data: any}[]}) => {

    const videoRef = useRef<HTMLVideoElement>(null);
    const layoutState = useFileStore((state)=>state.layoutState)

    useEffect(()=>{
        if(layoutState === 1 && videoRef.current){
            videoRef.current.play()
        }
        else if(layoutState === 0 && videoRef.current){
            videoRef.current.pause()
        }
    }, [layoutState, videoRef])


    const DisplayFile = (index: number, file: any, url: string | undefined) => {
        switch (getFileType(file.type)) {
            case "Document": {
                const fileSrc = `https://docs.google.com/gview?url=${encodeURIComponent(url as string)}&embedded=true`;
                return(
                    
                        <object key={index} type="application/pdf" data={fileSrc} style={{
                            width : "100%",
                            aspectRatio : "1/1.29",
                            borderRadius : "var(--border-rad)",
                            objectFit : "contain",
                            objectPosition : "center",
                        }}/>
                    
                )
            }

            case "Image" : {
                return (
                    <img key={index} src={url as string} width="100%" style={{
                        borderRadius : "var(--border-rad)",
                        objectFit : "contain",
                        objectPosition : "center",
                    }}/>
                )
            }

            case "Recording" : {
                return (
                    <video key={index} src={url as string} ref={videoRef} autoPlay={false} muted={true} width="100%"  controls={true} style={{
                        borderRadius : "var(--border-rad)",
                        objectFit : "contain",
                        objectPosition : "center",

                    }}/>
                )
            }

            case "Note" : {
                return (
                    <NoteView key={index} fileUrl={url as string} title={file.name}/>
                )
            }
        }
    }


    return (
            <div style={{
                width : "100%",
                height : "100%",
                display : "flex",
                flexDirection : "column",
                gap : "1rem",
            }}>
                {bundle_data.map((file, index) => {
                    return DisplayFile(index, file.data, file.url)
                })}
                
            </div>
    )
}

export default Bundle;