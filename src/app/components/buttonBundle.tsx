"use client"
import { FileData } from "@/lib/Types/Types"
import { useFileStore } from "../components/State Manager/appManager"
import Bundle from "@/lib/server/Bundle/bundle"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faLink } from "@fortawesome/free-solid-svg-icons"

export const ButtonBundle = () => {
    const selectedFiles = useFileStore((state)=>state.selectedFiles)
    const ClearSelection = useFileStore((state)=>state.ClearSelection)
    const UpdateFiles = useFileStore((state)=>state.UpdateFiles)

    return (
        <button 
            onClick={async () => {
                if(selectedFiles.size > 0) {
                    const bundle = await Bundle(Array.from(selectedFiles)) as {bundle: FileData, links: {to_id: string, from_id: string}[]}
                    ClearSelection()
                    UpdateFiles([bundle?.bundle as FileData])
                }
            }}
            style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.875rem 1.75rem",
                border: "var(--theme-border-width) solid #D7827E",
                borderRadius: "var(--theme-border-radius)",
                backgroundColor: "var(--theme-bg-secondary)",
                color: "#D7827E",
                cursor: selectedFiles.size > 0 ? "pointer" : "not-allowed",
                fontSize: "1.125rem",
                fontWeight: "500",
                transition: "all 0.2s ease",
                opacity: selectedFiles.size > 0 ? 1 : 0.6
            }}
            onMouseEnter={(e) => {
                if(selectedFiles.size > 0) {
                    e.currentTarget.style.backgroundColor = "var(--theme-bg-tertiary)"
                    e.currentTarget.style.opacity = "0.9"
                }
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "var(--theme-bg-secondary)"
                e.currentTarget.style.opacity = selectedFiles.size > 0 ? 1 : 0.6
            }}
            disabled={selectedFiles.size === 0}
        >
            <FontAwesomeIcon icon={faLink} style={{ color: "#D7827E" }} />
            Linq ({selectedFiles.size})
        </button>
    )
}