"use client"

import { useRef, useState, useEffect } from "react";
import { useFileStore } from "../State Manager/appManager";

const ListItem = ({ index, name, remove, percentage }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [logoutHovered, setLogoutHovered] = useState(false);
    const setError = useFileStore((state) => state.SetError);

    useEffect(() => {
        console.log(percentage);
    }, [percentage]);

    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                position: "relative",
                overflowX: "hidden",
                padding: "0.5rem",
                paddingLeft: "1rem",
                paddingRight: "1rem",
            }}
            onMouseEnter={() => {
                setIsHovered(true);
            }}
            onMouseLeave={() => {
                setIsHovered(false);
            }}
        >
            <div
                style={{
                    position: "absolute",
                    top: "50%",
                    transform: "translateY(-50%)",
                    borderRadius: "var(--border-rad)",
                    paddingLeft: "0.5rem",
                    paddingRight: "0.5rem",
                    zIndex: 1000,

                    ...(isHovered
                        ? { pointerEvents: "auto", left: "0.5rem" }
                        : { pointerEvents: "none", left: "-2.0rem" }),
                    ...(logoutHovered
                        ? {
                              backgroundColor: "#ffc2c3",
                              color: "#f52727",
                              borderColor: "#f52727",
                          }
                        : {}),
                    transition: "left 0.2s, background-color 0.2s",

                    cursor: "pointer",
                }}
                onMouseEnter={() => {
                    setLogoutHovered(true);
                    setIsHovered(true);
                }}
                onMouseLeave={() => {
                    setLogoutHovered(false);
                    setIsHovered(true);
                }}
                onClick={() => {
                    setError("File Removed", "good");
                    remove(name);
                }}
            >
                -
            </div>{" "}
            <div
                style={{
                    ...(isHovered ? { opacity: "0" } : { opacity: "1" }),
                }}
            >
                {index}
            </div>
            <span
                style={{
                    overflowX: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    flex: 1,
                }}
            >
                {name}
            </span>
            <div
                style={{
                    position: "absolute",
                    top: "0",
                    left: "0",
                    height: "100%",
                    width: `${percentage}%`,
                    backgroundColor: "var(--background)",
                    opacity: "0.5",
                    borderRadius: "var(--border-rad)"
                }}
            ></div>
        </div>
    );
};

const UploadArea = () => {
    const fileInputRef = useRef(null);
    const [files, setFiles] = useState([]);
    const [progress, setProgress] = useState([]);
    const uploadFile = useFileStore((state) => state.uploadFiles);
    const setError = useFileStore((state) => state.setError);

    const onProgress = (name, percent) => {
        const newList = { ...progress };
        newList[name] = percent;
        setProgress(newList);
    };

    useEffect(() => {
        setFiles(
            files.filter((f) => {
                return progress[f.name] !== 100;
            })
        );
    }, [progress]);

    const removeFile = (index) => {
        setFiles(
            files.filter((f) => {
                return f.name !== index;
            })
        );
    };

    return (
        <div
            style={{
                border: "var(--border-width) solid var(--foreground)",
                
                padding: "1rem",
                borderRadius: "var(--border-rad)"
            }}
        >
            <div
                
            >
                File Upload
            </div>
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    overflowY: "auto",
                }}
            >
                {Array.from(files).map((f, index) => (
                    <ListItem
                        index={index + 1}
                        name={f.name}
                        key={index}
                        remove={removeFile}
                        percentage={progress[f.name]}
                    />
                ))}
            </div>
            <div
                style={{
                    padding: "0.5rem",
                    border: "var(--border-width) solid var(--foreground)",
                    
                    marginTop: "0.5rem",
                    borderRadius: "var(--border-rad)"
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        // padding: "0.5rem",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                        }}
                    >
                        <button
                            onClick={(e) => {
                                if (!fileInputRef) {
                                    setError(true);
                                }
                                fileInputRef.current.click();
                            }}
                        >
                        Add
                            <input
                                ref={fileInputRef}
                                type="file"
                                multiple
                                style={{
                                    visibility: "hidden",
                                    position: "absolute",
                                }}
                                onChange={(event) => {
                                    const newfiles = event.target.files;
                                    const newList = [...files, ...newfiles];
                                    if (newList.length > 10) {
                                        setError("Hit upload limit :(", "bad");
                                        newList.length = 10;
                                    }
                                    setFiles(newList);

                                    const newProgress = {};

                                    for (let i = 0; i < newList.length; i++) {
                                        newProgress[newList[i].name] = 0;
                                    }

                                    console.log(newProgress);

                                    setProgress(newProgress);
                                }}
                            />
                        </button>
                        <button
                            onClick={() => {
                                setFiles([]);
                            }}
                        >
                            
                            Clear
                        </button>
                    </div>

                    <div>{files.length}/10</div>
                </div>
                <button
                    style={
                        {
                            // marginLeft: "0.5rem",
                        }
                    }
                    onClick={async (e) => {
                        e.preventDefault();

                        if (!files || files.length === 0) {
                            console.error("No files selected");
                            return;
                        }

                        try {
                            await uploadFile(files, onProgress);

                            setProgress([]);
                            setFiles([]);
                        } catch (error) {
                            setError(error);
                        }
                    }}
                >
                     Upload
                </button>
            </div>
        </div>
    );
};

export default UploadArea;
