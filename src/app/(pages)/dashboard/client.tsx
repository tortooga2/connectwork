"use client"
import { useState } from "react"
import { NewPage, VerticalDiv, HorizontalDiv } from "@/app/components/UILayout"
import { UserButton } from "@clerk/nextjs"
import { FilesList } from "@/app/components/FileList"
import { useFileStore } from "@/app/components/State Manager/appManager"
import { Preview } from "@/app/components/Preview"
import { LinqButton } from "@/app/components/LinqButton"
import UploadArea from "@/app/components/Uploads/UploadArea"
import { TextEditor } from "@/app/components/TextEditor"
import { FileType } from "@/app/components/TypeTags"
import { DeleteButton } from "@/app/components/DeleteButton"
import { PencilLine, Upload, X } from "lucide-react"


export const Dashboard = ({}) => {
    const layoutState = useFileStore((state)=>state.layoutState)
    const setLayoutState = useFileStore((state)=>state.SetLayoutState)
    const previewedFile = useFileStore((state)=>state.previewedFile)
    const SetLayoutState = useFileStore((state)=>state.SetLayoutState)
    const [uploadPopupOpen, setUploadPopupOpen] = useState(false)

    const heightOfDock = "6.5%";
    const heightOfTopBar = "3%";
    return (       
        <NewPage>    
            <VerticalDiv style={{position : "relative", borderWidth: "0px", borderColor: "transparent"}} padding="1rem">
                    
                    <VerticalDiv padding="1rem" gap="0rem">
                        <div style={{height: heightOfTopBar, minHeight: `calc(${heightOfTopBar} + 1rem)`, width : "100%", padding: "0rem 2rem", marginBottom: "1rem", display : "flex", alignItems : "center", justifyContent : "space-between", boxSizing : "border-box", zIndex : "2"}}>
                            <h1 style={{fontSize : "2rem", color: "var(--bundle-color-2)", margin: 0}}>Linquiq</h1>
                            <UserButton/>
                                
                        </div>
                            
                        <VerticalDiv padding="0rem">    
                            <HorizontalDiv style={{position: "relative", height: `100%`, zIndex : "1", transition : "width 0.2s, left 0.2s, right 0.2s"}} layouts={[
                                    {
                                        left : 0,
                                        width : "100%",
                                    },
                                    {
                                        left : 0,
                                        width : "60%",
                                    },
                                    {
                                        left: "40%",
                                        width : "60%",
                                    }
                                ]} 
                                state={layoutState}
                                padding = "0rem"
                            >
                            
                                <FilesList />
                                
                            </HorizontalDiv>
                        </VerticalDiv>
                        <div style={{minHeight: heightOfDock, backgroundColor : "var(--background)", zIndex : "999", paddingTop : "1rem"}}>
                            {/*Dock - Action Buttons */}
                            <div className={"dock"} style={{position: "relative", width : "fit-content", top : "50%", left: "50%", transform: "translate(-50%, -50%)", display : "flex", alignItems : "center", justifyContent : "center"}}>
                                <LinqButton/>
                                <button type="button" className={"but upload"} onClick={() => setUploadPopupOpen(true)}>
                                    <div className={"but-content"} style={{display : "flex", alignItems : "center"}}>
                                        <Upload size={16} style={{marginRight : "0.25rem"}}/>
                                        Upload
                                    </div>
                                </button>
                                {uploadPopupOpen && (
                                    <>
                                        <div
                                            style={{ position: "fixed", inset: 0, zIndex: 9998, background: "rgba(0,0,0,0.4)" }}
                                            onClick={() => setUploadPopupOpen(false)}
                                            aria-hidden
                                        />
                                        <div
                                            style={{
                                                position: "fixed",
                                                bottom: "8rem",
                                                left: "50%",
                                                transform: "translateX(-50%)",
                                                zIndex: 9999,
                                            }}
                                        >
                                            <UploadArea onClose={() => setUploadPopupOpen(false)} />
                                        </div>
                                    </>
                                )}
                                <button className={"but new-note"} onClick={()=>{
                                    if (layoutState !== 2)
                                    SetLayoutState(2);
                                    else
                                    SetLayoutState(0);

                                }}> 
                                    <div className={"but-content"} style={{display : "flex", alignItems : "center"}}>
                                        <PencilLine size={16} style={{marginRight : "0.25rem"}}/>
                                        {layoutState !== 2 ? "New Note" : "Close Editor"}
                                    </div> 
                                </button>
                                
                                <DeleteButton/>
                                
                            </div>
                        </div>
                    </VerticalDiv>
                
                    
                
                <VerticalDiv style={{position : "absolute", top : "0", left : "0", width : "100%"}} >
                <HorizontalDiv style={{position : "relative", left : "0", top : `calc(${heightOfTopBar} + 1rem)`, height : `calc(100% - ${heightOfDock} - ${heightOfTopBar} - 1rem)`}}>
                    
                    <VerticalDiv style={{position : "absolute", right : "0", width : "calc(40% - 1rem)", borderRadius : "var(--border-rad)"}} padding="1rem" color="var(--accent-color)">
                        <div style={{display : "flex", flexDirection : "column", gap : "1rem", width : "100%", boxSizing : "border-box", borderBottomLeftRadius : "var(--border-rad)", borderBottomRightRadius : "var(--border-rad)"}}>
                            <div style={{display : "flex", flexDirection : "row", width : "100%", justifyContent : "space-between", alignItems : "center"}}>
                                <h1 style={{fontSize : "2rem", whiteSpace : "nowrap", overflow : "hidden", textOverflow : "ellipsis"}}>{previewedFile?.name}</h1>
                                <div>
                                    <button onClick={()=>SetLayoutState(0)} style={{  }}>Close</button>
                                </div>
                            </div>
                            <div style={{display : "flex", flexDirection : "column", gap : "0.5rem"}}>
                                {FileType(previewedFile?.type, true, false)}
                                <span><span style={{fontWeight : "bold"}}>File ID:</span> {previewedFile?.id}</span>
                                <span><span style={{fontWeight : "bold"}}>File Url:</span> <a href={`http://${window.location.host}/preview/${previewedFile?.id}`}>{`http://${window.location.host}/preview/${previewedFile?.id}`}</a></span>
                                <span><span style={{fontWeight : "bold"}}>Created:</span> {(previewedFile?.createdAt)?.toString()}</span>
                                <span><span style={{fontWeight : "bold"}}>Creator:</span> {previewedFile?.creator_email}</span>
                            </div>
                        </div>
                        <Preview />
                    </VerticalDiv>

                    <VerticalDiv style={{position : "absolute", left : "0", top : "0", bottom : "0", width : "calc(40% - 1rem)",borderRadius : "var(--border-rad)"}} color="var(--accent-color)" padding="1rem">    
                        <button
                            onClick={() => setLayoutState(0)}
                            style={{
                                position: "absolute",
                                top: "0.5rem",
                                right: "0.5rem",
                                background: "transparent",
                                border: "none",
                                color: "var(--foreground)",
                                cursor: "pointer",
                                padding: "0.5rem",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                            aria-label="Close editor"
                        >
                            <X size={24} />
                        </button>
                        <TextEditor />
                    </VerticalDiv>

                </HorizontalDiv>
                </VerticalDiv>
                

            </VerticalDiv>

            
            
        </NewPage>
    )
}