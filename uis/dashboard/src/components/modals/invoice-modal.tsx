import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";

export const InvoiceModal = ({
  children,
  trigger,
}: {
  children: React.ReactNode;
  trigger: React.ReactNode;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent
        aria-describedby="Pdf da fatura"
        className="max-h-[600px] scroll-py-1 overflow-x-hidden overflow-y-auto p-0 rounded-none">
        <DialogTitle className="sr-only">
          Pre visualização da fatura
        </DialogTitle>
        {children}
      </DialogContent>
    </Dialog>
  );
};
