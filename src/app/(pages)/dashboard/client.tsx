"use client"
import { NewPage, VerticalDiv, HorizontalDiv } from "@/app/components/UILayout"
import { useUser, useClerk } from "@clerk/nextjs"
import { FilesList } from "@/app/components/FileList"
import { useFileStore } from "@/app/components/State Manager/appManager"
import { Preview } from "@/app/components/Preview"
import Tiptap from "@/app/components/TextEditor"
import { FileType } from "@/app/components/TypeTags"
import { getFileType } from "@/lib/client/getFileType"
import { formatRelativeDate } from "@/lib/client/formatDate"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faX, faFile, faPaperclip } from "@fortawesome/free-solid-svg-icons"
import { useRef, useState, useEffect } from "react"
import { DeleteButton } from "@/app/components/DeleteButton"
import { ButtonBundle } from "@/app/components/buttonBundle"

// Simple Upload Button Component
const UploadButton = () => {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const uploadFile = useFileStore((state) => state.uploadFiles)
    const SetError = useFileStore((state) => state.SetError)

    const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files
        if (!files || files.length === 0) return

        try {
            await uploadFile(files, null)
        } catch (error) {
            SetError(error instanceof Error ? error.message : "Upload failed")
        }

        // Reset input
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    return (
        <>
            <button
                className="btn-toolbar"
                onClick={() => fileInputRef.current?.click()}
            >
                <FontAwesomeIcon icon={faPaperclip} />
                Upload File
            </button>
            <input
                ref={fileInputRef}
                type="file"
                multiple
                style={{ display: "none" }}
                onChange={handleUpload}
            />
        </>
    )
}


