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
            className="btn-toolbar"
            onClick={async () => {
                if (selectedFiles.size > 0) {
                    await deleteFiles();
                    ClearSelection()
                }
            }}
            style={{ color: "var(--theme-btn-delete-text)" }}
            disabled={selectedFiles.size === 0}
        >
            <FontAwesomeIcon icon={faTrash} style={{ color: "var(--theme-btn-delete-icon)" }} />
            ({selectedFiles.size})
        </button>
    )
}