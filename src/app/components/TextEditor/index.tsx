"use client"

import "./style.css"

import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import StarterKit from '@tiptap/starter-kit'
import { EditorContent, useEditor } from '@tiptap/react'

// load all languages with "all" or common languages with "common"
import { all, createLowlight } from 'lowlight'
import React, { useRef, useState } from 'react'

import { FileType } from "../TypeTags"
import { useFileStore } from "@/app/components/State Manager/appManager"

// create a lowlight instance with all languages loaded
const lowlight = createLowlight(all)


export default () => {


  const [title, setTitle] = useState("Untitled Note")
  const contentRef = useRef<HTMLHeadingElement>(null)
  const uploadFilesAction = useFileStore((state) => state.uploadFiles);
  const editor = useEditor({
    extensions: [
      StarterKit,
      CodeBlockLowlight.configure({
        lowlight,
      }),
    ],
    content: ``,
    immediatelyRender: false,
  })

  if (!editor) {
    return null
  }

  return (
    <>
      <div style={{ borderRadius: "var(--border-rad)", border: "none", padding: "0.5rem 1rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
        <input onChange={(e) => {
          setTitle(e.currentTarget.value)
        }} style={{
          fontSize: "2.5rem",
          padding: "0.25rem",
          border: "0 0 var(--border-width) 0",
          borderBottom: " var(--border-width) solid var(--foreground)",
          outline: "none",
          backgroundColor: "transparent",
          color: "var(--foreground)",
          margin: "0.25rem 0.5rem",
        }} value={title} />

        <div style={{ marginLeft: "0.5rem" }}>
          {FileType("md")}
        </div>



        <EditorContent editor={editor} />



      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1rem" }}>
        <button
          onClick={async () => {
            console.log(editor.getHTML())
            const noteText = editor.getHTML()
            const notefile = new File([noteText], title + ".txt", {
              type: "text/html",
            });

            // Convert File[] to FileList using DataTransfer
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(notefile);
            const fileList = dataTransfer.files;

            try {
              await uploadFilesAction(fileList, null);

            } catch (err) {

            }
          }}
          style={{
            padding: "0.75rem 1.5rem",
            border: "var(--theme-border-width) solid var(--theme-btn-primary-border)",
            borderRadius: "var(--theme-border-radius)",
            backgroundColor: "var(--theme-btn-primary-bg)",
            color: "var(--theme-btn-primary-text)",
            cursor: "pointer",
            fontSize: "1rem",
            fontWeight: "500",
            transition: "all 0.2s ease"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "var(--theme-btn-primary-hover-bg)"
            e.currentTarget.style.color = "var(--theme-btn-primary-hover-text)"
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "var(--theme-btn-primary-bg)"
            e.currentTarget.style.color = "var(--theme-btn-primary-text)"
          }}
        >
          Save
        </button>
      </div>

    </>
  )
}