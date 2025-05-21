"use client";

import { Upload, X } from "lucide-react";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Controller, FieldValues, Path, useFormContext } from "react-hook-form";

interface DropzoneProps<T extends FieldValues> {
  name: Path<T>;
}

export const Dropzone = <T extends FieldValues>({ name }: DropzoneProps<T>) => {
  const { control } = useFormContext<T>();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { value, onChange } }) => {
        const onDrop = useCallback(
          (file: File[]) => {
            if (file.length > 0) {
              onChange(file[0]);
            }
          },
          [onChange]
        );
        const MAX_UPLOAD_SIZE = 1024 * 1024 * 15; // 3MB

        const { getRootProps, getInputProps, isDragActive } = useDropzone({
          autoFocus: false,
          onDrop,
          maxFiles: 1,
          maxSize: MAX_UPLOAD_SIZE,
        });

        function removeFile() {
          onChange(null);
        }

        const status = isDragActive || value ? "active" : "pending";
        return (
          <div
            {...getRootProps()}
            data-status={status}
            className="flex h-24 items-center justify-center border-2
            border-dashed border-border text-sm bg-transparent rounded-md overflow-hidden
            data-[status=active]:bg-zinc-500/20
            ">
            <input {...getInputProps({ name })} />
            {status === "pending" && (
              <div className="flex flex-col items-center gap-1.5">
                <Upload className=" size-5" />
                <p>Arraste seu arquivo aqui...</p>
              </div>
            )}
            {status === "active" && (
              <div className=" relative w-full h-full flex flex-col items-center justify-center gap-1.5 ">
                {isDragActive ? (
                  <p>Solte aqui...</p>
                ) : (
                  <>
                    <p className="text-center text-sm">
                      {value && value.name.length > 20
                        ? value?.name.substring(0, 20).concat("...")
                        : value.name}
                    </p>
                    <div className=" absolute top-1 right-1">
                      <Button
                        aria-label="remove file"
                        onClick={removeFile}
                        variant="outline"
                        size="sm"
                        className="text-xs h-4 bg-transparent rounded-full">
                        <X className="size-4" />
                        <span className="sr-only">Remover arquivo</span>
                      </Button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        );
      }}
    />
  );
};
