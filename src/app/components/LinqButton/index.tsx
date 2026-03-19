"use client"
import { FileData } from "@/lib/Types/Types"
import { useFileStore } from "../../components/State Manager/appManager"
import {Cable} from "lucide-react"
import Bundle from "@/lib/server/Bundle/bundle"


export const LinqButton = () => {
    const selectedFiles = useFileStore((state)=>state.selectedFiles)
    const ClearSelection = useFileStore((state)=>state.ClearSelection)
    const UpdateFiles = useFileStore((state)=>state.UpdateFiles)
    const SetActionLoading = useFileStore((state)=>state.SetActionLoading)

    return (

    <button className={selectedFiles.size > 0 ? "but linq active" : "but linq"} onClick={async () => {
        if(selectedFiles.size > 0) {
            SetActionLoading(true, "Linqing files...")
            try {
                const bundle = await Bundle(Array.from(selectedFiles)) as {bundle: FileData, links: {to_id: string, from_id: string}[]}
                ClearSelection()
                UpdateFiles([bundle?.bundle as any])
            } finally {
                SetActionLoading(false)
            }
        }
    }}>
        <div className={"but-content"} style={{display : "flex", alignItems : "center"}}>
            <Cable size={16} style={{marginRight : "0.25rem"}}/>
            <span>Linq</span>
        </div>
        
    </button>)
}