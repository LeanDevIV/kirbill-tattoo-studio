import { useState, useEffect } from "react";
import { Trash2, Eye, EyeOff } from "lucide-react";
import { api } from "@/lib/api";
import { ImageUploader } from "@/components/ImageUploader";

interface HeroImage {
  _id: string;
  imageUrl: string;
  order: number;
  isActive: boolean;
}

export function HomeAdminPage() {
  const [images, setImages] = useState<HeroImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchImages = async () => {
    try {
      const response = await api.get<{ images: HeroImage[] }>("/hero-images");
      setImages(response.images);
    } catch (error) {
      console.error("Failed to fetch images:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleUploadComplete = async (imageUrl: string) => {
    try {
      await api.post("/hero-images", { imageUrl, order: images.length });
      await fetchImages();
    } catch (error) {
      console.error("Failed to create image:", error);
    }
  };

  const handleToggleActive = async (imageId: string, currentActive: boolean) => {
    try {
      await api.put(`/hero-images/${imageId}`, { isActive: !currentActive });
      await fetchImages();
    } catch (error) {
      console.error("Failed to toggle image:", error);
    }
  };

  const handleDelete = async (imageId: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return;

    try {
      await api.delete(`/hero-images/${imageId}`);
      await fetchImages();
    } catch (error) {
      console.error("Failed to delete image:", error);
    }
  };

  if (isLoading) {
    return (
      <div>
        <h1 className="mb-6 text-3xl font-bold text-gradient">Home Admin</h1>
        <p className="text-muted">Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold text-gradient">Home Admin</h1>

      <div className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">Upload New Image</h2>
        <ImageUploader onUploadComplete={handleUploadComplete} />
      </div>

      <div>
        <h2 className="mb-4 text-xl font-semibold">Hero Images ({images.length})</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((image) => (
            <div key={image._id} className="glass overflow-hidden rounded-lg">
              <div className="aspect-video overflow-hidden">
                <img
                  src={image.imageUrl}
                  alt={`Hero image ${image.order}`}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex items-center justify-between p-4">
                <span className="text-sm text-muted">Order: {image.order}</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleToggleActive(image._id, image.isActive)}
                    className="rounded p-2 text-muted transition-colors hover:bg-surface hover:text-foreground"
                  >
                    {image.isActive ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(image._id)}
                    className="rounded p-2 text-muted transition-colors hover:bg-cardinal hover:text-foreground"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
