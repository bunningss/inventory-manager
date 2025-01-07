"use client";
import Image from "next/image";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "./ui/button";
import { uploadToS3 } from "@/utils/file-upload";
import { errorNotification } from "@/utils/toast";
import { Loading } from "./loading";

const readFileAsBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve({ type: file.type, baseData: reader.result });
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

export function ImageDropzone({
  uploadedFiles,
  setUploadedFiles,
  allowMultiple,
  disabled,
  label = "Drag and drop images here, or click to select files.",
}) {
  const [isLoading, setIsLoading] = useState(false);

  const onDrop = useCallback(
    async (acceptedFiles) => {
      if (disabled || isLoading) return;

      try {
        setIsLoading(true);
        const base64Files = await Promise.all(
          acceptedFiles.map((file) => readFileAsBase64(file))
        );

        const urls = await uploadToS3(base64Files);
        setUploadedFiles((prev) => [...prev, ...urls]);
      } catch (err) {
        errorNotification(err.message);
      } finally {
        setIsLoading(false);
      }
    },
    [disabled, setUploadedFiles, isLoading]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: allowMultiple,
  });

  const handleRemoveFile = useCallback(
    (currentFile) => {
      if (disabled || isLoading) return;

      if (uploadedFiles?.length > 0) {
        const newFiles = uploadedFiles?.filter((file) => file !== currentFile);

        setUploadedFiles(newFiles);
      }
    },
    [setUploadedFiles, uploadedFiles, disabled, isLoading]
  );

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className="border-2 border-dashed rounded-lg p-12 text-center cursor-pointer"
      >
        {isLoading ? (
          <Loading />
        ) : (
          <>
            <input {...getInputProps()} />
            {isDragActive ? <p>Drop files here...</p> : <p>{label}</p>}
          </>
        )}
      </div>
      <div className="flex gap-4 flex-wrap">
        {uploadedFiles?.length > 0 &&
          uploadedFiles?.map((file, index) => {
            return (
              <div key={index} className="relative">
                <Button
                  icon="close"
                  variant="ghost"
                  className="h-auto p-1 z-10 absolute top-1 right-1 bg-destructive rounded-full text-background"
                  onClick={() => handleRemoveFile(file)}
                />
                <figure className="relative h-36 w-36 border rounded-md overflow-hidden">
                  <Image
                    src={file}
                    alt="Upload image"
                    fill
                    className="object-cover"
                    sizes="250px"
                  />
                </figure>
              </div>
            );
          })}
      </div>
    </div>
  );
}
