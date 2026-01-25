"use client"
import {useState, useEffect, useRef} from "react"
import type { File } from "../State Manager/appManager"
import { useFileStore } from "../State Manager/appManager"
import {FileType} from "../TypeTags"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEye } from "@fortawesome/free-solid-svg-icons"




export const FileItem = ({file} : {file : File}) => {

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

    const SelectFile = useFileStore((state)=>state.SelectFile);

    const checkboxRef = useRef<HTMLInputElement>(null)

    const SetPreviewFile = useFileStore((state) => state.SetPreviewedFile);
    const previewedFile = useFileStore((state) => state.previewedFile);

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

    return (
        <div>
            <div className={"row"}>
                <div>
                    <input type={"checkbox"} ref={checkboxRef} onClick={()=>{
                        if(checkboxRef?.current){
                            const state = checkboxRef.current.checked
                            SelectFile(file.id, state)
                        }
                    }}/>
                </div>
                <div className={"column"}>{file.id}</div>
                <div className={"column"}>{new Date(file.createdAt).toISOString()}</div>
                <div className={"column"}>{FileType(file.type, layoutState==0 || viewportWidth < 768)}</div>
                <div className={"column"}>{file.creator_email}</div>
                <div className={"column"}>{file.name}</div>
                <div>
                    <button 
                        onClick={()=>{ 
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
                            transition: "opacity 0.2s ease",
                            borderRadius: "var(--theme-border-radius)"
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.opacity = "0.7"
                            e.currentTarget.style.backgroundColor = "var(--theme-bg-tertiary)"
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.opacity = "1"
                            e.currentTarget.style.backgroundColor = "transparent"
                        }}
                    >
                        <FontAwesomeIcon icon={faEye} />
                    </button>
                </div>
                <div style={{position : "absolute", right: "0", height : "100%", ...onEnter, backgroundColor : "var(--background)", transition : "width 0.5s ease-in-out 0.2s"}}></div>     
            </div>      
        </div>
    )

}