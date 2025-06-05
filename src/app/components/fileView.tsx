"use client"
import { useEffect } from "react"
import { useFileStore } from "./ctx.fileManager"
import VerticalDiv from "./UILayout/VerticalDiv"
import { FileItem } from "./File"




export const ShowFiles = () => {
    const files = useFileStore((state)=>state.files)
    const SetFiles = useFileStore((state)=>state.SetFiles)

   


    useEffect(()=>{

        const getFiles = async () => {
            const response = await fetch("/api/file/get-all")
            const {data} = await response.json()
            SetFiles(data)
            console.log(data)
        }

        getFiles()
        

    }, [])

   

    useEffect(()=>{
       
    }, [])


    return(
    
    <VerticalDiv padding="0rem" gap="0.5rem">
        

        
        <div className={"row"} style={{
                                                   
                                                    border : "1px solid var(--foreground)",
                                                    color : "var(--foreground)",
                                                   
                                                    
                                                }}>
                <div></div>
                <div style={{overflow: "hidden", textWrap:"nowrap", textOverflow: "ellipsis", fontWeight: "bold"}}>ID:</div>
                <div style={{overflow: "hidden", textWrap:"nowrap", textOverflow: "ellipsis", fontWeight: "bold"}}>CREATED AT:</div>
                <div style={{overflow: "hidden", textWrap:"nowrap", textOverflow: "ellipsis", fontWeight: "bold"}}>TYPE:</div>
                <div style={{overflow: "hidden", textWrap:"nowrap", textOverflow: "ellipsis", fontWeight: "bold"}}>CREATOR:</div>
                <div style={{overflow: "hidden", textWrap:"nowrap", textOverflow: "ellipsis", fontWeight: "bold"}}>NAME:</div>
            </div>

            
            <VerticalDiv padding="0rem" style={{gap: "0.0rem", borderRadius : "0rem", border : "1px solid var(--foreground)"}}>
                {Array.from(files.values()).map((file, index)=>{
                    return <FileItem key={index} file = {file} />
                })}

            </VerticalDiv>
                
        
    </VerticalDiv>)
}