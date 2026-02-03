"use client"
import { use, useEffect, useMemo } from "react"
import { useFileStore } from "../State Manager/appManager"
import { VerticalDiv } from "../UILayout"
import { FileItem } from "@/app/components/FileItem"

export const FilesList = () => {
    const files = useFileStore((state)=>state.files)
    const SetFiles = useFileStore((state)=>state.SetFiles)
    const layout = useFileStore((state)=>state.layoutState)

    useEffect(()=>{
        const getFiles = async () => {
            const response = await fetch("/api/files/")
            const {data} = await response.json()
            SetFiles(data)
            console.log(data)
        }

        getFiles()
    }, [SetFiles])

    const sortedFiles = useMemo(() => {
        return Array.from(files.values()).sort((a, b) => {
            // Convert string dates to Date objects for proper comparison
            const dateA = new Date(a.createdAt).getTime()
            const dateB = new Date(b.createdAt).getTime()
            return dateB - dateA // Sort in descending order (newest first)
        })
    }, [files])

    return(
        <VerticalDiv style={{border : "var(--border-width) solid var(--foreground)", borderRadius : "var(--border-rad)", padding : "1rem"}}>
            <div className={"row"} style={{backgroundColor : "var(--foreground)", color : "var(--background)", borderRadius : "var(--border-rad)"}}>
                <div></div>
                <div className={"column"} style={{ fontWeight: "bold"}}>ID:</div>
                <div className={"column"} style={{ fontWeight: "bold"}}>CREATED AT:</div>
                <div className={"column"} style={{ display : "flex", fontWeight: "bold", flex : "row"}}><div className={layout == 0 ? "spacer" : "spacer small"}/><span>TYPE:</span></div>
                <div className={"column"} style={{ fontWeight: "bold"}}>CREATOR:</div>
                <div className={"column"} style={{ fontWeight: "bold"}}>NAME:</div>
                <div></div>
            </div>

            <VerticalDiv style={{gap: "0.25rem"}} padding="0rem">
                {sortedFiles.map((file) => (
                    <FileItem key={file.id} file={file} />
                ))}
            </VerticalDiv>
        </VerticalDiv>
    )
}