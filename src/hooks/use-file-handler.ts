"use client";

import { useState, useCallback } from "react";
import { MAX_FILE_SIZE_BYTES, MAX_FILE_SIZE_MB } from "@/lib/constants";

interface FileHandlerState {
  file: File | null;
  error: string | null;
  isDragging: boolean;
}

export function useFileHandler() {
  const [state, setState] = useState<FileHandlerState>({
    file: null,
    error: null,
    isDragging: false,
  });

  const validateFile = useCallback((file: File): string | null => {
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return `File too large. Maximum size is ${MAX_FILE_SIZE_MB}MB.`;
    }
    return null;
  }, []);

  const handleFile = useCallback(
    (file: File) => {
      const error = validateFile(file);
      if (error) {
        setState((prev) => ({ ...prev, file: null, error }));
        return;
      }
      setState({ file, error: null, isDragging: false });
    },
    [validateFile]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setState((prev) => ({ ...prev, isDragging: false }));

      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile) handleFile(droppedFile);
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setState((prev) => ({ ...prev, isDragging: true }));
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setState((prev) => ({ ...prev, isDragging: false }));
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0];
      if (selectedFile) handleFile(selectedFile);
    },
    [handleFile]
  );

  const clearFile = useCallback(() => {
    setState({ file: null, error: null, isDragging: false });
  }, []);

  return {
    ...state,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    handleInputChange,
    clearFile,
  };
}
