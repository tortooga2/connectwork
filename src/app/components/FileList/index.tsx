"use client"
import { useEffect, useMemo, useRef, useCallback, useState } from "react"
import { useFileStore } from "../State Manager/appManager"
import { VerticalDiv } from "../UILayout"
import { FileItem } from "@/app/components/FileItem"
import { Search, X, Filter, ChevronUp, ChevronDown } from "lucide-react"
import Box from "@mui/material/Box"
import LinearProgress from "@mui/material/LinearProgress"
import { getFileType, getDisplayFileName } from "@/lib/client/getFileType"

const FILE_TYPE_OPTIONS = [
    { label: "linq",      value: "Bundle"    },
    { label: "Document",  value: "Document"  },
    { label: "Note",      value: "Note"      },
    { label: "Recording", value: "Recording" },
    { label: "Image",     value: "Image"     },
]

const TIME_OPTIONS = [
    { label: "Today",      value: "today"  },
    { label: "This Week",  value: "week"   },
    { label: "This Month", value: "month"  },
    { label: "This Year",  value: "year"   },
]

const SEARCH_SUMMARY_CAP = 5

function getTimeStart(option: string): Date {
    const now = new Date()
    switch (option) {
        case "today": {
            const d = new Date(now); d.setHours(0, 0, 0, 0); return d
        }
        case "week": {
            const d = new Date(now)
            d.setDate(d.getDate() - d.getDay())
            d.setHours(0, 0, 0, 0)
            return d
        }
        case "month": {
            return new Date(now.getFullYear(), now.getMonth(), 1)
        }
        case "year": {
            return new Date(now.getFullYear(), 0, 1)
        }
        default:
            return new Date(0)
    }
}

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
    const SetPreviewedFile = useFileStore((state) => state.SetPreviewedFile)
    const SetLayoutState = useFileStore((state) => state.SetLayoutState)

    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    /** Bumps on every search input change so in-flight fetches can be ignored. */
    const searchGenRef = useRef(0)
    const filterRef = useRef<HTMLDivElement>(null)
    /** Last row clicked without Shift — anchor for shift+click range selection */
    const selectionAnchorRef = useRef<string | null>(null)

    // sort & filter state (local to this component)
    // asc = oldest at top → newest at bottom (ChevronDown active); desc = newest at top (ChevronUp active)
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
    const [filterTypes, setFilterTypes] = useState<Set<string>>(new Set())
    const [filterTime, setFilterTime] = useState<string | null>(null)
    const [filterOpen, setFilterOpen] = useState(false)
    const [searchSummaryExpanded, setSearchSummaryExpanded] = useState(false)

    const hasActiveFilters = filterTypes.size > 0 || filterTime !== null

    // close dropdown when clicking outside
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
                setFilterOpen(false)
            }
        }
        document.addEventListener("mousedown", handler)
        return () => document.removeEventListener("mousedown", handler)
    }, [])

    useEffect(() => {
        setSearchSummaryExpanded(false)
    }, [searchQuery, searchResults])

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
            const g = searchGenRef.current
            const q = query.trim()
            useFileStore.setState({ searchLoading: true })
            try {
                const res = await fetch(`/api/files/search?q=${encodeURIComponent(q)}`)
                const { data } = await res.json()
                if (g !== searchGenRef.current) return
                const current = useFileStore.getState().searchQuery.trim()
                if (current !== q) return
                SetSearchResults(data)
            } catch {
                if (g !== searchGenRef.current) return
                const current = useFileStore.getState().searchQuery.trim()
                if (current !== q) return
                SetSearchResults(null)
            } finally {
                if (g === searchGenRef.current) {
                    useFileStore.setState({ searchLoading: false })
                }
            }
        }, 400)
    }, [SetSearchResults])

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value
        searchGenRef.current += 1
        SetSearchQuery(val)
        if (val.trim()) {
            SetSearchResults(null)
            useFileStore.setState({ searchLoading: false })
        }
        runSearch(val)
    }

    const clearSearch = () => {
        SetSearchQuery("")
        SetSearchResults(null)
    }

    const toggleType = (value: string) => {
        setFilterTypes(prev => {
            const next = new Set(prev)
            if (next.has(value)) next.delete(value)
            else next.add(value)
            return next
        })
    }

    const clearFilters = () => {
        setFilterTypes(new Set())
        setFilterTime(null)
    }

    const sortedFiles = useMemo(() => {
        return Array.from(files.values()).sort((a, b) => {
            const dateA = new Date(a.createdAt).getTime()
            const dateB = new Date(b.createdAt).getTime()
            return sortOrder === "asc" ? dateA - dateB : dateB - dateA
        })
    }, [files, sortOrder])

    const isSearchActive = searchQuery.trim().length > 0

    // base list: search results or all sorted files (null results while query is changing = show nothing, not stale rows)
    const baseFiles = useMemo(() => {
        if (!isSearchActive) return sortedFiles
        if (searchResults === null) return []
        const fromSearch = searchResults.map((r) => r.file)
        return [...fromSearch].sort((a, b) => {
            const dateA = new Date(a.createdAt).getTime()
            const dateB = new Date(b.createdAt).getTime()
            return sortOrder === "asc" ? dateA - dateB : dateB - dateA
        })
    }, [isSearchActive, searchResults, sortedFiles, sortOrder])

    // apply type + time filters on top of base list
    const displayFiles = useMemo(() => {
        let result = baseFiles
        if (filterTypes.size > 0) {
            result = result.filter(f => filterTypes.has(getFileType(f.type)))
        }
        if (filterTime) {
            const cutoff = getTimeStart(filterTime).getTime()
            result = result.filter(f => new Date(f.createdAt).getTime() >= cutoff)
        }
        return result
    }, [baseFiles, filterTypes, filterTime])

    const searchSummaryRows = useMemo(() => {
        if (!searchResults?.length) return []
        if (searchSummaryExpanded || searchResults.length <= SEARCH_SUMMARY_CAP) return searchResults
        return searchResults.slice(0, SEARCH_SUMMARY_CAP)
    }, [searchResults, searchSummaryExpanded])

    const searchSummaryHasMore = (searchResults?.length ?? 0) > SEARCH_SUMMARY_CAP
    const searchSummaryHiddenCount =
        searchResults && searchResults.length > SEARCH_SUMMARY_CAP
            ? searchResults.length - SEARCH_SUMMARY_CAP
            : 0

    const handleListCheckboxChange = useCallback(
        (payload: { fileId: string; rowIndex: number; shiftKey: boolean; checked: boolean }) => {
            const { fileId, rowIndex, shiftKey, checked } = payload
            const { SelectFile, SetSelectionForIds } = useFileStore.getState()

            if (shiftKey && selectionAnchorRef.current !== null) {
                const anchorId = selectionAnchorRef.current
                const anchorIndex = displayFiles.findIndex((f) => f.id === anchorId)
                if (anchorIndex === -1) {
                    SelectFile(fileId, checked)
                    selectionAnchorRef.current = fileId
                    return
                }
                const lo = Math.min(anchorIndex, rowIndex)
                const hi = Math.max(anchorIndex, rowIndex)
                const ids = displayFiles.slice(lo, hi + 1).map((f) => f.id)
                SetSelectionForIds(ids, checked)
            } else {
                SelectFile(fileId, checked)
                selectionAnchorRef.current = fileId
            }
        },
        [displayFiles]
    )

    return(
        <VerticalDiv
            style={{
                borderRadius: "var(--border-rad)",
                padding: "1rem",
                overscrollBehaviorY: "none",
                scrollbarGutter: "stable",
            }}
            color="var(--accent-color)"
            padding="0rem"
            gap="0.5rem"
        >

            {/* search bar + filter button row */}
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
                        border: "none",
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

                {/* filter button */}
                <div ref={filterRef} style={{ position: "relative" }}>
                    <button
                        type="button"
                        aria-label={filterOpen ? "Close filters" : "Open filters"}
                        aria-expanded={filterOpen}
                        onClick={() => setFilterOpen(v => !v)}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "0.25rem",
                            padding: "0.25rem",
                            border: "none",
                            background: "transparent",
                            color: hasActiveFilters ? "var(--bundle-color-2)" : "var(--foreground)",
                            cursor: "pointer",
                            outline: "none",
                        }}
                    >
                        <Filter size={18} strokeWidth={2} aria-hidden />
                        {hasActiveFilters && (
                            <span style={{
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: "16px",
                                height: "16px",
                                borderRadius: "50%",
                                background: "var(--bundle-color-2)",
                                color: "var(--background)",
                                fontSize: "0.65rem",
                                fontWeight: "bold",
                            }}>
                                {filterTypes.size + (filterTime ? 1 : 0)}
                            </span>
                        )}
                    </button>

                    {filterOpen && (
                        <div style={{
                            position: "absolute",
                            top: "calc(100% + 0.4rem)",
                            right: 0,
                            zIndex: 500,
                            background: "var(--accent-color)",
                            border: "1px solid var(--foreground)",
                            borderRadius: "var(--border-rad)",
                            padding: "0.75rem",
                            minWidth: "180px",
                            display: "flex",
                            flexDirection: "column",
                            gap: "0.6rem",
                        }}>
                            {/* type filters */}
                            <div style={{ fontSize: "0.75rem", opacity: 0.55, fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.05em" }}>File Type</div>
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                                {FILE_TYPE_OPTIONS.map(opt => (
                                    <label key={opt.value} style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", fontSize: "0.9rem" }}>
                                        <input
                                            type="checkbox"
                                            checked={filterTypes.has(opt.value)}
                                            onChange={() => toggleType(opt.value)}
                                            style={{ accentColor: "var(--bundle-color-2)", cursor: "pointer" }}
                                        />
                                        {opt.label}
                                    </label>
                                ))}
                            </div>

                            <div style={{ height: "1px", background: "rgba(255,255,255,0.12)" }} />

                            {/* time filters */}
                            <div style={{ fontSize: "0.75rem", opacity: 0.55, fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.05em" }}>Time Range</div>
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                                {TIME_OPTIONS.map(opt => (
                                    <label key={opt.value} style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", fontSize: "0.9rem" }}>
                                        <input
                                            type="radio"
                                            name="filter-time"
                                            checked={filterTime === opt.value}
                                            onChange={() => setFilterTime(filterTime === opt.value ? null : opt.value)}
                                            onClick={() => { if (filterTime === opt.value) setFilterTime(null) }}
                                            style={{ accentColor: "var(--bundle-color-2)", cursor: "pointer" }}
                                        />
                                        {opt.label}
                                    </label>
                                ))}
                            </div>

                            {hasActiveFilters && (
                                <>
                                    <div style={{ height: "1px", background: "rgba(255,255,255,0.12)" }} />
                                    <button
                                        onClick={clearFilters}
                                        style={{
                                            background: "transparent",
                                            border: "1px solid var(--foreground)",
                                            color: "var(--foreground)",
                                            borderRadius: "var(--border-rad)",
                                            padding: "0.3rem 0.5rem",
                                            cursor: "pointer",
                                            fontSize: "0.8rem",
                                            opacity: 0.7,
                                        }}
                                    >
                                        Clear filters
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* search status */}
            {searchLoading && <span className="filelist-search-meta">Searching…</span>}
            {isSearchActive && searchResults && searchResults.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem", marginBottom: "0.4rem" }}>
                    {searchSummaryRows.map((r) => {
                        const displayName = getDisplayFileName(r.file.name, r.file.type)
                        return (
                            <div
                                key={`${r.file.id}-${r.matchedIn}-${r.matchedChildName ?? ""}-${r.snippet ?? ""}`}
                                className="filelist-search-hit-row"
                            >
                                <span className="filelist-search-hit-query">
                                    &quot;{searchQuery.trim()}&quot; in{" "}
                                </span>
                                <button
                                    type="button"
                                    className="filelist-search-hit-name"
                                    onClick={() => {
                                        SetPreviewedFile(r.file)
                                        SetLayoutState(1)
                                    }}
                                    aria-label={`Open preview for ${displayName ?? "file"}`}
                                >
                                    {displayName}
                                </button>
                            </div>
                        )
                    })}
                    {searchSummaryHasMore && (
                        <button
                            type="button"
                            className="filelist-search-more"
                            onClick={() => setSearchSummaryExpanded((v) => !v)}
                            aria-label={
                                searchSummaryExpanded
                                    ? "Show fewer search results"
                                    : `Show ${searchSummaryHiddenCount} more search results`
                            }
                        >
                            {searchSummaryExpanded ? "see less" : `see ${searchSummaryHiddenCount} more`}
                        </button>
                    )}
                </div>
            )}

            {/* empty search state */}
            {isSearchActive && searchResults && searchResults.length === 0 && !searchLoading && (
                <div className="filelist-search-meta" style={{ padding: "0.25rem 0" }}>
                    No matches for &quot;{searchQuery.trim()}&quot;.
                </div>
            )}

            {/* active filter summary */}
            {hasActiveFilters && !filterOpen && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem", alignItems: "center" }}>
                    {Array.from(filterTypes).map(t => (
                        <span key={t} style={{
                            display: "inline-flex", alignItems: "center", gap: "0.25rem",
                            fontSize: "0.75rem", padding: "0.15rem 0.45rem",
                            borderRadius: "999px", background: "rgba(255,255,255,0.1)",
                            border: "1px solid var(--bundle-color-2)",
                            color: "var(--bundle-color-2)",
                        }}>
                            {FILE_TYPE_OPTIONS.find(o => o.value === t)?.label ?? t}
                            <button onClick={() => toggleType(t)} style={{ background: "none", border: "none", color: "inherit", cursor: "pointer", padding: 0, lineHeight: 1, display: "flex" }}><X size={10} /></button>
                        </span>
                    ))}
                    {filterTime && (
                        <span style={{
                            display: "inline-flex", alignItems: "center", gap: "0.25rem",
                            fontSize: "0.75rem", padding: "0.15rem 0.45rem",
                            borderRadius: "999px", background: "rgba(255,255,255,0.1)",
                            border: "1px solid var(--bundle-color-2)",
                            color: "var(--bundle-color-2)",
                        }}>
                            {TIME_OPTIONS.find(o => o.value === filterTime)?.label}
                            <button onClick={() => setFilterTime(null)} style={{ background: "none", border: "none", color: "inherit", cursor: "pointer", padding: 0, lineHeight: 1, display: "flex" }}><X size={10} /></button>
                        </span>
                    )}
                </div>
            )}

            <div className={"row header"}>
                <div className={"column header"}></div>
                <div className={"column header"}>View:</div>
                <div
                    className={"column header"}
                    onClick={() => setSortOrder(o => o === "desc" ? "asc" : "desc")}
                    style={{ cursor: "pointer", userSelect: "none", display: "flex", alignItems: "center", gap: "0.25rem" }}
                >
                    When:
                    <span style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
                        <ChevronUp
                            size={11}
                            aria-hidden
                            style={{
                                marginBottom: "-2px",
                                color: sortOrder === "desc" ? "var(--bundle-color-2)" : "var(--foreground)",
                                opacity: sortOrder === "desc" ? 1 : 0.55,
                            }}
                        />
                        <ChevronDown
                            size={11}
                            aria-hidden
                            style={{
                                color: sortOrder === "asc" ? "var(--bundle-color-2)" : "var(--foreground)",
                                opacity: sortOrder === "asc" ? 1 : 0.55,
                            }}
                        />
                    </span>
                </div>
                <div className={"column header"} style={{ display : "flex", flex : "row"}}><div className={layout == 0 ? "spacer" : "spacer small"}/><span>Type:</span></div>
                <div className={"column header"}>Who:</div>
                <div className={"column header"}>What:</div>
            </div>

            <VerticalDiv style={{gap: "0.25rem"}} padding="0rem">
                {displayFiles.map((file, rowIndex) => (
                    <FileItem
                        key={file.id}
                        file={file}
                        rowIndex={rowIndex}
                        onCheckboxChange={handleListCheckboxChange}
                    />
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
