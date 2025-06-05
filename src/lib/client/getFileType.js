"use client"

const getFileType = (filename) => {
    if (!filename) return "Bundle";
    const ext = filename.split(".").pop().toLowerCase();
    if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) return "Image";
    if (["mp4", "webm", "ogg", "mp3", "wav"].includes(ext)) return "Recording";
    if (["pdf", "doc", "docx", "xls", "xlsx", "pptx"].includes(ext))
        return "Document";
    if (["txt", "text", "md"].includes(ext)) return "Note";
    return "Bundle";
};

export default getFileType;