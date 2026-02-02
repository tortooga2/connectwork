"use client"
import { useFileStore, type File } from "./State Manager/appManager"
import Bundle from "@/lib/server/Bundle/bundle"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faLink } from "@fortawesome/free-solid-svg-icons"

export const ButtonBundle = () => {
    const selectedFiles = useFileStore((state)=>state.selectedFiles)
    const ClearSelection = useFileStore((state)=>state.ClearSelection)
    const UpdateFiles = useFileStore((state)=>state.UpdateFiles)

    return (
        <button
            className="btn-toolbar"
            onClick={async () => {
                if(selectedFiles.size > 0) {
                    const result = await Bundle(Array.from(selectedFiles)) as unknown as { bundle: { id: string; creator_id: string; name: string; type: string; description: string | null; file_id: string | null; createdAt: Date | string; creator_email: string | null }; links: { to_id: string; from_id: string }[] }
                    ClearSelection()
                    const b = result?.bundle
                    if (b) {
                        const file: File = {
                            id: b.id,
                            creator_id: b.creator_id,
                            name: b.name,
                            type: b.type,
                            description: b.description ?? null,
                            file_id: b.file_id ?? null,
                            createdAt: typeof b.createdAt === "string" ? b.createdAt : b.createdAt.toISOString(),
                            creator_email: b.creator_email ?? null,
                        }
                        UpdateFiles([file])
                    }
                }
            }}
            style={{ color: "var(--theme-btn-linq-text)" }}
            disabled={selectedFiles.size === 0}
        >
            <FontAwesomeIcon icon={faLink} style={{ color: "var(--theme-btn-linq-icon)" }} />
            Linq ({selectedFiles.size})
        </button>
    )
}