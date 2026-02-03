"use client"
import { FileData } from "@/lib/Types/Types"
import { useFileStore } from "../../components/State Manager/appManager"
import Bundle from "@/lib/server/Bundle/bundle"
import "./style.css"

export const LinqButton = () => {
    const selectedFiles = useFileStore((state)=>state.selectedFiles)
    const ClearSelection = useFileStore((state)=>state.ClearSelection)
    const UpdateFiles = useFileStore((state)=>state.UpdateFiles)

    return (
        
    <button className={selectedFiles.size > 0 ? "linq active" : "linq"} onClick={async () => {
        if(selectedFiles.size > 0) {
            const bundle = await Bundle(Array.from(selectedFiles)) as {bundle: FileData, links: {to_id: string, from_id: string}[]}
            ClearSelection()
            UpdateFiles([bundle?.bundle as any])
        }
    }}>Linq</button>)
}