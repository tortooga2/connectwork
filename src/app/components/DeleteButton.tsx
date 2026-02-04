"use client"
import { useFileStore } from "../components/State Manager/appManager"
import { Trash } from "lucide-react"

export const DeleteButton = () => {
    const selectedFiles = useFileStore((state)=>state.selectedFiles);
    const ClearSelection = useFileStore((state)=>state.ClearSelection);
    const deleteFiles = useFileStore((state) => state.deleteFiles);

    return (
        <div className={selectedFiles.size > 0 ? "dock-item active" : "dock-item"}>
            <button className={selectedFiles.size > 0 ? "but delete active" : "but delete"} onClick={async () => {
                if(selectedFiles.size > 0) {
                    await deleteFiles();
                    ClearSelection()
                }
            }}>
                <div className={"but-content"} style={{display : "flex", alignItems : "center"}}>
                    <Trash size={16} style={{marginRight : "0.25rem"}}/> {selectedFiles.size}
                </div>
            </button>
        </div>
    )}