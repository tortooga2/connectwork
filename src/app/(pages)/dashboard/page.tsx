import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { SignedIn, UserButton, SignOutButton } from "@clerk/nextjs";

import NewPage from "@/app/components/UILayout/NewPage";
import VerticalDiv from "@/app/components/UILayout/VerticalDiv";
import HorizontalDiv from "@/app/components/UILayout/HorizontalDiv";
import UploadArea from "@/app/components/Uploads/UploadArea"
import { ShowFiles } from "@/app/components/fileView";



export default async function Dashboard() {
    const { userId } = await auth();
    console.log("userId", userId);
    if (!userId) {
        redirect("/");
    }



    return (
        <NewPage>
            
            <VerticalDiv>
                <HorizontalDiv color={"var(--background)"} padding={"0rem"}>
                    <VerticalDiv  width={"15%"} padding = "0rem">
                        {/* <VerticalDiv color={"var(--foreground)"} style={{ borderRadius: "0.5rem", color : "var(--background)", gap : "0rem" }} height={"35%"}> */}
                            <div style={{border : "1px solid var(--foreground)", color : "var(--foreground)", padding : "1rem", borderRadius : "0rem"}}>
                                <h1>connectwork</h1>
                                <p>remade in nextjs</p>
                                <SignedIn>
                                    <div style={{display : "flex", gap : "1rem"}}>
                                        <UserButton />
                                        <SignOutButton />
                                    </div>
                                </SignedIn>
                            </div>

                        {/* </VerticalDiv> */}
                        <VerticalDiv
                            
                            style={{ border : "1px solid var(--foreground)", color : "var(--foreground)", borderRadius: "0rem", padding : "1rem"      }}
                            height="150%"
                        >
                            <UploadArea/>
                        </VerticalDiv>
                        <VerticalDiv
                        
                            style={{  border : "1px solid var(--foreground)", color : "var(--foreground)", borderRadius: "0rem", padding : "1rem"      }}
                        >
                        ...
                        </VerticalDiv>
                    </VerticalDiv>
                    <VerticalDiv padding="0rem">
                <div className={"row"} style={{
                                                   
                                            border : "1px solid var(--foreground)",                                                    
                                            color : "var(--foreground)",
                                                   
                                                    
                                                }}>
                <div></div>
                <div style={{overflow: "hidden", textWrap:"nowrap", textOverflow: "ellipsis", fontWeight: "bold"}}>ID:</div>
                <div style={{overflow: "hidden", textWrap:"nowrap", textOverflow: "ellipsis", fontWeight: "bold"}}>CREATED AT:</div>
                <div style={{overflow: "hidden", textWrap:"nowrap", textOverflow: "ellipsis", fontWeight: "bold"}}>TYPE:</div>
                <div style={{overflow: "hidden", textWrap:"nowrap", textOverflow: "ellipsis", fontWeight: "bold"}}>CREATOR:</div>
                <div style={{overflow: "hidden", textWrap:"nowrap", textOverflow: "ellipsis", fontWeight: "bold"}}>NAME:</div>
            </div>
                    <VerticalDiv padding="0rem" style={{gap: "0.0rem", borderRadius : "0rem", border : "1px solid var(--foreground)"}}>
                        {" "}
                    </VerticalDiv>
                    </VerticalDiv>
                    
                </HorizontalDiv>
            </VerticalDiv>
            
            <div style={{
                position: "absolute",
                top: "0",
                left: "0",
                width: "100%",
                height: "100%",
                backdropFilter: "blur(7px) brightness(1.1)",
                
            }}>
                <VerticalDiv>
                <HorizontalDiv padding={"0rem"}>
                    <VerticalDiv  width={"15%"} padding = "0rem">
                       
                            <div style={{border : "1px solid var(--foreground)", color : "var(--foreground)", padding : "1rem", borderRadius : "0rem"}}>
                                <h1>connectwork</h1>
                                <p>remade in nextjs</p>
                                <SignedIn>
                                    <div style={{display : "flex", gap : "1rem"}}>
                                        <UserButton />
                                        <SignOutButton />
                                    </div>
                                </SignedIn>
                            </div>

                       
                        <VerticalDiv
                           
                            style={{ border : "1px solid var(--foreground)", color : "var(--foreground)", borderRadius: "0rem", padding : "1rem"    }}
                            height="150%"
                        >
                            <UploadArea/>
                        </VerticalDiv>
                        <VerticalDiv
                           
                            style={{  border : "1px solid var(--foreground)", color : "var(--foreground)", borderRadius: "0rem", padding : "1rem"     }}
                        >
                        ...
                        </VerticalDiv>
                    </VerticalDiv>
                
                    <ShowFiles/>
                    
                </HorizontalDiv>
            </VerticalDiv>
            </div>


            
            
        </NewPage>
    );
}
