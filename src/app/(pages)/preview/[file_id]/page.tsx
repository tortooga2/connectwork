import { getFileData } from "@/lib/server/getFileData";
import { getFileUrl } from "@/lib/server/getFileUrl";
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

// 1. Update the type to expect a Promise
export default async function PreviewPage({ 
    params 
}: { 
    params: Promise<{ file_id: string }> 
}) {
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
        <div className="p-10">
            <h1>Preview Page for file: {fileId}</h1>
            <pre className="bg-gray-100 p-4">{JSON.stringify(fileData, null, 2)}</pre>
            <pre className="bg-gray-100 p-4">{JSON.stringify(fileUrl, null, 2)}</pre>
        </div>
    );
}