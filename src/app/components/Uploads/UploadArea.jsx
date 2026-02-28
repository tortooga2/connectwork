"use client"

import { useRef, useState, useEffect } from "react"
import { useFileStore } from "../State Manager/appManager"

const ListItem = ({ index, name, remove, percentage = 0 }) => {
    const [isHovered, setIsHovered] = useState(false)
    const [removeHovered, setRemoveHovered] = useState(false)
    const SetError = useFileStore((state) => state.SetError)

    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                position: "relative",
                overflowX: "hidden",
                padding: "0.5rem",
                paddingLeft: "1rem",
                paddingRight: "1rem",
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <button
                type="button"
                style={{
                    position: "absolute",
                    top: "50%",
                    transform: "translateY(-50%)",
                    borderRadius: "var(--border-rad)",
                    padding: "0.25rem 0.5rem",
                    zIndex: 1000,
                    left: isHovered ? "0.5rem" : "-2rem",
                    pointerEvents: isHovered ? "auto" : "none",
                    transition: "left 0.2s, background-color 0.2s",
                    cursor: "pointer",
                    border: "none",
                    backgroundColor: removeHovered ? "#ffc2c3" : "transparent",
                    color: removeHovered ? "#f52727" : "var(--foreground)",
                }}
                onMouseEnter={() => { setRemoveHovered(true); setIsHovered(true) }}
                onMouseLeave={() => setRemoveHovered(false)}
                onClick={() => {
                    remove(name)
                    SetError(null)
                }}
                aria-label={`Remove ${name}`}
            >
                −
            </button>
            <div style={{ opacity: isHovered ? 0 : 1, minWidth: "1.25rem" }}>{index}</div>
            <span
                style={{
                    overflowX: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    flex: 1,
                }}
            >
                {name}
            </span>
            <div
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    height: "100%",
                    width: `${percentage}%`,
                    backgroundColor: "var(--background)",
                    opacity: 0.5,
                    borderRadius: "var(--border-rad)",
                }}
            />
        </div>
    )
}

const UploadArea = ({ onClose }) => {
    const fileInputRef = useRef(null)
    const [files, setFiles] = useState([])
    const [progress, setProgress] = useState({})
    const uploadFiles = useFileStore((state) => state.uploadFiles)
    const SetError = useFileStore((state) => state.SetError)

    const onProgress = (name, percent) => {
        setProgress((prev) => ({ ...prev, [name]: percent }))
    }

    useEffect(() => {
        setFiles((prev) => prev.filter((f) => progress[f.name] !== 100))
    }, [progress])

    const removeFile = (name) => {
        setFiles((prev) => prev.filter((f) => f.name !== name))
        setProgress((prev) => {
            const next = { ...prev }
            delete next[name]
            return next
        })
    }

    const handleAddClick = () => {
        if (fileInputRef.current) fileInputRef.current.click()
        else SetError("Upload not ready")
    }

    const handleFileChange = (e) => {
        const newFiles = e.target.files ? Array.from(e.target.files) : []
        const combined = [...files, ...newFiles]
        const capped = combined.length > 10 ? combined.slice(0, 10) : combined
        if (combined.length > 10) SetError("Max 10 files")
        setFiles(capped)
        const nextProgress = {}
        capped.forEach((f) => (nextProgress[f.name] = 0))
        setProgress(nextProgress)
        e.target.value = ""
    }

    const handleUpload = async () => {
        if (!files.length) {
            SetError("No files selected")
            return
        }
        SetError(null)
        try {
            const dt = new DataTransfer()
            files.forEach((f) => dt.items.add(f))
            await uploadFiles(dt.files, onProgress)
            setFiles([])
            setProgress({})
            onClose?.()
        } catch (err) {
            SetError(err instanceof Error ? err.message : "Upload failed")
        }
    }

    return (
        <div
            style={{
                border: "var(--border-width) solid var(--foreground)",
                padding: "1rem",
                borderRadius: "var(--border-rad)",
                backgroundColor: "var(--accent-color)",
                minWidth: "320px",
            }}
        >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                <span style={{ fontWeight: 600 }}>File Upload</span>
                {onClose && (
                    <button
                        type="button"
                        onClick={onClose}
                        style={{
                            background: "transparent",
                            border: "none",
                            color: "var(--foreground)",
                            cursor: "pointer",
                            padding: "0.25rem 0.5rem",
                            fontSize: "1.25rem",
                            lineHeight: 1,
                        }}
                        aria-label="Close"
                    >
                        ×
                    </button>
                )}
            </div>
            <div style={{ display: "flex", flexDirection: "column", overflowY: "auto", maxHeight: "240px" }}>
                {files.map((f, i) => (
                    <ListItem
                        key={`${f.name}-${i}`}
                        index={i + 1}
                        name={f.name}
                        remove={removeFile}
                        percentage={progress[f.name] ?? 0}
                    />
                ))}
            </div>
            <div
                style={{
                    padding: "0.5rem",
                    border: "var(--border-width) solid var(--foreground)",
                    marginTop: "0.5rem",
                    borderRadius: "var(--border-rad)",
                }}
            >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <button type="button" onClick={handleAddClick}>
                            Add
                        </button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            style={{ visibility: "hidden", position: "absolute", width: 0, height: 0 }}
                            onChange={handleFileChange}
                        />
                        <button type="button" onClick={() => { setFiles([]); setProgress({}) }}>
                            Clear
                        </button>
                    </div>
                    <span>{files.length}/10</span>
                </div>
                <button type="button" style={{ marginTop: "0.5rem" }} onClick={handleUpload}>
                    Upload
                </button>
            </div>
        </div>
    )
}

export default UploadArea
