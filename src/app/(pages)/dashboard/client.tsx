"use client"
import { NewPage, VerticalDiv, HorizontalDiv } from "@/app/components/UILayout"
import { UserButton, SignOutButton } from "@clerk/nextjs"
import { FilesList } from "@/app/components/FileList"
import { useFileStore } from "@/app/components/State Manager/appManager"
import { Preview } from "@/app/components/Preview"
import { LinqButton } from "@/app/components/LinqButton"
import UploadArea from "@/app/components/Uploads/UploadArea"
import { TextEditor } from "@/app/components/TextEditor"
import { FileType } from "@/app/components/TypeTags"
import { DeleteButton } from "@/app/components/DeleteButton"


export const Dashboard = ({}) => {
    const layoutState = useFileStore((state)=>state.layoutState)
    const setLayoutState = useFileStore((state)=>state.SetLayoutState)
    const previewedFile = useFileStore((state)=>state.previewedFile)
    const SetLayoutState = useFileStore((state)=>state.SetLayoutState)
    return (       
        <NewPage>    
            <VerticalDiv style={{position : "relative", height: "calc(95% - 1rem)", borderWidth: "0px", borderColor: "transparent"}} padding="0rem">
                
                    <VerticalDiv>

                        <div style={{width : "100%", height : "5%", display : "flex", alignItems : "center", justifyContent : "space-between", padding : "1rem", boxSizing : "border-box"}}>
                            <h1 style={{fontSize : "2rem"}}>Dashboard</h1>
                            <div style={{display : "flex", alignItems : "center", gap : "1rem"}}>
                                <UserButton/>
                            </div>
                        </div>
                        
                    <HorizontalDiv color="var(--background)" style={{top : "calc(5% + 1rem)", position: "absolute", height: "calc(95% - 1rem)", zIndex : "1", transition : "width 0.2s ease-out, left 0.2s ease-out, right 0.2s ease-out"}} layouts={[
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
                    
                        <FilesList />
                    </HorizontalDiv>
                    {/*Dock - Action Buttons */}
                    <div style={{position: "fixed", bottom : "calc(5% - 1rem)", left: "50%", transform: "translateX(-50%)", display : "flex", gap : "1rem", zIndex : "10"}}>
                        <LinqButton/>
                        <DeleteButton/>
                        <button onClick={()=>{
                            if (layoutState !== 2)
                            SetLayoutState(2);
                            else
                            SetLayoutState(0);

                        }}> new note </button>
                    </div>
                </VerticalDiv>
                
                    
                
                
                <HorizontalDiv style={{position : "absolute", left : "0", top : "calc(5% + 1rem)", height : "calc(95% - 1rem)", width : "100%"}}>
                    <VerticalDiv style={{position : "absolute", right : "0", width : "calc(40% - 1rem)", height : "100%"}} padding="0">
                        <div style={{display : "flex", flexDirection : "column", gap : "1rem", width : "100%"}}>
                            <div style={{display : "flex", flexDirection : "row", width : "100%", justifyContent : "space-between", alignItems : "center"}}>
                                <h1 style={{fontSize : "2.5rem"}}>{previewedFile?.name}</h1>
                                <div>
                                    <button onClick={()=>SetLayoutState(0)} style={{  }}>Close</button>
                                </div>
                            </div>
                            <div style={{display : "flex", flexDirection : "column", gap : "0.5rem"}}>
                                {FileType(previewedFile?.type)}
                                <span><span style={{fontWeight : "bold"}}>ID:</span> {previewedFile?.id}</span>
                                <span><span style={{fontWeight : "bold"}}>Created:</span> {(previewedFile?.createdAt)?.toString()}</span>
                                <span><span style={{fontWeight : "bold"}}>Creator:</span> {previewedFile?.creator_email}</span>
                            </div>
                        </div>
                        <Preview />
                    </VerticalDiv>

                    <VerticalDiv style={{position : "absolute", left : "0", top : "0", bottom : "0", width : "calc(40% - 1rem)"}}>    
                        <button onClick={()=>{
                            setLayoutState(0)
                        }}>
                            close
                        </button>
                        <TextEditor />
                    </VerticalDiv>
                        
                    
                
                </HorizontalDiv>
            </VerticalDiv>

            
            
        </NewPage>
    )
}