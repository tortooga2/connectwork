import { FileData } from "@/app/components/FileDisplay";
import Bundle from "@/app/components/Preview/Views/Bundle";
import { NewPage, VerticalDiv } from "@/app/components/UILayout";
import { getFileData } from "@/lib/server/getFileData";
import { getFileUrl } from "@/lib/server/getFileUrl";
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { UserButton } from "@clerk/nextjs";

// 1. Update the type to expect a Promise
export default async function PreviewPage({ 
    params 
}: { 
    params: Promise<{ file_id: string }> 
}) {
    
    const heightOfTopBar = "3%";
    const { userId } = await auth();
    
    if(!userId){
        redirect("/");
    }

    // 2. Await the params object before accessing properties
    const resolvedParams = await params;
    const fileId = resolvedParams.file_id;

    const fileData = await getFileData(fileId);

    if(!fileData){
        return (
            <div className="p-10">
                <p>You do not have permission to view this file.</p>
                <button>Request Access</button>
                <button>Go to Dashboard</button>
            </div>
        );
    }

    const fileUrl = await getFileUrl({
        id: fileData.id, 
        file_id: fileData.file_id!, 
        type: fileData.type
    }, false);

    return (
        <NewPage>
            <VerticalDiv style={{alignItems: "center"}} padding="1rem">
                <div style={{height: heightOfTopBar, minHeight: `calc(${heightOfTopBar} + 1rem)`, width : "100%", padding: "0rem 2rem", display : "flex", alignItems : "center", justifyContent : "space-between", boxSizing : "border-box", zIndex : "2"}}>
                            <h1 style={{fontSize : "2rem", color: "var(--bundle-color-2)", margin: 0}}>Linquiq</h1>
                            <UserButton/>
                                
                </div>
                <VerticalDiv width="65%" padding="0rem">
                    <FileData fileData={fileData} />
                    <VerticalDiv  style={{borderRadius: "var(--border-rad)", scrollbarWidth : "auto", }} padding="0rem" gap="1rem">
                        <div style={{padding: "1rem", boxSizing : "border-box", backgroundColor : "var(--accent-color)", borderRadius : "var(--border-rad)", overflowY : "auto"}}>
                            <Bundle bundle_data={fileUrl || undefined} />
                        </div>
                    </VerticalDiv>
                </VerticalDiv>
            </VerticalDiv>
        </NewPage>
    );
}