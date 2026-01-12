"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  bucket?: string;
  folder?: string;
  placeholder?: string;
}

export function ImageUpload({
  value,
  onChange,
  bucket = "media",
  folder = "uploads",
  placeholder = "Drag and drop an image, or click to browse",
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be less than 5MB");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const supabase = createClient();
      
      // Generate unique filename
      const fileExt = file.name.split(".").pop();
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      // Upload to Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path);

      onChange(publicUrl);
    } catch (err) {
      console.error("Upload error:", err);
      setError(err instanceof Error ? err.message : "Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      uploadFile(file);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadFile(file);
    }
  };

  const handleRemove = () => {
    onChange("");
    setError(null);
  };

  if (value) {
    return (
      <div className="relative">
        <div className="relative aspect-video w-full max-w-md rounded-lg overflow-hidden bg-bg-secondary border border-white/10">
          <Image
            src={value}
            alt="Uploaded image"
            fill
            className="object-cover"
            onError={() => setError("Failed to load image")}
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 p-1.5 rounded-full bg-bg/80 text-text-secondary hover:text-error-light hover:bg-bg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <p className="text-text-muted text-xs mt-2 truncate max-w-md">{value}</p>
      </div>
    );
  }

  return (
    <div>
      <label
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          relative flex flex-col items-center justify-center w-full max-w-md aspect-video
          border-2 border-dashed rounded-lg cursor-pointer
          transition-colors duration-200
          ${isDragging 
            ? "border-gold bg-gold/10" 
            : "border-white/20 hover:border-white/40 bg-bg-secondary hover:bg-bg-tertiary"
          }
          ${isUploading ? "pointer-events-none opacity-60" : ""}
        `}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isUploading}
        />
        
        <div className="flex flex-col items-center justify-center p-6 text-center">
          {isUploading ? (
            <>
              <Loader2 className="w-10 h-10 text-gold animate-spin mb-3" />
              <p className="text-text-secondary text-sm">Uploading...</p>
            </>
          ) : (
            <>
              <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center mb-3">
                <Upload className="w-6 h-6 text-gold" />
              </div>
              <p className="text-text-secondary text-sm mb-1">{placeholder}</p>
              <p className="text-text-muted text-xs">PNG, JPG up to 5MB</p>
            </>
          )}
        </div>
      </label>

      {error && (
        <p className="text-error-light text-sm mt-2">{error}</p>
      )}

      {/* URL input as fallback */}
      <div className="mt-3">
        <p className="text-text-muted text-xs mb-1">Or paste an image URL:</p>
        <input
          type="text"
          className="input text-sm"
          placeholder="https://example.com/image.jpg"
          onChange={(e) => {
            if (e.target.value) onChange(e.target.value);
          }}
        />
      </div>
    </div>
  );
}
