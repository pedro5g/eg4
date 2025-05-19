import { useCallback, useRef, useState } from "react";
import html2canvas from "html2canvas-pro";
import { jsPDF } from "jspdf";
import { Client } from "@/api/types";
import { InvoicePdfTemplate } from "@/components/invoice/invoice-pdf-template";
import ReactDOM from "react-dom";

export type TemplateProps = {
  invoice: {
    number: string;
    product: string;
    amount: string;
    issueDate: Date | string;
    dueDate: Date | string;
  };
  client: Client | null;
};

export const useGenPdf = ({ invoice, client }: TemplateProps) => {
  const [renderOnDOM, setRenderOnDOM] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handlerDownloadPdf = useCallback(async () => {
    setRenderOnDOM(true);
    await new Promise((resolve) => setTimeout(resolve, 100));

    const elementToPrint = containerRef.current;
    if (!elementToPrint || !client) return;

    const canvas = await html2canvas(elementToPrint, { scale: 2 });

    const data = canvas.toDataURL("image/png");
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: "a4",
    });

    const imgProps = doc.getImageProperties(data);
    const pdfWidth = doc.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    doc.addImage(data, "PNG", 0, 0, pdfWidth, pdfHeight);
    doc.save(`fatura-${invoice.number}.pdf`);
    setRenderOnDOM(false);
  }, [invoice.number, client]);

  const PdfTemplate = useCallback(() => {
    if (!client) return null;

    return (
      <InvoicePdfTemplate
        client={client}
        product={invoice.product}
        amount={invoice.amount}
        number={invoice.number}
        issueDate={invoice.issueDate}
        dueDate={invoice.dueDate}
      />
    );
  }, [invoice, client]);

  const PdfTemplateHidden = useCallback(() => {
    if (!renderOnDOM || !client) return null;

    const root = document.getElementById("pdf-root");
    if (!root) return null;

    return ReactDOM.createPortal(
      <div
        style={{ position: "absolute", left: "-9999px", top: 0 }}
        ref={containerRef}>
        <InvoicePdfTemplate
          view={"a4"}
          client={client}
          product={invoice.product}
          amount={invoice.amount}
          number={invoice.number}
          issueDate={invoice.issueDate}
          dueDate={invoice.dueDate}
        />
      </div>,
      root
    );
  }, [invoice, client]);

  return { handlerDownloadPdf, PdfTemplate, PdfTemplateHidden };
};
