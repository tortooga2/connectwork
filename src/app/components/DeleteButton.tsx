"use client"
import { useFileStore } from "../components/State Manager/appManager"


export const DeleteButton = () => {
    const selectedFiles = useFileStore((state)=>state.selectedFiles);
    const ClearSelection = useFileStore((state)=>state.ClearSelection);
    const deleteFiles = useFileStore((state) => state.deleteFiles);

    return (<button onClick={async () => {
        if(selectedFiles.size > 0) {
            await deleteFiles();
            ClearSelection()
        }
    }}>Delete ({selectedFiles.size})</button>)
}