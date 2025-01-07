"use client";
import Image from "next/image";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "./ui/button";

export function ImageDropzone({ files, setFiles }) {
  const onDrop = useCallback(
    async (acceptedFiles) => {
      for (const file of acceptedFiles) {
        const reader = new FileReader();

        reader.onload = () => {
          setFiles((prev) => [
            ...prev,
            { type: file.type, baseData: reader.result },
          ]);
        };

        reader.readAsDataURL(file);
      }
    },
    [setFiles]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
  });

  const handleRemoveFile = useCallback(
    (currentFile) => {
      if (files?.length > 0) {
        const newFiles = files?.filter((file) => file.baseData !== currentFile);

        setFiles(newFiles);
      }
    },
    [files, setFiles]
  );

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className="border-2 border-dashed rounded-lg p-12 text-center cursor-pointer"
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop files here...</p>
        ) : (
          <p>Drag and drop images here, or click to select files.</p>
        )}
      </div>
      <div className="flex gap-4 flex-wrap">
        {files?.length > 0 &&
          files?.map((file, index) => {
            return (
              <div key={index} className="relative">
                <Button
                  icon="close"
                  variant="ghost"
                  className="h-auto p-1 z-10 absolute top-1 right-1 bg-destructive rounded-full text-background"
                  onClick={() => handleRemoveFile(file.baseData)}
                />
                <figure className="relative h-36 w-36 border rounded-md overflow-hidden">
                  <Image
                    src={file.baseData}
                    alt="Upload image"
                    fill
                    className="object-cover"
                  />
                </figure>
              </div>
            );
          })}
      </div>
    </div>
  );
}
