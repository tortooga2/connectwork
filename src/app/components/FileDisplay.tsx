"use client"
import { FileType } from "@/app/components/TypeTags";
import type { entryTable } from "@/db/schema";

// type for the file data 
type EntryRow = typeof entryTable.$inferSelect;

// ensures that the file data is displayed correctly in the preview page by importing the file data from the database
export const FileData = ({ fileData }: { fileData: EntryRow | null | undefined }) => {
    const createdAt = fileData?.createdAt ? new Date(fileData.createdAt) : null
    const createdLocal = createdAt && !Number.isNaN(createdAt.getTime()) ? createdAt.toLocaleString() : "Unknown"
    const createdUtc = createdAt && !Number.isNaN(createdAt.getTime()) ? createdAt.toISOString() : "Unknown"
    return (<div style={{display : "flex", flexDirection : "column", gap : "1rem", width : "100%", padding : "1rem", boxSizing : "border-box", borderBottomLeftRadius : "var(--border-rad)", borderBottomRightRadius : "var(--border-rad)"}}>
        <div style={{display : "flex", flexDirection : "row", width : "100%", justifyContent : "space-between", alignItems : "center"}}>
                <div style={{fontSize : "2rem", whiteSpace : "nowrap", overflow : "hidden", textOverflow : "ellipsis"}}>{fileData?.name === "Bundle" ? "linq" : fileData?.name}</div>
            </div>
            <div style={{display : "flex", flexDirection : "column", gap : "0.5rem"}}>
                {FileType(fileData?.type, true)}
                <span><span style={{fontWeight : "bold"}}>ID:</span> {fileData?.id}</span>
                <span><span style={{fontWeight : "bold"}}>Created:</span> {createdLocal}</span>
                <span><span style={{fontWeight : "bold"}}>UTC:</span> {createdUtc}</span>
                <span><span style={{fontWeight : "bold"}}>Creator:</span> {fileData?.creator_email}</span>
            </div>
        </div>
    )}
