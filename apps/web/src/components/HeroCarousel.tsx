import { useState, useEffect } from "react";
import { api } from "@/lib/api";

interface HeroImage {
  _id: string;
  imageUrl: string;
  order: number;
  isActive: boolean;
}

export function HeroCarousel() {
  const [images, setImages] = useState<HeroImage[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await api.get<{ images: HeroImage[] }>("/hero-images");
        setImages(response.images);
      } catch (error) {
        console.error("Failed to fetch hero images:", error);
      }
    };

    fetchImages();
  }, []);

  useEffect(() => {
    if (images.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length]);

  if (images.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted">No images available</p>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full overflow-hidden">
      {images.map((image, index) => (
        <div
          key={image._id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={image.imageUrl}
            alt={`Hero slide ${index + 1}`}
            className="h-full w-full object-cover"
          />
        </div>
      ))}
    </div>
  );
}
