"use client"
import { useState, useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import type { File } from "../State Manager/appManager"
import { useFileStore } from "../State Manager/appManager"
import { FileType } from "../TypeTags"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEye, faCopy } from "@fortawesome/free-solid-svg-icons"




export const FileItem = ({ file }: { file: File }) => {

    const [onEnter, SetOnEnter] = useState({ width: "100%" })
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


    useEffect(() => {
        SetOnEnter({ width: "0%" })
    }, [])

    return (
        <div>
            <div className={"row"}>
                <div>
                    <input type={"checkbox"} ref={checkboxRef} onClick={() => {
                        if (checkboxRef?.current) {
                            const state = checkboxRef.current.checked
                            SelectFile(file.id, state)
                        }
                    }} />
                </div>
                <div className={"column"}>{file.id}</div>
                <div className={"column"}>{new Date(file.createdAt).toISOString()}</div>
                <div className={"column"}>{FileType(file.type, layoutState == 0 || viewportWidth < 768)}</div>
                <div className={"column"}>{file.creator_email}</div>
                <div className={"column"}>{file.name}</div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", position: "relative" }}>
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
                        style={{
                            textDecoration: "underline",
                            fontSize: "0.875rem",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            maxWidth: "100%"
                        }}
                    >
                        Open in new tab
                    </a>
                </div>
                <div>
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
                            marginLeft: "2rem"
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
                <div style={{ position: "absolute", right: "0", height: "100%", ...onEnter, backgroundColor: "var(--background)", transition: "width 0.5s ease-in-out 0.2s" }}></div>
            </div>
        </div>
    )

}