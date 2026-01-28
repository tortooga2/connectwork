import { getFileData } from "@/lib/server/getFileData";
import { getFileUrl } from "@/lib/server/getFileUrl";
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { StandalonePreview } from "@/app/components/Preview/StandalonePreview"

export default async function PreviewPage({ params }: { params: Promise<{ file_id: string }> }) {
    const { userId } = await auth()

    if (!userId) {
        redirect("/")
    }

    const { file_id: fileId } = await params;
    const fileData = await getFileData(fileId);

    if (!fileData) {
        return (
            <div style={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "1rem",
                padding: "1rem",
                color: "var(--theme-text-primary)",
                background: "var(--theme-bg-primary)",
            }}>
                <p>You do not have permission to view this file.</p>
                <div style={{ display: "flex", gap: "1rem" }}>
                    <Link href="/dashboard" style={{ color: "var(--theme-link-color)" }}>Go to Dashboard</Link>
                </div>
            </div>
        )
    }

    const fileUrl = await getFileUrl(
        { id: fileData.id, file_id: fileData.file_id!, type: fileData.type },
        false
    );

    return (
        <StandalonePreview
            fileData={{
                id: fileData.id,
                type: fileData.type,
                name: fileData.name,
                file_id: fileData.file_id,
                creator_email: fileData.creator_email,
                createdAt: fileData.createdAt ? new Date(fileData.createdAt).toISOString() : undefined,
            }}
            fileUrl={fileUrl ?? undefined}
        />
    )
}
