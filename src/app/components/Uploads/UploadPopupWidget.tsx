"use client"

import { useRef, useState, useEffect } from "react"
import { useFileStore } from "../State Manager/appManager"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTimes } from "@fortawesome/free-solid-svg-icons"

const MAX_FILES = 10

function ListItem({
    index,
    name,
    remove,
    percentage,
}: {
    index: number
    name: string
    remove: (name: string) => void
    percentage: number
}) {
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
                color: "var(--theme-text-primary)",
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div
                style={{
                    position: "absolute",
                    top: "50%",
                    transform: "translateY(-50%)",
                    borderRadius: "var(--theme-border-radius)",
                    paddingLeft: "0.5rem",
                    paddingRight: "0.5rem",
                    zIndex: 1000,
                    ...(isHovered ? { pointerEvents: "auto", left: "0.5rem" } : { pointerEvents: "none", left: "-2rem" }),
                    ...(removeHovered
                        ? { backgroundColor: "var(--theme-btn-delete-hover-bg)", color: "var(--theme-btn-delete-text)" }
                        : { backgroundColor: "var(--theme-bg-tertiary)", color: "var(--theme-text-primary)" }),
                    transition: "left 0.2s, background-color 0.2s",
                    cursor: "pointer",
                }}
                onMouseEnter={() => {
                    setRemoveHovered(true)
                    setIsHovered(true)
                }}
                onMouseLeave={() => {
                    setRemoveHovered(false)
                }}
                onClick={() => {
                    SetError("File Removed")
                    remove(name)
                }}
            >
                -
            </div>
            <div style={{ ...(isHovered ? { opacity: 0 } : { opacity: 1 }) }}>{index}</div>
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
                    backgroundColor: "var(--theme-bg-primary)",
                    opacity: 0.5,
                    borderRadius: "var(--theme-border-radius)",
                }}
            />
        </div>
    )
}

export function UploadPopupWidget({ onClose }: { onClose: () => void }) {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [files, setFiles] = useState<File[]>([])
    const [progress, setProgress] = useState<Record<string, number>>({})
    const uploadFiles = useFileStore((state) => state.uploadFiles)
    const SetError = useFileStore((state) => state.SetError)

    const onProgress = (name: string, percent: number) => {
        setProgress((prev) => ({ ...prev, [name]: percent }))
    }

    useEffect(() => {
        setFiles((prev) => prev.filter((f) => progress[f.name] !== 100))
    }, [progress])

    const removeFile = (name: string) => {
        setFiles((prev) => prev.filter((f) => f.name !== name))
        setProgress((prev) => {
            const next = { ...prev }
            delete next[name]
            return next
        })
    }

    const handleAdd = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newfiles = event.target.files
        if (!newfiles || newfiles.length === 0) return
        const newList = [...files, ...Array.from(newfiles)]
        if (newList.length > MAX_FILES) {
            SetError("Hit upload limit :(")
            newList.length = MAX_FILES
        }
        setFiles(newList)
        const newProgress: Record<string, number> = {}
        for (let i = 0; i < newList.length; i++) {
            newProgress[newList[i].name] = 0
        }
        setProgress(newProgress)
        event.target.value = ""
    }

    const handleClear = () => {
        setFiles([])
        setProgress({})
    }

    const handleUpload = async (e: React.MouseEvent) => {
        e.preventDefault()
        if (!files || files.length === 0) {
            SetError("No files selected")
            return
        }
        const dt = new DataTransfer()
        files.forEach((f) => dt.items.add(f))
        try {
            SetError(null)
            await uploadFiles(dt.files, onProgress)
            setProgress({})
            setFiles([])
            onClose()
        } catch (error) {
            SetError(error instanceof Error ? error.message : "Upload failed")
        }
    }

    return (
        <div
            style={{
                position: "fixed",
                bottom: "4rem",
                left: "50%",
                transform: "translateX(-50%)",
                width: "min(22rem, calc(100vw - 2rem))",
                background: "var(--theme-bg-secondary)",
                border: "1px solid var(--theme-border-primary)",
                borderRadius: "var(--theme-border-radius)",
                padding: "1rem",
                boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
                zIndex: 10000,
                color: "var(--theme-text-primary)",
            }}
            onClick={(e) => e.stopPropagation()}
        >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                <span style={{ fontWeight: 600, fontSize: "0.9375rem" }}>File Upload</span>
                <button
                    type="button"
                    onClick={onClose}
                    className="btn-toolbar"
                    style={{ padding: "0.25rem 0.5rem", minWidth: "auto" }}
                    aria-label="Close"
                >
                    <FontAwesomeIcon icon={faTimes} />
                </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", overflowY: "auto", maxHeight: "12rem" }}>
                {Array.from(files).map((f, index) => (
                    <ListItem
                        index={index + 1}
                        name={f.name}
                        key={`${f.name}-${index}`}
                        remove={removeFile}
                        percentage={progress[f.name] ?? 0}
                    />
                ))}
            </div>

            <div
                style={{
                    padding: "0.5rem",
                    border: "1px solid var(--theme-border-primary)",
                    marginTop: "0.5rem",
                    borderRadius: "var(--theme-border-radius)",
                }}
            >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <button
                            type="button"
                            className="btn-toolbar"
                            onClick={() => {
                                if (!fileInputRef.current) {
                                    SetError("Upload input not ready")
                                    return
                                }
                                fileInputRef.current.click()
                            }}
                            style={{ padding: "0.4rem 0.75rem", minWidth: "auto" }}
                        >
                            Add
                        </button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            style={{ display: "none" }}
                            onChange={handleAdd}
                        />
                        <button type="button" className="btn-toolbar" onClick={handleClear} style={{ padding: "0.4rem 0.75rem", minWidth: "auto" }}>
                            Clear
                        </button>
                    </div>
                    <div style={{ fontSize: "0.8125rem", color: "var(--theme-text-secondary)" }}>{files.length}/10</div>
                </div>
                <button
                    type="button"
                    className="btn-toolbar"
                    onClick={handleUpload}
                    style={{ marginTop: "0.5rem", padding: "0.5rem 1rem", width: "100%" }}
                >
                    Upload
                </button>
            </div>
        </div>
    )
}
