"use client"
import { NewPage, VerticalDiv, HorizontalDiv } from "@/app/components/UILayout"
import { UserButton, SignOutButton } from "@clerk/nextjs"
import { FilesList } from "@/app/components/FileList"
import { useFileStore } from "@/app/components/State Manager/appManager"
import { Preview } from "@/app/components/Preview"
import Bundle from "@/lib/server/Bundle/bundle"
import { ButtonBundle } from "@/app/components/buttonBundle"
export const Dashboard = ({}) => {
    const layoutState = useFileStore((state)=>state.layoutState)
    
    return (       
        <NewPage>    
            <VerticalDiv style={{position : "relative"}}>
                <HorizontalDiv  style={{padding : "1rem", border : "1px solid white", zIndex : "1", transition : "width 0.2s ease-out",  backdropFilter: "blur(20px) brightness(0.4)"}} layouts={[
                            {
                                width : "100%",
                            },
                            {
                                width : "60%",
                            }
                        ]} 
                        state={layoutState}
                        > 
                        
                    <VerticalDiv width="25vw" color="red" style={{maxWidth : "300px", minWidth : "200px"}}>
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
                    </VerticalDiv>
                    
                    <FilesList />
                    
                </HorizontalDiv>
                
                <HorizontalDiv style={{position : "absolute", right : "0", top : "0", bottom : "0", width : "40%"}}>
                    <Preview />
                </HorizontalDiv>
                    

            </VerticalDiv>
        </NewPage>
    )
}