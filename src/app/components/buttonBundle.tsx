"use client"
import { FileData } from "@/lib/Types/Types"
import { useFileStore } from "../components/State Manager/appManager"
import Bundle from "@/lib/server/Bundle/bundle"
export const ButtonBundle = () => {
    const selectedFiles = useFileStore((state)=>state.selectedFiles)
    const ClearSelection = useFileStore((state)=>state.ClearSelection)
    const UpdateFiles = useFileStore((state)=>state.UpdateFiles)

    return (<button onClick={async () => {
        if(selectedFiles.size > 0) {
            const bundle = await Bundle(Array.from(selectedFiles)) as {bundle: FileData, links: {to_id: string, from_id: string}[]}
            ClearSelection()
            UpdateFiles([bundle?.bundle as File])
           
        }
    }}>Bundle ({selectedFiles.size}) </button>)
}