"use client"
import {useState, useEffect, useRef} from "react"
import type { File } from "../State Manager/appManager"
import { useFileStore } from "../State Manager/appManager"
import {FileType} from "../TypeTags"
import { Eye, SquareArrowOutUpRight } from "lucide-react"



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

    const displayName = file.name === "Bundle" ? "linq" : file.name

    return (
        <div>
            <div className={"row"}>
                <div className={"select-column"}>
                    <input type={"checkbox"} ref={checkboxRef} onClick={()=>{
                        if(checkboxRef?.current){
                            const state = checkboxRef.current.checked
                            SelectFile(file.id, state)
                        }
                    }}/>
                </div>
                <div className={"column"}><div className={"url"} onClick={() => window.open(`http://${window.location.host}/preview/${file.id}`, "_blank")}>{<a>{file.id.split("-").slice(-1)[0]}</a>}<SquareArrowOutUpRight size={12}/></div></div>
                <div className={"column"}>{new Date(file.createdAt).toLocaleString()}</div>
                <div className={"column"}>{FileType(file.type, layoutState==0 || viewportWidth < 768, true)}</div>
                <div className={"column"}>{file.creator_email}</div>
                <div className={"column"}>{displayName}</div>
                <div className={"view-button"}>
                    <button onClick={()=>{ SetPreviewFile(file); SetLayoutState(1); }}><Eye size={16}/></button>
                </div>
                <div style={{position : "absolute", right: "0", height : "100%", ...onEnter, backgroundColor : "var(--background)", borderRadius: "var(--border-rad)", transition : "width 0.5s ease-in-out 0.2s"}}></div>     
            </div>      
        </div>
    )

}