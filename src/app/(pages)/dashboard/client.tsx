"use client"
import { NewPage, VerticalDiv, HorizontalDiv } from "@/app/components/UILayout"
import { useUser } from "@clerk/nextjs"
import { FilesList } from "@/app/components/FileList"
import { useFileStore } from "@/app/components/State Manager/appManager"
import { Preview } from "@/app/components/Preview"
import Tiptap from "@/app/components/TextEditor"
import { FileType } from "@/app/components/TypeTags"
import { getFileType } from "@/lib/client/getFileType"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faX, faFile, faPaperclip } from "@fortawesome/free-solid-svg-icons"
import { useRef } from "react"
import { DeleteButton } from "@/app/components/DeleteButton"

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
                onClick={() => fileInputRef.current?.click()}
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "0.75rem 1.5rem",
                    border: "var(--theme-border-width) solid var(--theme-btn-primary-border)",
                    borderRadius: "var(--theme-border-radius)",
                    backgroundColor: "var(--theme-btn-primary-bg)",
                    color: "var(--theme-btn-primary-text)",
                    cursor: "pointer",
                    fontSize: "1rem",
                    transition: "all 0.2s ease"
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "var(--theme-btn-primary-hover-bg)"
                    e.currentTarget.style.color = "var(--theme-btn-primary-hover-text)"
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "var(--theme-btn-primary-bg)"
                    e.currentTarget.style.color = "var(--theme-btn-primary-text)"
                }}
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
    const layoutState = useFileStore((state) => state.layoutState)
    const setLayoutState = useFileStore((state) => state.SetLayoutState)
    const previewedFile = useFileStore((state) => state.previewedFile)
    const SetLayoutState = useFileStore((state) => state.SetLayoutState)

    const userEmail = user?.primaryEmailAddress?.emailAddress || user?.emailAddresses?.[0]?.emailAddress || ""

    return (
        <NewPage>
            <VerticalDiv style={{ position: "relative", height: "100vh" }}>
                {/* Header - Top Left: Linquiq and Email */}
                <div style={{
                    position: "absolute",
                    top: "1rem",
                    left: "1rem",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    gap: "0.25rem",
                    zIndex: 1000
                }}>
                    <h1 style={{ fontSize: "1.5rem", fontWeight: "bold", margin: 0, color: "var(--theme-btn-linq-text)" }}>Linquiq</h1>
                    <span style={{ fontSize: "0.875rem", opacity: 0.8 }}>{userEmail}</span>
                </div>

                {/* Top Action Buttons - New Note and Upload File */}
                <div style={{
                    position: "absolute",
                    top: "1rem",
                    right: "1rem",
                    display: "flex",
                    gap: "1rem",
                    zIndex: 1000
                }}>
                    <button
                        onClick={() => {
                            setLayoutState(2)
                        }}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            padding: "0.75rem 1.5rem",
                            border: "var(--theme-border-width) solid var(--theme-btn-primary-border)",
                            borderRadius: "var(--theme-border-radius)",
                            backgroundColor: "var(--theme-btn-primary-bg)",
                            color: "var(--theme-btn-primary-text)",
                            cursor: "pointer",
                            fontSize: "1rem",
                            transition: "all 0.2s ease"
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "var(--theme-btn-primary-hover-bg)"
                            e.currentTarget.style.color = "var(--theme-btn-primary-hover-text)"
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "var(--theme-btn-primary-bg)"
                            e.currentTarget.style.color = "var(--theme-btn-primary-text)"
                        }}
                    >
                        <FontAwesomeIcon icon={faFile} />
                        New Note
                    </button>
                    <UploadButton />
                    <DeleteButton />
                </div>

                <HorizontalDiv color="var(--theme-bg-primary)" style={{ position: "absolute", top: "4rem", left: "1rem", right: "1rem", bottom: "1rem", padding: "1rem", border: "none", borderRadius: "var(--theme-border-radius)", zIndex: "1", transition: "width 0.2s ease-out, left 0.2s ease-out, right 0.2s ease-out" }} layouts={[
                    {
                        left: 0,
                        width: "100%",
                    },
                    {
                        left: 0,
                        width: "60%",
                    },
                    {
                        left: "40%",
                        width: "60%",
                    }
                ]}
                    state={layoutState}
                >

                    <FilesList />

                </HorizontalDiv>

                {/* Preview Panel - Right Side */}
                {layoutState === 1 && (
                    <VerticalDiv style={{ position: "absolute", right: "1rem", top: "5rem", bottom: "1rem", width: "calc(40% - 1rem)", height: "calc(100% - 5rem)" }} padding="0rem">
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
                                <span><span style={{ fontWeight: "bold" }}>ID:</span> {previewedFile?.id}</span>
                                <span><span style={{ fontWeight: "bold" }}>Created:</span> {previewedFile?.createdAt ? new Date(previewedFile.createdAt).toISOString() : ""}</span>
                                <span><span style={{ fontWeight: "bold" }}>Creator:</span> {previewedFile?.creator_email}</span>
                            </div>
                            <div style={{ flex: 1, overflow: "auto" }}>
                                <Preview />
                            </div>
                        </div>
                    </VerticalDiv>
                )}

                {/* Note Editor Panel - Left Side */}
                {layoutState === 2 && (
                    <VerticalDiv style={{ position: "absolute", left: "1rem", top: "5rem", bottom: "1rem", width: "calc(40% - 1rem)", backgroundColor: "var(--theme-bg-secondary)", borderRadius: "var(--theme-border-radius)", border: "none", padding: "1rem" }}>
                        <div style={{ position: "relative", flex: 1, overflow: "auto" }}>
                            <button
                                onClick={() => {
                                    setLayoutState(0)
                                }}
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
                    </VerticalDiv>
                )}


            </VerticalDiv>
        </NewPage>
    )
}