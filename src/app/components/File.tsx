"use client"
import {useState, useEffect} from "react"
import type { File } from "./ctx.fileManager"
import {FileType} from "./TypeTags"




export const FileItem = ({file} : {file : File}) => {

    const [onEnter, SetOnEnter] = useState({width : "100%"})

    const [onMouseOver, setMouseOver] = useState(false);


    useEffect(()=>{
        SetOnEnter({width : "0%"})
    }, [])

    return (<div>
        <div className={"row"} style={{ paddingTop: "2rem", paddingBottom: "2rem"}} onMouseEnter={()=>{setMouseOver(true)}} onMouseLeave={()=>{setMouseOver(false)}}>
                    <div><input type={"checkbox"} /></div>
                    <div style={{overflow: "hidden", textWrap:"nowrap", textOverflow: "ellipsis"}}>{file.id}</div>
                    <div style={{overflow: "hidden", textWrap:"nowrap", textOverflow: "ellipsis"}}>{file.createdAt.toString()}</div>
                    <div style={{overflow: "hidden", textWrap:"nowrap", textOverflow: "ellipsis"}}>{FileType(file.type)}</div>
                    <div style={{overflow: "hidden", textWrap:"nowrap", textOverflow: "ellipsis"}}>{file.creator_email}</div>
                    <div style={{overflow: "hidden", textWrap:"nowrap", textOverflow: "ellipsis"}}>{file.name}</div>
                    <div style={{position : "absolute", right: "0", height : "100%", ...onEnter, backgroundColor : "var(--background)", transition : "width 0.3s ease-in"}}></div>
                    <div style={{ position : "absolute", top : "50%", left : "50%", transform : "translate(-50%, -50%)", width: "calc(100% - 2rem)", ...(onMouseOver ? {backgroundColor : "var(--foreground)", height : "2.5rem"} : null)}}   ></div>      
                <div style={{position : "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "100%", backdropFilter: "blur(7px) brightness(1.1)"}}>
                    <div className={"row"} style={{
                
                ...(onMouseOver ? { color: "var(--background)"} : null), paddingTop: "2rem", paddingBottom: "2rem"

                    }}>
                        <div><input type={"checkbox"} /></div>
                        <div style={{overflow: "hidden", textWrap:"nowrap", textOverflow: "ellipsis"}}>{file.id}</div>
                        <div style={{overflow: "hidden", textWrap:"nowrap", textOverflow: "ellipsis"}}>{file.createdAt.toString()}</div>
                        <div style={{overflow: "hidden", textWrap:"nowrap", textOverflow: "ellipsis"}}>{FileType(file.type)}</div>
                        <div style={{overflow: "hidden", textWrap:"nowrap", textOverflow: "ellipsis"}}>{file.creator_email}</div>
                        <div style={{overflow: "hidden", textWrap:"nowrap", textOverflow: "ellipsis"}}>{file.name}</div>
                        <div style={{position : "absolute", right: "0", height : "100%", ...onEnter, backgroundColor : "var(--background)", transition : "width 0.3s ease-in"}}>

                        </div>
                        {/* <div style={{
                            position : "absolute", top : "50%", left : "0", transform : "translateY(-50%)", width: "100%",
                            ...(onMouseOver ? {backgroundColor : "var(--foreground)", height : "2rem"} : null)
                        }} /> */}
                    </div>
                </div>
            </div>
                
                
                </div>)

}