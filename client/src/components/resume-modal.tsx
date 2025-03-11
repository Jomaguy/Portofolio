import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Download } from "lucide-react";

interface ResumeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ResumeModal({ open, onOpenChange }: ResumeModalProps) {
  const handleDownload = () => {
    // Create a link element
    const link = document.createElement('a');
    link.href = "/Resume.pdf";
    link.download = "Jonathan_Mahrt_Guyou_Resume.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[90vw] md:max-w-[60vw] lg:max-w-[55vw] xl:max-w-[50vw] p-0 max-h-[90vh] h-[90vh] overflow-hidden bg-black">
        <div className="bg-black h-full flex flex-col">
          <DialogHeader className="flex flex-row items-center justify-between p-3 border-b bg-white">
            <DialogTitle className="text-xl font-bold tracking-tighter">Resume</DialogTitle>
            <Button 
              onClick={handleDownload} 
              className="flex items-center gap-1 rounded-full border-2 border-primary hover:bg-muted/50 h-8 px-3"
              size="sm"
            >
              <Download className="h-3 w-3 mr-1" />
              Download
            </Button>
          </DialogHeader>
          
          <div className="flex-1 w-full h-[calc(100%-50px)] bg-black flex items-center justify-center p-0">
            <iframe 
              src="/Resume.pdf#toolbar=0&navpanes=0&scrollbar=0&view=FitH"
              title="Resume"
              className="w-full h-full"
              style={{
                border: 'none',
                margin: 0,
                padding: 0,
                backgroundColor: 'black',
                display: 'block',
                transform: 'scale(0.95)',
                transformOrigin: 'center'
              }}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}