"use client"
import { useEffect, useMemo, useRef, useCallback } from "react"
import { useFileStore } from "../State Manager/appManager"
import { VerticalDiv } from "../UILayout"
import { FileItem } from "@/app/components/FileItem"
import { Search, X } from "lucide-react"
import Box from "@mui/material/Box"
import LinearProgress from "@mui/material/LinearProgress"

export const FilesList = () => {
    const files = useFileStore((state)=>state.files)
    const SetFiles = useFileStore((state)=>state.SetFiles)
    const layout = useFileStore((state)=>state.layoutState)

    const searchQuery = useFileStore((state)=>state.searchQuery)
    const SetSearchQuery = useFileStore((state)=>state.SetSearchQuery)
    const searchResults = useFileStore((state)=>state.searchResults)
    const SetSearchResults = useFileStore((state)=>state.SetSearchResults)
    const searchLoading = useFileStore((state)=>state.searchLoading)
    const actionLoading = useFileStore((state)=>state.actionLoading)
    const actionLabel = useFileStore((state)=>state.actionLabel)

    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    useEffect(()=>{
        const getFiles = async () => {
            const response = await fetch("/api/files/")
            const {data} = await response.json()
            SetFiles(data)
            console.log(data)
        }

        getFiles()
    }, [SetFiles])

    // debounced search — waits 400ms after user stops typing
    const runSearch = useCallback((query: string) => {
        if (debounceRef.current) clearTimeout(debounceRef.current)

        if (!query.trim()) {
            SetSearchResults(null)
            return
        }

        debounceRef.current = setTimeout(async () => {
            useFileStore.setState({ searchLoading: true })
            try {
                const res = await fetch(`/api/files/search?q=${encodeURIComponent(query)}`)
                const { data } = await res.json()
                SetSearchResults(data)
            } catch {
                SetSearchResults(null)
            } finally {
                useFileStore.setState({ searchLoading: false })
            }
        }, 400)
    }, [SetSearchResults])

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value
        SetSearchQuery(val)
        runSearch(val)
    }

    const clearSearch = () => {
        SetSearchQuery("")
        SetSearchResults(null)
    }

    const sortedFiles = useMemo(() => {
        return Array.from(files.values()).sort((a, b) => {
            const dateA = new Date(a.createdAt).getTime()
            const dateB = new Date(b.createdAt).getTime()
            return dateB - dateA
        })
    }, [files])

    const isSearchActive = searchQuery.trim().length > 0

    // when searching, show matched files; otherwise show all
    const displayFiles = useMemo(() => {
        if (isSearchActive && searchResults) {
            return searchResults.map(r => r.file)
        }
        return sortedFiles
    }, [isSearchActive, searchResults, sortedFiles])

    return(
        <VerticalDiv style={{borderRadius : "var(--border-rad)", padding : "1rem"}} color="var(--accent-color)" padding="0rem" gap="0.5rem">

            {/* search bar */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.25rem 0" }}>
                <Search size={16} style={{ opacity: 0.5 }} />
                <input
                    type="text"
                    placeholder="Search files..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    style={{
                        flex: 1,
                        padding: "0.4rem 0.5rem",
                        border: "1px solid var(--foreground)",
                        borderRadius: "var(--border-rad)",
                        background: "rgba(255, 255, 255, 0.08)",
                        color: "var(--foreground)",
                        fontSize: "0.9rem",
                        outline: "none",
                    }}
                />
                {searchQuery && (
                    <button onClick={clearSearch} style={{ background: "transparent", border: "none", color: "var(--foreground)", cursor: "pointer", display: "flex", alignItems: "center" }}>
                        <X size={16} />
                    </button>
                )}
            </div>

            {/* search status */}
            {searchLoading && <span style={{ fontSize: "0.8rem", opacity: 0.6 }}>Searching...</span>}
            {isSearchActive && searchResults && !searchLoading && (
                <span style={{ fontSize: "0.8rem", opacity: 0.6 }}>
                    {searchResults.length} result{searchResults.length !== 1 ? "s" : ""} for &quot;{searchQuery}&quot;
                </span>
            )}

            {/* snippet badges for search results */}
            {isSearchActive && searchResults && searchResults.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem", marginBottom: "0.25rem" }}>
                    {searchResults.map((r) => (
                        <div key={r.file.id} style={{ fontSize: "0.75rem", opacity: 0.7, padding: "0.2rem 0.4rem", background: "rgba(255,255,255,0.05)", borderRadius: "4px" }}>
                            <strong>{r.file.name}</strong>
                            <span style={{ marginLeft: "0.5rem", fontStyle: "italic" }}>
                                matched in {r.matchedIn}
                                {r.matchedChildName ? ` (${r.matchedChildName})` : ""}
                            </span>
                            {r.snippet && r.matchedIn !== "name" && (
                                <span style={{ marginLeft: "0.5rem", opacity: 0.8 }}>&quot;{r.snippet}&quot;</span>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* empty search state */}
            {isSearchActive && searchResults && searchResults.length === 0 && !searchLoading && (
                <div style={{ fontSize: "0.85rem", opacity: 0.7, padding: "0.5rem 0.25rem" }}>
                    No matches found for &quot;{searchQuery}&quot;.
                </div>
            )}

            <div className={"row header"}>
                <div className={"column header"}></div>
                <div className={"column header"}>ID:</div>
                <div className={"column header"}>Created At:</div>
                <div className={"column header"} style={{ display : "flex", flex : "row"}}><div className={layout == 0 ? "spacer" : "spacer small"}/><span>Type:</span></div>
                <div className={"column header"}>Creator:</div>
                <div className={"column header"}>Name:</div>
                <div className={"column header"}></div>
            </div>

            <VerticalDiv style={{gap: "0.25rem"}} padding="0rem">
                {displayFiles.map((file) => (
                    <FileItem key={file.id} file={file} />
                ))}
            </VerticalDiv>
            {actionLoading && (
                <div style={{ width: "100%", marginTop: "0.25rem" }}>
                    <Box sx={{ width: "100%" }}>
                        <LinearProgress
                            sx={{
                                height: 4,
                                borderRadius: 0,
                                backgroundColor: "rgba(255,255,255,0.08)",
                                "& .MuiLinearProgress-bar": {
                                    backgroundColor: "var(--bundle-color-2)",
                                },
                            }}
                        />
                    </Box>
                    {actionLabel && (
                        <span style={{ fontSize: "0.75rem", opacity: 0.75 }}>{actionLabel}</span>
                    )}
                </div>
            )}
        </VerticalDiv>
    )
}