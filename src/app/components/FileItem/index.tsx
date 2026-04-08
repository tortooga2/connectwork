"use client"
import {useState, useEffect, useRef} from "react"
import type { File } from "../State Manager/appManager"
import { useFileStore } from "../State Manager/appManager"
import {FileType} from "../TypeTags"
import { getDisplayFileName } from "@/lib/client/getFileType"
import { SquareArrowOutUpRight } from "lucide-react"



export type FileItemCheckboxPayload = {
    fileId: string
    rowIndex: number
    shiftKey: boolean
    checked: boolean
}

export const FileItem = ({
    file,
    rowIndex,
    onCheckboxChange,
}: {
    file: File
    rowIndex: number
    onCheckboxChange: (payload: FileItemCheckboxPayload) => void
}) => {

    const [onEnter, SetOnEnter] = useState({width : "100%"})
    const [viewportWidth, setViewportWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0)

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

    const checkboxRef = useRef<HTMLInputElement>(null)

    const SetPreviewFile = useFileStore((state) => state.SetPreviewedFile);

    const SetLayoutState = useFileStore((state)=>state.SetLayoutState);
    const layoutState = useFileStore((state)=> state.layoutState);


    useEffect(()=>{
        if(checkboxRef?.current){
            checkboxRef.current.checked = isSelected;
        }

    }, [isSelected])


    useEffect(()=>{
        SetOnEnter({width : "0%"})
    }, [])

    const displayName = getDisplayFileName(file.name, file.type)

    const openSidePreview = () => {
        SetPreviewFile(file)
        SetLayoutState(1)
    }

    return (
        <div>
            <div className={`row${isSelected ? " row-selected" : ""}`} onClick={openSidePreview}>
                <label className={"select-column"} onClick={(e) => e.stopPropagation()}>
                    <input
                        type={"checkbox"}
                        ref={checkboxRef}
                        onChange={(e) => {
                            e.stopPropagation()
                            const ne = e.nativeEvent as MouseEvent
                            onCheckboxChange({
                                fileId: file.id,
                                rowIndex,
                                shiftKey: Boolean(ne.shiftKey),
                                checked: e.target.checked,
                            })
                        }}
                    />
                </label>
                <div className={"column"}>
                    <div
                        className={"url"}
                        title="Open In New Tab"
                        onClick={(e) => {
                            e.stopPropagation()
                            window.open(`http://${window.location.host}/preview/${file.id}`, "_blank")
                        }}
                    >
                        <span>Open In New Tab</span>
                        <SquareArrowOutUpRight size={12}/>
                    </div>
                </div>
                <div className={"column"}>{new Date(file.createdAt).toLocaleString()}</div>
                <div className={"column"}>{FileType(file.type, layoutState==0 || viewportWidth < 768, true)}</div>
                <div className={"column"}>{file.creator_email}</div>
                <div className={"column"}>{displayName}</div>
                <div
                    style={{
                        position: "absolute",
                        right: "0",
                        height: "100%",
                        ...onEnter,
                        backgroundColor: "var(--background)",
                        borderRadius: "var(--border-rad)",
                        transition: "width 0.5s ease-in-out 0.2s",
                        pointerEvents: "none",
                    }}
                    aria-hidden
                />
            </div>      
        </div>
    )

}