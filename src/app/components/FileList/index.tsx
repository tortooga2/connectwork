"use client"
import { useEffect, useMemo } from "react"
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
        <VerticalDiv style={{borderRadius : "var(--border-rad)", padding : "1rem"}} color="var(--accent-color)" padding="0rem" gap="0.5rem">
            <div className={"row header"}>
                <div className={"column header"}></div>
                <div className={"column header"}>ID:</div>
                <div className={"column header"}>Created At:</div>
                <div className={"column header"} style={{ display : "flex", flex : "row"}}><div className={layout == 0 ? "spacer" : "spacer small"}/><span>Type:</span></div>
                <div className={"column header"}>Creator:</div>
                <div className={"column header"}>Name:</div>
                <div className={"column header"}></div>
            </div>

            <VerticalDiv style={{gap: "0.25rem"}} padding="0rem">
                {sortedFiles.map((file) => (
                    <FileItem key={file.id} file={file} />
                ))}
            </VerticalDiv>
        </VerticalDiv>
    )
}