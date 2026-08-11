import { useState } from "react";
import { Upload } from "lucide-react";
import { api } from "@/lib/api";

interface ImageUploaderProps {
  onUploadComplete: (imageUrl: string) => void;
}

export function ImageUploader({ onUploadComplete }: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      onUploadComplete(data.url);
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-surface p-8 transition-colors hover:border-cardinal">
        <Upload size={32} className="mb-2 text-muted" />
        <span className="text-sm text-muted">
          {isUploading ? "Uploading..." : "Click to upload image"}
        </span>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={isUploading}
          className="hidden"
        />
      </label>

      {preview && (
        <div className="relative aspect-video overflow-hidden rounded-lg">
          <img src={preview} alt="Preview" className="h-full w-full object-cover" />
        </div>
      )}
    </div>
  );
}
