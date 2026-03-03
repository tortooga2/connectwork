"use client"
import { FileType } from "@/app/components/TypeTags";

export const FileData = ({fileData}: {fileData: any}) => {
    return (<div style={{display : "flex", flexDirection : "column", gap : "1rem", width : "100%", padding : "1rem", boxSizing : "border-box", borderBottomLeftRadius : "var(--border-rad)", borderBottomRightRadius : "var(--border-rad)"}}>
        <div style={{display : "flex", flexDirection : "row", width : "100%", justifyContent : "space-between", alignItems : "center"}}>
                <div style={{fontSize : "2rem", whiteSpace : "nowrap", overflow : "hidden", textOverflow : "ellipsis"}}>{fileData?.name}</div>
            </div>
            <div style={{display : "flex", flexDirection : "column", gap : "0.5rem"}}>
                {FileType(fileData?.type, true)}
                <span><span style={{fontWeight : "bold"}}>ID:</span> {fileData?.id}</span>
                <span><span style={{fontWeight : "bold"}}>Created:</span> {(fileData?.createdAt.toLocaleString())?.toString()}</span>
                <span><span style={{fontWeight : "bold"}}>Creator:</span> {fileData?.creator_email}</span>
            </div>
        </div>
    )}
