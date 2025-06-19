"use client"
import { NewPage, VerticalDiv, HorizontalDiv } from "@/app/components/UILayout"
import { UserButton, SignOutButton } from "@clerk/nextjs"
import { FilesList } from "@/app/components/FileList"
import { useFileStore } from "@/app/components/State Manager/appManager"
import { Preview } from "@/app/components/Preview"
import Bundle from "@/lib/server/Bundle/bundle"
import { ButtonBundle } from "@/app/components/buttonBundle"
import UploadArea from "@/app/components/Uploads/UploadArea"
import Tiptap from "@/app/components/TextEditor"
import { FileType } from "@/app/components/TypeTags"
export const Dashboard = ({}) => {
    const layoutState = useFileStore((state)=>state.layoutState)
    const setLayoutState = useFileStore((state)=>state.SetLayoutState)
    const previewedFile = useFileStore((state)=>state.previewedFile)
    const SetLayoutState = useFileStore((state)=>state.SetLayoutState)
    return (       
        <NewPage>    
            <VerticalDiv style={{position : "relative"}}>
                <HorizontalDiv color="var(--background)" style={{position : "absolute", padding : "1rem", border : "var(--border-width) solid white", borderRadius : "var(--border-rad)", zIndex : "1", transition : "width 0.2s ease-out, left 0.2s ease-out, right 0.2s ease-out"}} layouts={[
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
                        > 
                        
                    <VerticalDiv width="25vw" style={{maxWidth : "300px", minWidth : "200px", border : "var(--border-width) solid white", borderRadius : "var(--border-rad)", padding : "1rem"}}>
                        <div>
                            <h1>Connect Work</h1>
                            <p>Remade in NextJs</p>
                            <div style={{
                                display: "flex",
                                alignItems : "center",
                                gap: "1rem",
                                padding: "1rem"
                            }}>
                                <UserButton/>
                                <SignOutButton/>
                            </div>
                        </div>
                        <ButtonBundle/>
                        <UploadArea/>
                        <button onClick={()=>{
                            setLayoutState(2)
                        }}>
                            new note
                        </button>
                    </VerticalDiv>
                    
                    <FilesList />
                    
                </HorizontalDiv>
                
                <VerticalDiv style={{position : "absolute", right : "0", top : "0", bottom : "0", width : "calc(40% - 1rem)"}} padding="0rem">
                    <div style={{display : "flex", flexDirection : "column", gap : "1rem", width : "100%"}}>
                        <div style={{display : "flex", flexDirection : "row", width : "100%", justifyContent : "space-between"}}>
                            <h1 style={{fontSize : "2.5rem"}}>{previewedFile?.name}</h1>
                            <button onClick={()=>SetLayoutState(0)} style={{    }}>Close</button>
                        </div>
                        <div style={{display : "flex", flexDirection : "column", gap : "0.5rem"}}>
                            {FileType(previewedFile?.type)}
                            <span><span style={{fontWeight : "bold"}}>ID:</span> {previewedFile?.id}</span>
                            <span><span style={{fontWeight : "bold"}}>Created:</span> {previewedFile?.createdAt}</span>
                            <span><span style={{fontWeight : "bold"}}>Creator:</span> {previewedFile?.creator_email}</span>
                        </div>
                    </div>
                    <Preview />
                </VerticalDiv>

                <VerticalDiv style={{position : "absolute", left : "0", top : "0", bottom : "0", width : "calc(40% - 1rem)", backgroundColor : "var(--background)", borderRadius : "var(--border-rad)", border : "var(--border-width) solid white", padding : "1rem"}}>    
                    <button onClick={()=>{
                        setLayoutState(0)
                    }}>
                        close
                    </button>
                    <Tiptap/>
                </VerticalDiv>
                    

            </VerticalDiv>
        </NewPage>
    )
}