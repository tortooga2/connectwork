"use client"
import { useFileStore } from "../components/State Manager/appManager"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTrash } from "@fortawesome/free-solid-svg-icons"

export const DeleteButton = () => {
    const selectedFiles = useFileStore((state) => state.selectedFiles);
    const ClearSelection = useFileStore((state) => state.ClearSelection);
    const deleteFiles = useFileStore((state) => state.deleteFiles);

    return (
        <button
            onClick={async () => {
                if (selectedFiles.size > 0) {
                    await deleteFiles();
                    ClearSelection()
                }
            }}
            style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.875rem 1.75rem",
                border: "var(--theme-border-width) solid var(--theme-btn-delete-border)",
                borderRadius: "var(--theme-border-radius)",
                backgroundColor: "var(--theme-btn-delete-bg)",
                color: "var(--theme-btn-delete-text)",
                cursor: selectedFiles.size > 0 ? "pointer" : "not-allowed",
                fontSize: "1.125rem",
                fontWeight: "500",
                transition: "all 0.2s ease",
                opacity: selectedFiles.size > 0 ? "1" : "0.6"
            }}
            onMouseEnter={(e) => {
                if (selectedFiles.size > 0) {
                    e.currentTarget.style.backgroundColor = "var(--theme-btn-delete-hover-bg)"
                    e.currentTarget.style.opacity = "var(--theme-btn-delete-hover-opacity)"
                }
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "var(--theme-btn-delete-bg)"
                e.currentTarget.style.opacity = selectedFiles.size > 0 ? "1" : "0.6"
            }}
            disabled={selectedFiles.size === 0}
        >
            <FontAwesomeIcon icon={faTrash} style={{ color: "var(--theme-btn-delete-icon)" }} />
            ({selectedFiles.size})
        </button>
    )
}