"use client"
import { useEffect, useMemo } from "react"
import { useFileStore } from "../State Manager/appManager"
import { VerticalDiv } from "../UILayout"
import { FileItem } from "@/app/components/FileItem"
import { ButtonBundle } from "@/app/components/buttonBundle"
import { DeleteButton } from "@/app/components/DeleteButton"

export const FilesList = () => {
    const files = useFileStore((state) => state.files)
    const SetFiles = useFileStore((state) => state.SetFiles)

    useEffect(() => {
        const getFiles = async () => {
            const response = await fetch("/api/files/")
            const { data } = await response.json()
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

    return (
        <VerticalDiv style={{ border: "var(--theme-border-width) solid var(--theme-border-primary)", borderRadius: "var(--theme-border-radius)", padding: "1rem", width: "100%" }}>
            <div style={{ marginBottom: "1rem", display: "flex", gap: "1rem" }}>
                <ButtonBundle />
                <DeleteButton />
            </div>
            <div className={"row"} style={{ backgroundColor: "var(--theme-list-header-bg)", color: "var(--theme-list-header-text)", borderRadius: "var(--theme-border-radius)" }}>
                <div></div>
                <div className={"column"} style={{ fontWeight: "bold" }}>ID</div>
                <div className={"column"} style={{ fontWeight: "bold" }}>CREATED AT</div>
                <div className={"column"} style={{ fontWeight: "bold" }}>TYPE</div>
                <div className={"column"} style={{ fontWeight: "bold" }}>CREATOR</div>
                <div className={"column"} style={{ fontWeight: "bold" }}>NAME</div>
                <div className={"column"} style={{ fontWeight: "bold" }}>QUICKVIEW</div>
            </div>

            <VerticalDiv style={{ gap: "0.25rem" }} padding="0rem">
                {sortedFiles.map((file) => (
                    <FileItem key={file.id} file={file} />
                ))}
            </VerticalDiv>
        </VerticalDiv>
    )
}