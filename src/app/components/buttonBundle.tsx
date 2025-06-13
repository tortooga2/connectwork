"use client"
import { useFileStore } from "../components/State Manager/appManager"
import Bundle from "@/lib/server/Bundle/bundle"
export const ButtonBundle = () => {
    const selectedFiles = useFileStore((state)=>state.selectedFiles)
    const ClearSelection = useFileStore((state)=>state.ClearSelection)
    const UpdateFiles = useFileStore((state)=>state.UpdateFiles)

    return (<button onClick={async () => {
        if(selectedFiles.size > 0) {
            const bundle = await Bundle(Array.from(selectedFiles))
            ClearSelection()
            UpdateFiles([bundle?.bundle as any])
           
        }
    }}>Bundle ({selectedFiles.size}) </button>)
}