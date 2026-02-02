"use client";

import { useState, useEffect } from "react";
import { getFileType } from "@/lib/client/getFileType";
import { formatRelativeDate } from "@/lib/client/formatDate";
import { DocumentViewer } from "react-documents";
import { FileType } from "@/app/components/TypeTags";
import Bundle from "./Views/Bundle";

const previewContainerStyle: React.CSSProperties = {
  width: "100%",
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "var(--theme-border-radius)",
  border: "var(--theme-border-width) solid var(--theme-border-primary)",
  padding: "1rem",
  boxSizing: "border-box",
  color: "var(--theme-text-primary)",
  background: "var(--theme-bg-primary)",
};

const mediaStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: "900px",
  borderRadius: "var(--theme-border-radius)",
  objectFit: "contain",
  objectPosition: "center",
};

const NoteView = ({ fileUrl, title }: { fileUrl: string; title?: string }) => {
  const [fileSrc, setFileSrc] = useState<string | undefined>(undefined);
  useEffect(() => {
    const load = async () => {
      const res = await fetch(fileUrl);
      const text = await res.text();
      setFileSrc(text);
    };
    load();
  }, [fileUrl]);

  if (!fileSrc) {
    return <div style={{ padding: "1rem" }}>Loading...</div>;
  }
  return (
    <div
      style={{
        width: "100%",
        maxWidth: "900px",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        alignItems: "flex-start",
      }}
    >
      {title && (
        <h1 style={{ fontSize: "2.5rem", margin: 0, fontWeight: 600 }}>{title}</h1>
      )}
      <div
        className="preview-note-content"
        dangerouslySetInnerHTML={{ __html: fileSrc }}
        style={{ width: "100%" }}
      />
    </div>
  );
};

type FileData = {
  id: string;
  type: string;
  name: string;
  file_id?: string | null;
  creator_email?: string;
  createdAt?: string;
  [key: string]: unknown;
};

type FileUrlItem = { url: string | undefined; data: any };

export function StandalonePreview({
  fileData,
  fileUrl,
}: {
  fileData: FileData;
  fileUrl: FileUrlItem[] | undefined;
}) {
  const fileType = getFileType(fileData?.type ?? fileData?.name ?? "");

  if (!fileUrl || fileUrl.length === 0 || !fileUrl[0]?.url) {
    return (
      <div style={previewContainerStyle}>
        <p>File not found or unable to load.</p>
      </div>
    );
  }

  const firstUrl = fileUrl[0].url;

  const renderContent = () => {
    switch (fileType) {
      case "Document":
        return (
          <DocumentViewer
            queryParams="hl=Nl"
            url={firstUrl}
            style={{ width: "100%", minHeight: "80vh", ...mediaStyle }}
          />
        );
      case "Image":
        return <img src={firstUrl} alt={fileData.name} style={mediaStyle} />;
      case "Recording":
        return (
          <video
            src={firstUrl}
            controls
            style={mediaStyle}
            autoPlay={false}
            muted
          />
        );
      case "Bundle":
        return <Bundle bundle_data={fileUrl} />;
      case "Note":
        return (
          <NoteView fileUrl={firstUrl} title={fileData.name} />
        );
      default:
        return (
          <div style={{ padding: "1rem" }}>Unsupported file type.</div>
        );
    }
  };

  const displayTitle = fileType === "Bundle" ? "Linq" : fileData.name;

  return (
    <div style={previewContainerStyle}>
      <div
        style={{
          width: "100%",
          maxWidth: "900px",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
        }}
      >
        {/* Preview info – top left, same as quickview */}
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
            paddingBottom: "1rem",
            marginBottom: "1rem",
            borderBottom: "var(--theme-border-width) solid var(--theme-border-primary)",
          }}
        >
          <h1 style={{ fontSize: "2.5rem", margin: 0, fontWeight: 600 }}>
            {displayTitle}
          </h1>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {FileType(fileData.type)}
            <span>
              <span style={{ fontWeight: "bold" }}>ID:</span>{" "}
              <span title={fileData.id}>
                {typeof fileData.id === "string" ? fileData.id.slice(-5) : fileData.id}
              </span>
            </span>
          {fileData.createdAt && (
            <span>
              <span style={{ fontWeight: "bold" }}>Created:</span>{" "}
              <span title={`UTC: ${fileData.createdAt}`}>
                {formatRelativeDate(fileData.createdAt)}
              </span>
            </span>
          )}
          {fileData.creator_email && (
            <span>
              <span style={{ fontWeight: "bold" }}>Creator:</span>{" "}
              {fileData.creator_email}
            </span>
          )}
          </div>
        </div>
        <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
