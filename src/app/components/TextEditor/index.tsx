"use client"

import "./style.css"
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import StarterKit from '@tiptap/starter-kit'
import { EditorContent, useEditor } from '@tiptap/react'

// load all languages with "all" or common languages with "common"
import { all, createLowlight } from 'lowlight'
import React, {useState } from 'react'

import { FileType } from "../TypeTags"
import { useFileStore } from "@/app/components/State Manager/appManager"

// create a lowlight instance with all languages loaded
const lowlight = createLowlight(all)


export const TextEditor = () => {


  const [title, setTitle] = useState("")
  const uploadFilesAction = useFileStore((state) => state.uploadFiles);
  const SetActionLoading = useFileStore((state) => state.SetActionLoading);
  const editor = useEditor({
    extensions: [
      StarterKit,
      CodeBlockLowlight.configure({
        lowlight,
      }),
    ],
    content: ``,
    immediatelyRender : false,
  })

  if (!editor) {
    return null
  }

  return (
    <>
    <div style={{ padding : "1rem", display : "flex", flexDirection : "column", gap : "1rem"}}>
        <input onChange={(e)=>{
            setTitle(e.currentTarget.value)
        }} style={{
        fontSize : "2.5rem",
        padding : "0.25rem",
        border : "0 0 var(--border-width) 0",
        borderBottom : " var(--border-width) solid var(--foreground)",
        outline : "none",
        backgroundColor : "transparent",
        color : title.trim() ? "var(--foreground)" : "rgba(255, 255, 255, 0.55)",
        margin : "0.5rem",
        }} value={title} placeholder="Title (optional)"/>

        <div style={{marginLeft : "0.5rem"}}>
            {FileType("md")}
        </div>

        
      
        <EditorContent editor={editor} />


      
    </div>
        <button
            onClick={async () => {
                const noteText = editor.getHTML()
                const plainText = editor.getText().replace(/\s+/g, " ").trim()
                const fallbackTitle = plainText.length >= 8
                    ? plainText.slice(0, 8)
                    : plainText.length >= 4
                        ? plainText
                        : (plainText.length > 0 ? plainText : "Untitled Note")
                const resolvedTitle = (title.trim() || fallbackTitle).replace(/[\\/:*?"<>|]/g, "-")

                const notefile = new File([noteText], resolvedTitle + ".txt", {
                    type: "text/html",
                });
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(notefile);
                const fileList = dataTransfer.files;
                try {
                    SetActionLoading(true, "Saving note...")
                    await uploadFilesAction(fileList, null);
                } catch (err) {
                    console.error("Error uploading file:", err);
                } finally {
                    SetActionLoading(false)
                }
            }}
            style={{
                padding: "0.5rem 1rem",
                border: "1px solid var(--foreground)",
                borderRadius: "var(--border-rad)",
                background: "transparent",
                color: "var(--foreground)",
                cursor: "pointer",
                fontSize: "1rem",
            }}
        >
            Save
        </button>

    </>
  )
}