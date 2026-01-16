import { useFileStore } from "@/app/components/State Manager/appManager";
import { getFileType } from "@/lib/client/getFileType";
import { useEffect, useRef, useState } from "react";
import { DocumentViewer } from "react-documents";


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


const Bundle = ({bundle_data}: {bundle_data: {url: string | undefined, data: any}[] | undefined}) => {

    

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





    const DisplayFile = (index: number, file: any, url?: string) => {
        const safeUrl = (typeof url === "string" && url.trim() !== "") ? url : undefined;
        switch (getFileType(file.type)) {
            case "Document": {
                if (!safeUrl) return <div key={index}>Loading...</div>;
                return(
                    
                                            <DocumentViewer
                                                key={index}
                                                queryParams="hl=Nl"
                                                url={safeUrl}
                                                style={{
                                                    width : "100%",
                                                    aspectRatio : "1/1.1",
                 
                                                    flex: 1,
                                                    borderRadius : "var(--border-rad)",
                                                    objectFit : "contain",
                                                    objectPosition : "center",
                                                }}>
                                            </DocumentViewer>
                    
                )
            }

            case "Image" : {
                if (!safeUrl) return <div key={index}>Loading...</div>;
                return (
                    <img 
                    key={index}
                    src={safeUrl}
                    width="100%"
                    style={{
                            borderRadius : "var(--border-rad)",
                            objectFit : "contain",
                            objectPosition : "center",
                            flex: 1,
                        }}
                    />
                )
            }

            case "Recording" : {
                if (!safeUrl) return <div key={index}>Loading...</div>;
                return (
                    <video key={index} src={safeUrl} ref={videoRef} autoPlay={false} muted={true} width="100%"  controls={true} style={{
                        borderRadius : "var(--border-rad)",
                        objectFit : "contain",
                        objectPosition : "center",
                        flex: 1,

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
                
                display : "flex",
                flexDirection : "column",
                gap : "1rem",
            }}>
                {bundle_data?.map((file, index) => {
                    return DisplayFile(index, file.data, file.url)
                })}
                
            </div>
    )
}

export default Bundle;