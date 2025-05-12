import { useState, useCallback } from "react";
import axios from "axios";

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
    const worker = new Worker("/workers/export-worker.ts");

    return worker;
  };
  const exportData = useCallback(async (options: ExportOptions) => {
    const {
      endpoint,
      format = "xlsx",
      chunkSize = 1000,
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

      const response = await axios.get(endpoint, {
        responseType: "text",
        withCredentials: true,
        onDownloadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const downloadPercentage = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            console.log(`Download: ${downloadPercentage}%`);
          }
        },
      });

      if (response.data) {
        const lines = response.data
          .split("\n")
          .filter((line: string) => line.trim());

        for (const line of lines) {
          try {
            const data = JSON.parse(line);
            worker.postMessage({ type: "process", data });
          } catch (e) {
            console.error("Erro on process line:", e);
          }
        }

        worker.postMessage({ type: "finalize" });
      }
    } catch (err: any) {
      console.error("Error on export:", err);
      setError(err.message || "Error on export records");
      setIsExporting(false);
    }
  }, []);

  const cancelExport = useCallback(() => {
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