export const Dashboard = ({ }) => {
    const { user } = useUser()
    const { signOut } = useClerk()
    const layoutState = useFileStore((state) => state.layoutState)
    const setLayoutState = useFileStore((state) => state.SetLayoutState)
    const previewedFile = useFileStore((state) => state.previewedFile)
    const SetLayoutState = useFileStore((state) => state.SetLayoutState)

    const userEmail = user?.primaryEmailAddress?.emailAddress || user?.emailAddresses?.[0]?.emailAddress || ""
    const selectedFiles = useFileStore((state) => state.selectedFiles)
    const fileListRef = useRef<HTMLDivElement>(null)
    const [fileListHeight, setFileListHeight] = useState(0)

    useEffect(() => {
        const el = fileListRef.current
        if (!el) return
        const ro = new ResizeObserver(() => {
            setFileListHeight(el.offsetHeight)
        })
        ro.observe(el)
        setFileListHeight(el.offsetHeight)
        return () => ro.disconnect()
    }, [])

    const [windowHeight, setWindowHeight] = useState(() => (typeof window !== "undefined" ? window.innerHeight : 900))
    useEffect(() => {
        const onResize = () => setWindowHeight(window.innerHeight)
        window.addEventListener("resize", onResize)
        return () => window.removeEventListener("resize", onResize)
    }, [])
    const spacerHeightPx = Math.max(0, fileListHeight + 9.5 * 16 - windowHeight)

    return (
        <NewPage>
            <VerticalDiv style={{ position: "relative", minHeight: "100vh", overflowY: spacerHeightPx > 0 ? "auto" : "hidden", paddingBottom: spacerHeightPx > 0 ? "5.5rem" : 0 }}>
                {/* File list wrapper: header + table share same position/width so header is centered above table */}
                <div ref={fileListRef} style={{ position: "absolute", top: "4rem", left: "1rem", right: "1rem", padding: 0, margin: 0, height: "auto", minHeight: "calc((100vh - 9.5rem) / 2)" }}>
                    {/* Header: same left/width as table panel, positioned above it */}
                    <div style={{
                        position: "absolute",
                        top: "-3rem",
                        left: layoutState === 0 ? 0 : layoutState === 1 ? 0 : "40%",
                        width: layoutState === 0 ? "100%" : "60%",
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "1rem",
                        zIndex: 1000,
                        transition: "left 0.08s ease-out, width 0.08s ease-out",
                        boxSizing: "border-box"
                    }}>
                        <h1 style={{ fontSize: "1.5rem", fontWeight: "bold", margin: 0, color: "var(--theme-btn-linq-text)", flexShrink: 0 }}>Linquiq</h1>
                        <input
                            type="search"
                            placeholder="Search…"
                            aria-label="Search"
                            style={{
                                flex: "1",
                                maxWidth: "24rem",
                                margin: "0 auto",
                                padding: "0.5rem 0.9rem",
                                fontSize: "0.9375rem",
                                borderRadius: "var(--theme-border-radius)",
                                border: "1px solid var(--theme-border-primary)",
                                background: "var(--theme-bg-secondary)",
                                color: "var(--theme-text-primary)",
                                outline: "none"
                            }}
                        />
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap", flexShrink: 0 }}>
                            <span style={{ fontSize: "0.875rem", opacity: 0.8 }}>{userEmail}</span>
                            <button
                                type="button"
                                className="btn-toolbar"
                                onClick={() => signOut?.()}
                                style={{ color: "var(--theme-text-secondary)", border: "1px solid var(--theme-border-primary)" }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.color = "var(--theme-text-primary)"
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.color = "var(--theme-text-secondary)"
                                }}
                            >
                                Sign out
                            </button>
                        </div>
                    </div>
                    <HorizontalDiv color="var(--theme-bg-primary)" style={{ padding: "1rem", border: "none", borderRadius: "var(--theme-border-radius)", zIndex: "1", transition: "width 0.08s ease-out, left 0.08s ease-out, right 0.08s ease-out", height: "auto", minHeight: 0 }} layouts={[
                        {
                            position: "absolute",
                            left: 0,
                            width: "100%",
                        },
                        {
                            position: "absolute",
                            left: 0,
                            width: "60%",
                        },
                        {
                            position: "absolute",
                            left: "40%",
                            width: "60%",
                        }
                    ]}
                        state={layoutState}
                    >
                        <FilesList />
                    </HorizontalDiv>
                </div>
                {spacerHeightPx > 0 && (
                    <>
                        <div style={{ height: "100vh", flexShrink: 0 }} aria-hidden />
                        <div style={{ height: `${spacerHeightPx}px`, flexShrink: 0 }} aria-hidden />
                    </>
                )}

                {/* Action dock: fixed to viewport bottom center when scrolling */}
                <div className="action-dock" style={{
                    position: "fixed",
                    bottom: "1rem",
                    left: "50%",
                    transform: "translateX(-50%)",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.75rem",
                    padding: "0.5rem 1rem",
                    borderRadius: "var(--theme-border-radius)",
                    background: "var(--theme-bg-secondary)",
                    border: "1px solid var(--theme-border-primary)",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    zIndex: 9999
                }}>
                    {selectedFiles.size > 0 && <ButtonBundle />}
                    <button
                        className="btn-toolbar"
                        onClick={() => setLayoutState(2)}
                        style={{ color: "var(--note-color-2)" }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.color = "var(--note-color-2)"
                        }}
                    >
                        <FontAwesomeIcon icon={faFile} />
                        New Note
                    </button>
                    <UploadButton />
                    {selectedFiles.size > 0 && <DeleteButton />}
                </div>

                {/* Preview Panel - Right Side (always mounted; wrapper controls visibility so it updates) */}
                <div
                    style={{
                        position: "absolute",
                        right: "1rem",
                        top: "5rem",
                        bottom: "5.5rem",
                        width: "calc(40% - 1rem)",
                        visibility: layoutState === 1 ? "visible" : "hidden",
                        pointerEvents: layoutState === 1 ? "auto" : "none",
                        zIndex: 10
                    }}
                >
                    <VerticalDiv style={{ width: "100%", height: "100%" }} padding="0rem">
                        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", width: "100%", height: "100%" }}>
                            <div style={{ display: "flex", flexDirection: "row", width: "100%", justifyContent: "space-between", alignItems: "center", paddingBottom: "1rem", borderBottom: "var(--theme-border-width) solid var(--theme-border-primary)" }}>
                                <h1 style={{ fontSize: "2.5rem", margin: 0 }}>{getFileType(previewedFile?.type ?? "") === "Bundle" ? "Linq" : previewedFile?.name}</h1>
                                <button
                                    onClick={() => SetLayoutState(0)}
                                    style={{
                                        background: "transparent",
                                        border: "none",
                                        color: "var(--theme-text-primary)",
                                        cursor: "pointer",
                                        padding: "0.5rem",
                                        fontSize: "1.5rem",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        transition: "opacity 0.2s ease"
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.opacity = "0.7"
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.opacity = "1"
                                    }}
                                >
                                    <FontAwesomeIcon icon={faX} />
                                </button>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                {FileType(previewedFile?.type)}
                                <span><span style={{ fontWeight: "bold" }}>ID:</span> <span title={previewedFile?.id}>{previewedFile?.id ? (typeof previewedFile.id === "string" ? previewedFile.id.slice(-5) : previewedFile.id) : ""}</span></span>
                                <span><span style={{ fontWeight: "bold" }}>Created:</span>{" "}
                                    <span title={previewedFile?.createdAt ? `UTC: ${new Date(previewedFile.createdAt).toISOString()}` : ""}>
                                        {previewedFile?.createdAt ? formatRelativeDate(previewedFile.createdAt) : ""}
                                    </span>
                                </span>
                                <span><span style={{ fontWeight: "bold" }}>Creator:</span> {previewedFile?.creator_email}</span>
                            </div>
                            <div style={{ flex: 1, overflow: "auto" }}>
                                <Preview />
                            </div>
                        </div>
                    </VerticalDiv>
                </div>

                {/* Note Editor Panel - Left Side (always mounted; wrapper controls visibility so it updates) */}
                <div
                    style={{
                        position: "absolute",
                        left: "1rem",
                        top: "5rem",
                        bottom: "5.5rem",
                        width: "calc(40% - 1rem)",
                        backgroundColor: "var(--theme-bg-secondary)",
                        borderRadius: "var(--theme-border-radius)",
                        padding: "1rem",
                        visibility: layoutState === 2 ? "visible" : "hidden",
                        pointerEvents: layoutState === 2 ? "auto" : "none",
                        zIndex: 10
                    }}
                >
                    <div style={{ position: "relative", flex: 1, overflow: "auto", height: "100%" }}>
                        <button
                            onClick={() => setLayoutState(0)}
                            style={{
                                position: "absolute",
                                top: "0.5rem",
                                right: "0.5rem",
                                background: "transparent",
                                border: "none",
                                color: "var(--theme-text-primary)",
                                cursor: "pointer",
                                padding: "0.5rem",
                                fontSize: "1.5rem",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                transition: "opacity 0.2s ease",
                                zIndex: 10
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.opacity = "0.7"
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.opacity = "1"
                            }}
                        >
                            <FontAwesomeIcon icon={faX} />
                        </button>
                        <Tiptap />
                    </div>
                </div>


            </VerticalDiv>
        </NewPage>
    )
}