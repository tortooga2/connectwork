"use client"
import { useState, useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import type { File } from "../State Manager/appManager"
import { useFileStore } from "../State Manager/appManager"
import { FileType } from "../TypeTags"
import { getFileType } from "@/lib/client/getFileType"
import { formatRelativeDate } from "@/lib/client/formatDate"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEye, faCopy } from "@fortawesome/free-solid-svg-icons"




export const FileItem = ({ file }: { file: File }) => {

    const [viewportWidth, setViewportWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0)
    const [showCopied, setShowCopied] = useState(false)
    const [toastPosition, setToastPosition] = useState<{ left: number; top: number } | null>(null)

    useEffect(() => {
        const handleResize = () => {
            setViewportWidth(window.innerWidth)
        }

        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    const isSelected = useFileStore((state) => {
        return state.selectedFiles.has(file.id)
    })

    const SelectFile = useFileStore((state) => state.SelectFile);

    const checkboxRef = useRef<HTMLInputElement>(null)

    const SetPreviewFile = useFileStore((state) => state.SetPreviewedFile);
    const previewedFile = useFileStore((state) => state.previewedFile);

    const SetLayoutState = useFileStore((state) => state.SetLayoutState);
    const layoutState = useFileStore((state) => state.layoutState);


    useEffect(() => {
        if (checkboxRef?.current) {
            checkboxRef.current.checked = isSelected;
        }

    }, [isSelected])

    return (
        <div className={"file-table-row"}>
                <div className={"row-cell"}>
                    <input type={"checkbox"} ref={checkboxRef} onClick={() => {
                        if (checkboxRef?.current) {
                            const state = checkboxRef.current.checked
                            SelectFile(file.id, state)
                        }
                    }} />
                </div>
                <div className={"column"} title={file.id}><span className={"file-table-cell-truncate"}>{typeof file.id === "string" ? file.id.slice(-5) : file.id}</span></div>
                <div
                    className={"column"}
                    title={file.createdAt ? new Date(file.createdAt).toISOString() : undefined}
                >
                    <span className={"file-table-cell-truncate"}>{file.createdAt ? formatRelativeDate(file.createdAt) : ""}</span>
                </div>
                <div className={"column column-type"}><div className={"file-table-cell-truncate"}>{FileType(file.type, true)}</div></div>
                <div className={"column"} title={file.creator_email ?? ""}><span className={"file-table-cell-truncate"}>{file.creator_email}</span></div>
                <div className={"column"} title={getFileType(file.type) === "Bundle" ? "Linq" : file.name}><span className={"file-table-cell-truncate"}>{getFileType(file.type) === "Bundle" ? "Linq" : file.name}</span></div>
                <div className={"column column-url"} style={{ display: "flex", alignItems: "center", justifyContent: "flex-start", gap: "0.5rem", position: "relative" }}>
                    <button
                        onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            const btn = e.currentTarget
                            const url = `${typeof window !== "undefined" ? window.location.origin : ""}/preview/${file.id}`
                            navigator.clipboard.writeText(url).then(() => {
                                const rect = btn.getBoundingClientRect()
                                setToastPosition({ left: rect.right, top: rect.top })
                                setShowCopied(true)
                                setTimeout(() => {
                                    setShowCopied(false)
                                    setToastPosition(null)
                                }, 1000)
                            })
                        }}
                        title="Copy link"
                        style={{
                            background: "transparent",
                            border: "none",
                            color: "var(--theme-text-primary)",
                            cursor: "pointer",
                            padding: "0.35rem",
                            fontSize: "1rem",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "opacity 0.2s ease, color 0.2s ease-out",
                            borderRadius: "var(--theme-border-radius)"
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.opacity = "0.7"
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.opacity = "1"
                        }}
                    >
                        <FontAwesomeIcon icon={faCopy} />
                    </button>
                    {showCopied && toastPosition && typeof document !== "undefined" && createPortal(
                        <span
                            className="copy-toast copy-toast-portal"
                            role="status"
                            aria-live="polite"
                            style={{
                                position: "fixed",
                                left: toastPosition.left,
                                top: toastPosition.top,
                                transform: "translate(-100%, -100%) translateY(-0.25rem)",
                            }}
                        >
                            Copied!
                        </span>,
                        document.body
                    )}
                    <a
                        href={`/preview/${file.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={`${typeof window !== "undefined" ? window.location.origin : ""}/preview/${file.id}`}
                        style={{
                            textDecoration: "underline",
                            fontSize: "0.875rem",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            minWidth: 0,
                            flex: "1 1 0"
                        }}
                    >
                        Open in new tab
                    </a>
                </div>
                <div className={"column column-quickview"}>
                    <button
                        onClick={() => {
                            console.log(file);
                            SetPreviewFile(file);
                            SetLayoutState(1);
                        }}
                        style={{
                            background: "transparent",
                            border: "none",
                            color: "var(--theme-text-primary)",
                            cursor: "pointer",
                            padding: "0.5rem",
                            fontSize: "1.25rem",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "opacity 0.2s ease, color 0.2s ease-out, background-color 0.2s ease",
                            borderRadius: "var(--theme-border-radius)",
                            marginLeft: 0
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.opacity = "0.7"
                            e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)"
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.opacity = "1"
                            e.currentTarget.style.backgroundColor = "transparent"
                        }}
                    >
                        <FontAwesomeIcon icon={faEye} />
                    </button>
                </div>
        </div>
    )

}