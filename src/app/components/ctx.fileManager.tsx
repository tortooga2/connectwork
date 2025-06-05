"use client"
import { create } from 'zustand'

// Updated File type to match your Drizzle schema
export type File = {
    id: string,
    creator_id: string,
    name: string,
    type: string,
    description?: string,
    file_id: string, // S3 key
    createdAt: string,
    creator_email : string
}

interface FileManagerState {
    layoutState: number,
    SetLayoutState: (layoutNum: number) => void,
    files: Map<string, File>,
    SetFiles: (files: File[]) => void,
    UpdateFiles: (files: File[]) => void,
    uploadFiles: (files: FileList, onProgress: null | ((name: string, percent: number) => void)) => Promise<void>,
    loading: boolean,
    SetLoading: (loading: boolean) => void,
    selectedFiles: Set<string>,
    SelectFile: (fileId: string, selected: boolean) => void,
    ClearSelection: () => void,
    error: string | null,
    SetError: (error: string | null) => void,
}

export const useFileStore = create<FileManagerState>()((set, get) => ({
    layoutState: 0,
    SetLayoutState: (layoutNum) => set(() => ({ layoutState: layoutNum })),
    
    files: new Map<string, File>(),
    SetFiles: (newFiles) => {
        const newMap = new Map<string, File>();
        newFiles.forEach((f: File) => {
            newMap.set(f.id, f)
        })
        set({ files: newMap })
    },
    
    UpdateFiles: (newFiles) => {
        set((state) => {
            const updatedFiles = new Map(state.files);
            newFiles.forEach((file) => {
                updatedFiles.set(file.id, file);
            });
            return { files: updatedFiles };
        });
    },

    loading: false,
    SetLoading: (loading) => set({ loading }),

    selectedFiles: new Set<string>(),
    SelectFile: (fileId, selected) => {
        set((state) => {
            const newSelectedFiles = new Set(state.selectedFiles);
            if (selected) {
                newSelectedFiles.add(fileId);
            } else {
                newSelectedFiles.delete(fileId);
            }
            return { selectedFiles: newSelectedFiles };
        });
    },
    ClearSelection: () => set({ selectedFiles: new Set() }),

    error: null,
    SetError: (error) => set({ error }),

    uploadFiles: async (files, onProgress = null) => {
        const { SetLoading, SetError, UpdateFiles } = get();
        
        SetLoading(true);
        SetError(null);

        // Separate name from each file
        const fileNames: string[] = [];
        for (let index = 0; index < files.length; index++) {
            fileNames.push(files[index].name);
        }

        try {
            // Get presigned URLs
            const response = await fetch(
                `/api/file/upload-helper?count=${files.length}`,
                {
                    method: "GET",
                    credentials: "include",
                }
            );

            if (!response.ok) {
                throw new Error("Failed to get upload URLs");
            }

            const { urls, keys } = await response.json();

            // Upload each file to S3
            const uploadPromises = files.length > 0 ? Array.from(files).map(async (file, index) => {
                return new Promise<void>((resolve, reject) => {
                    const xhr = new XMLHttpRequest();
                    xhr.open("PUT", urls[index]);

                    xhr.onload = async () => {
                        if (xhr.status === 200) {
                            if (onProgress) {
                                onProgress(file.name, 100);
                            }
                            
                            const fileVerResponse = await fetch("/api/file/verify", {
                                                    method: "POST",
                                                    credentials: "include",
                                                    headers: {
                                                        "Content-Type": "application/json",
                                                    },
                                                    body: JSON.stringify({
                                                        keys: [keys[index]],
                                                        fileNames: [fileNames[index]],
                                                    }),
                                                })

                            if (!fileVerResponse.ok) {
                                const errorData = await fileVerResponse.json();
                                
                                throw new Error("Failed to verify files", errorData);
                            }

                            const { data, message} = await fileVerResponse.json();

                            console.log(data)

                             // Set success message based on response
                            if (message.includes("All files")) {
                                SetError("✅ All files uploaded successfully!");
                            } else {
                                SetError("⚠️ Some files uploaded successfully");
                            }
                            
                            // Update the store with the new files
                            UpdateFiles(data);
                                            
                            resolve()
                        } else {
                            reject(new Error(`Failed to upload ${file.name}`));
                        }
                    };

                    xhr.onerror = () => {
                        reject(new Error(`XHR error for ${file.name}`));
                    };

                    xhr.upload.onprogress = (event) => {
                        if (event.lengthComputable && onProgress) {
                            const percent = (event.loaded / event.total) * 100;
                            onProgress(file.name, percent);
                        }
                    };

                    xhr.send(file);
                });
            }) : [];

            // Wait for all uploads to complete
            await Promise.all(uploadPromises);

            // Verify files with the database
            

            
            
           

        } catch (error) {
            console.error("Upload error:", error);
            SetError(`❌ Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            SetLoading(false);
        }
    },
}));