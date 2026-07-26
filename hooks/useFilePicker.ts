"use client";

import { useCallback, useState } from "react";

interface UseFilePickerOptions {
  /** mime types o extensiones: "image/*", ".pdf" */
  accept?: string;
  multiple?: boolean;
  /** abrir directamente la cámara en móvil */
  capture?: "user" | "environment";
  /** tamaño máximo por archivo, en bytes */
  maxSize?: number;
}

type PickerWindow = Window & {
  showOpenFilePicker?: (opts: unknown) => Promise<FileSystemFileHandle[]>;
  showSaveFilePicker?: (opts: unknown) => Promise<FileSystemFileHandle>;
};

/**
 * Elegir archivos usando File System Access API cuando existe (Chrome de
 * escritorio: devuelve handles y permite guardar) y un <input type="file">
 * invisible en el resto (iOS, Firefox, móviles).
 */
export function useFilePicker({ accept, multiple = false, capture, maxSize }: UseFilePickerOptions = {}) {
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);

  const validate = useCallback(
    (list: File[]) => {
      if (!maxSize) return list;
      const tooBig = list.filter((f) => f.size > maxSize);
      if (tooBig.length) setError(`«${tooBig[0].name}» supera el tamaño máximo.`);
      return list.filter((f) => f.size <= maxSize);
    },
    [maxSize],
  );

  const pick = useCallback(async (): Promise<File[]> => {
    setError(null);
    const w = window as PickerWindow;

    if (w.showOpenFilePicker && !capture) {
      try {
        const handles = await w.showOpenFilePicker({
          multiple,
          types: accept
            ? [{ description: "Archivos", accept: { [accept]: [] } }]
            : undefined,
        });
        const picked = validate(await Promise.all(handles.map((h) => h.getFile())));
        setFiles(picked);
        return picked;
      } catch {
        return []; // cancelado
      }
    }

    return new Promise((resolve) => {
      const input = document.createElement("input");
      input.type = "file";
      if (accept) input.accept = accept;
      if (multiple) input.multiple = true;
      if (capture) input.capture = capture;
      input.style.display = "none";
      input.onchange = () => {
        const picked = validate(Array.from(input.files ?? []));
        setFiles(picked);
        input.remove();
        resolve(picked);
      };
      document.body.appendChild(input);
      input.click();
    });
  }, [accept, capture, multiple, validate]);

  /** guarda un Blob: diálogo nativo si se puede, descarga si no */
  const save = useCallback(async (blob: Blob, suggestedName: string) => {
    const w = window as PickerWindow;
    if (w.showSaveFilePicker) {
      try {
        const handle = await w.showSaveFilePicker({ suggestedName });
        const writable = await (handle as FileSystemFileHandle & {
          createWritable: () => Promise<FileSystemWritableFileStream>;
        }).createWritable();
        await writable.write(blob);
        await writable.close();
        return true;
      } catch {
        return false;
      }
    }
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = suggestedName;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    return true;
  }, []);

  return { pick, save, files, error, clear: () => setFiles([]) };
}
