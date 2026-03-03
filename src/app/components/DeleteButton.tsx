"use client"
import { useFileStore } from "../components/State Manager/appManager"
import { Trash } from "lucide-react"

export const DeleteButton = () => {
    const selectedFiles = useFileStore((state) => state.selectedFiles);
    const ClearSelection = useFileStore((state) => state.ClearSelection);
    const deleteFiles = useFileStore((state) => state.deleteFiles);

    const isActive = selectedFiles.size > 0;
    return (
        <button
            className={`but delete ${isActive ? "active" : ""}`}
            onClick={async () => {
                if (selectedFiles.size > 0) {
                    await deleteFiles();
                    ClearSelection()
                }
            }}
            style={{
                backgroundColor: isActive ? "var(--delete-color-2)" : "transparent",
                color: isActive ? "#fff" : "var(--foreground)",
                opacity: isActive ? 1 : 0.6,
                cursor: isActive ? "pointer" : "not-allowed",
                border: isActive ? "none" : "1px solid rgba(255,255,255,0.25)",
            }}
            onMouseEnter={(e) => {
                if (isActive) {
                    e.currentTarget.style.filter = "brightness(1.1)"
                }
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.filter = "none"
            }}
            disabled={!isActive}
        >
            <div className="but-content" style={{ display: "flex", alignItems: "center" }}>
                <Trash size={18} style={{ marginRight: "0.25rem" }} />
                <span>{selectedFiles.size}</span>
            </div>
        </button>
    )
}