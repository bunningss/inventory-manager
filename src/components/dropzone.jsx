"use client";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

export function ImageDropzone({ setFiles }) {
  const onDrop = useCallback(
    async (acceptedFiles) => {
      for (const file of acceptedFiles) {
        const reader = new FileReader();

        // Read file as Base64
        reader.onload = () => {
          const base64String = reader.result.split(",")[1];

          // Add file with Base64 to the state
          setFiles((prev) => [
            ...prev,
            { type: file.type, baseData: base64String },
          ]);
        };

        reader.readAsDataURL(file); // Start reading the file
      }
    },
    [setFiles]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
  });

  return (
    <div
      {...getRootProps()}
      className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer"
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop files here...</p>
      ) : (
        <p>Drag and drop images here, or click to select files.</p>
      )}
    </div>
  );
}
