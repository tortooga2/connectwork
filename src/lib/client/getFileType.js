"use client"

export const getFileType = (fileType) => {
    if (!fileType) return "Bundle";
    if (["jpg", "jpeg", "png", "gif", "webp"].includes(fileType)) return "Image";
    if (["mp4", "webm", "ogg", "mp3", "wav"].includes(fileType)) return "Recording";
    if (["pdf", "doc", "docx", "xls", "xlsx", "pptx"].includes(fileType))
        return "Document";
    if (["txt", "text", "md"].includes(fileType)) return "Note";
    return "Bundle";
};
