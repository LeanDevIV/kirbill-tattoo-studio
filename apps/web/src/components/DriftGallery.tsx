import { useState, useEffect } from "react";
import { api } from "@/lib/api";

interface GalleryImage {
  _id: string;
  imageUrl: string;
  title: string;
  category: string;
}

export function DriftGallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await api.get<{ images: GalleryImage[] }>("/gallery");
        setImages(response.images);
      } catch (error) {
        console.error("Failed to fetch gallery images:", error);
      }
    };

    fetchImages();
  }, []);

  if (images.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted">No gallery images available</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 p-4 md:grid-cols-3 lg:grid-cols-4">
      {images.map((image) => (
        <div key={image._id} className="group relative aspect-square overflow-hidden rounded-lg">
          <img
            src={image.imageUrl}
            alt={image.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="text-lg font-semibold text-foreground">{image.title}</h3>
              <p className="text-sm text-muted">{image.category}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
