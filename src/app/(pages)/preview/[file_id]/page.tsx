import { getFileData } from "@/lib/server/getFileData";
import { getFileUrl } from "@/lib/server/getFileUrl";
import { auth } from "@clerk/nextjs/server"
import { get } from "lodash";
import { redirect } from "next/navigation"



export default async function PreviewPage({ params }: { params: { file_id: string } }) {
    const { userId } = await auth()
    
    if(!userId){
        redirect("/")
    }

    
    const fileId = await params.file_id;

    const fileData = await getFileData(fileId);

    if(!fileData){
        return (
            <div>
                You do not have permission to view this file.
                <button>Request Access</button>
                <button>Go to Dashboard</button>
            </div>
        )
    }


   
    const fileUrl = await getFileUrl({id: fileData.id, file_id: fileData.file_id!, type: fileData.type}, false);
    

    

    console.log(fileData);
    return (
        <div>
            Preview Page for file: {fileId}

            <pre>{JSON.stringify(fileData, null, 2)}</pre>
            <pre>{JSON.stringify(fileUrl, null, 2)}</pre>
        </div>
    )
}
