"use client";

import { useState, useRef } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Upload, X, Loader2, Image as ImageIcon, Sparkles, CheckCircle2, Plus, FileText } from "lucide-react";

interface MediaUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const MediaUploadModal = ({ isOpen, onClose, onSuccess }: MediaUploadModalProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<{ url: string; name: string; type: string }[]>([]);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length > 0) {
      const newFiles = [...files, ...selectedFiles];
      setFiles(newFiles);
      
      const newPreviews = selectedFiles.map(file => ({
        url: URL.createObjectURL(file),
        name: file.name,
        type: file.type
      }));
      setPreviews([...previews, ...newPreviews]);
      setStatus("idle");
    }
  };

  const removeFile = (index: number) => {
    const newFiles = [...files];
    const newPreviews = [...previews];
    
    // Revoke the URL to avoid memory leaks
    URL.revokeObjectURL(newPreviews[index].url);
    
    newFiles.splice(index, 1);
    newPreviews.splice(index, 1);
    
    setFiles(newFiles);
    setPreviews(newPreviews);
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    setIsUploading(true);
    
    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append("file", file);
      });
      
      const response = await fetch("/api/admin/media/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setStatus("success");
        setTimeout(() => {
          onSuccess();
          onClose();
          reset();
        }, 1500);
      } else {
        setStatus("error");
      }
    } catch (error) {
      console.error("Upload error:", error);
      setStatus("error");
    } finally {
      setIsUploading(false);
    }
  };

  const reset = () => {
    previews.forEach(p => URL.revokeObjectURL(p.url));
    setFiles([]);
    setPreviews([]);
    setStatus("idle");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl border-none p-0 overflow-hidden rounded-[32px] bg-white">
        <div style={{ padding: '48px' }} className="max-h-[90vh] overflow-y-auto custom-scrollbar flex flex-col">
          <DialogHeader className="mb-10 flex-shrink-0">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-[#FF6B4A]" />
              <span className="text-[10px] font-bold tracking-widest text-[#FF6B4A] uppercase">Media Engine</span>
            </div>
            <DialogTitle className="text-3xl font-premium font-extrabold text-gray-900 tracking-tight">
              Upload Assets
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col flex-1" style={{ gap: '40px' }}>
            {previews.length === 0 ? (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="group relative border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center hover:border-[#FF6B4A] hover:bg-[#FF6B4A]/[0.02] transition-all cursor-pointer flex-shrink-0"
                style={{ padding: '80px 48px', gap: '32px' }}
              >
                <div className="w-20 h-20 rounded-2xl bg-gray-50 flex items-center justify-center group-hover:scale-110 group-hover:bg-[#FF6B4A]/10 transition-all flex-shrink-0">
                  <Upload className="h-10 w-10 text-gray-400 group-hover:text-[#FF6B4A]" />
                </div>
                <div className="text-center flex-shrink-0">
                  <p className="text-lg font-bold text-gray-900">Drop files here or click to browse</p>
                  <p className="text-[11px] text-gray-400 mt-2 uppercase tracking-wider font-bold">Supports JPG, PNG, WEBP, PDF (Max 10MB)</p>
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileSelect} 
                  className="hidden" 
                  accept="image/*,.pdf"
                  multiple
                />
              </div>
            ) : (
              <div className="flex flex-col" style={{ gap: '24px' }}>
                <div className="grid grid-cols-3 gap-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar flex-shrink-0">
                  {previews.map((preview, index) => (
                    <div key={index} className="relative aspect-square rounded-2xl overflow-hidden border border-gray-100 bg-gray-50 group">
                      {preview.type === "application/pdf" ? (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 text-gray-400">
                          <FileText className="h-10 w-10 mb-2" />
                          <span className="text-[10px] font-bold uppercase truncate px-2 w-full text-center">{preview.name}</span>
                        </div>
                      ) : (
                        <img src={preview.url} alt={preview.name} className="w-full h-full object-cover" />
                      )}
                      <button 
                        onClick={() => removeFile(index)}
                        className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur rounded-lg text-gray-500 hover:text-red-500 shadow-sm transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-square rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-[#FF6B4A] hover:text-[#FF6B4A] hover:bg-[#FF6B4A]/[0.02] transition-all"
                  >
                    <Plus size={24} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Add More</span>
                  </button>
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileSelect} 
                  className="hidden" 
                  accept="image/*,.pdf"
                  multiple
                />
                
                {isUploading && (
                  <div className="flex items-center gap-4 p-4 bg-[#FF6B4A]/5 rounded-2xl border border-[#FF6B4A]/10 flex-shrink-0">
                    <Loader2 className="h-5 w-5 animate-spin text-[#FF6B4A]" />
                    <div className="flex-1">
                      <p className="text-xs font-bold text-gray-900 uppercase tracking-widest">Uploading {files.length} Assets</p>
                      <div className="mt-2 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-[#FF6B4A] animate-pulse" style={{ width: '60%' }} />
                      </div>
                    </div>
                  </div>
                )}

                {status === "success" && (
                  <div className="flex items-center gap-4 p-4 bg-green-50 rounded-2xl border border-green-100 text-green-600 flex-shrink-0">
                    <CheckCircle2 className="h-5 w-5" />
                    <p className="text-xs font-bold uppercase tracking-widest">Successfully Uploaded {files.length} Assets</p>
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-4 mt-auto flex-shrink-0">
              <button 
                type="button" 
                onClick={onClose}
                className="admin-btn admin-btn-outline flex-1 justify-center py-4"
              >
                Cancel
              </button>
              <button 
                type="button" 
                disabled={files.length === 0 || isUploading || status === "success"}
                onClick={handleUpload}
                className="admin-btn admin-btn-primary flex-1 justify-center py-4 font-extrabold tracking-widest"
              >
                {isUploading ? <Loader2 className="h-5 w-5 animate-spin" /> : `UPLOAD ${files.length > 0 ? files.length : ''} ASSETS`}
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
