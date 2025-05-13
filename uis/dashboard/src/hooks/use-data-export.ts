import { useState, useCallback } from "react";

export interface ExportProgress {
  percentage: number;
  processed: number;
  total: number;
}

interface ExportOptions {
  endpoint: string;
  format: "xlsx" | "csv";
  chunkSize?: number;
  filename?: string;
  title?: string;
}

export function useDataExport() {
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState<ExportProgress>({
    percentage: 0,
    processed: 0,
    total: 0,
  });
  const [error, setError] = useState<string | null>(null);

  const getWorker = () => {
    const worker = new Worker(
      new URL("../workers/export-worker.ts?worker", import.meta.url),
      {
        type: "module",
      }
    );

    return worker;
  };

  const downloadFile = (data: ArrayBuffer, filename: string) => {
    const blob = new Blob([data], { type: "application/octet-stream" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 0);
  };

  const exportData = useCallback(async (options: ExportOptions) => {
    const {
      endpoint,
      format = "xlsx",
      chunkSize = 500,
      filename = `dados_exportados_${new Date().toISOString()}`,
      title = "Dados Exportados",
    } = options;

    setIsExporting(true);
    setProgress({ percentage: 0, processed: 0, total: 0 });
    setError(null);

    try {
      const worker = getWorker();
      worker.onmessage = (event) => {
        const { type, data } = event.data;
        switch (type) {
          case "progress":
            setProgress({
              percentage: Math.floor((data.processed / data.total) * 100),
              processed: data.processed,
              total: data.total,
            });
            break;

          case "complete":
            downloadFile(data.content, data.filename);
            setIsExporting(false);
            worker.terminate();
            break;
          case "error":
            setError(data.message);
            setIsExporting(false);
            worker.terminate();
            break;
        }
      };

      worker.onerror = (err) => {
        setError(`Error on worker: ${err.message}`);
        setIsExporting(false);
        worker.terminate();
      };

      worker.postMessage({
        type: "init",
        config: {
          format,
          chunkSize,
          filename,
          title,
        },
      });

      const controller = new AbortController();
      window.exportController = controller;

      const response = await fetch(endpoint, {
        method: "GET",
        credentials: "include",
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error status: ${response.status}`);
      }

      if (!response.body) {
        throw new Error("Stream response is empty");
      }

      response.body
        .pipeThrough(new TextDecoderStream())
        .pipeThrough(
          (() => {
            let buffer: string;
            return new TransformStream({
              start() {
                buffer = "";
              },
              transform(chunk, controller) {
                buffer += chunk;

                const lines = buffer.split("\n");
                buffer = lines.pop() || "";

                lines.forEach((line) => {
                  if (line.trim()) {
                    try {
                      controller.enqueue(JSON.parse(line));
                    } catch (e) {
                      console.error("Invalid JSON line:", line);
                    }
                  }
                });
              },
              flush(controller) {
                if (!buffer) return;
                if (buffer.trim()) {
                  try {
                    controller.enqueue(JSON.parse(buffer));
                  } catch (e) {
                    console.error("Invalid JSON line:", buffer);
                  }
                }
              },
            });
          })()
        )
        .pipeTo(
          new WritableStream({
            write(chunk) {
              worker.postMessage({ type: "process", data: chunk });
            },
            close() {
              worker.postMessage({ type: "finalize" });
            },
          })
        );
    } catch (err: any) {
      console.error("Error on export:", err);
      setError(err.message || "Error on export records");
      setIsExporting(false);
    }
  }, []);

  const cancelExport = useCallback(() => {
    if (window.exportController) {
      window.exportController.abort();
      delete window.exportController;
    }
    setIsExporting(false);
    setError("export canceled by user");
  }, []);

  return {
    exportData,
    cancelExport,
    isExporting,
    progress,
    error,
  };
}
