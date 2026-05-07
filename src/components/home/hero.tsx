"use client";

import { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import Image from "next/image";

const slides = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=1600&q=80",
    alt: "Person typing on laptop",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=1600&q=80",
    alt: "Person printing a document",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=1600&q=80",
    alt: "Person photocopying",
  },
  {
    id: 4,
    image:
      "https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=1600&q=80",
    alt: "Photographer taking passport photo",
  },
];

export default function Hero() {
  const [emblaRef] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 5000, stopOnInteraction: false }),
  ]);

  return (
    <section id="home" className="relative h-screen min-h-150">
      {/* Slideshow */}
      <div className="h-full overflow-hidden" ref={emblaRef}>
        <div className="flex h-full">
          {slides.map((slide) => (
            <div key={slide.id} className="relative flex-none w-full h-full">
              <Image
                src={slide.image}
                alt={slide.alt}
                className="w-full h-full object-cover"
                fill={true}
              />
              {/* Dark overlay */}
              <div className="absolute inset-0 bg-black/50" />
            </div>
          ))}
        </div>
      </div>

      {/* Hero Content */}
      <div className="absolute inset-0 flex justify-center items-center px-6 text-center">
        <div className="max-w-3xl">
          <h1 className="font-bold text-white text-4xl md:text-6xl leading-tight">
            Print Smarter, <span className="text-slate-300">Not Harder</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-white/80 text-lg md:text-xl">
            Upload your documents from anywhere, queue them for printing, and
            pick them up ready. Fast, private, and secure.
          </p>
          <div className="flex flex-wrap justify-center items-center gap-4 mt-8">
            <Button
              size="lg"
              asChild
              className="bg-white hover:bg-white/90 text-slate-900 hover:text-white"
            >
              <Link href="/sign-up">Get Started</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="gap-2 hover:bg-white/20 border-white/50 text-slate-800 hover:text-slate-900"
            >
              <Play className="w-4 h-4" />
              Watch Demo
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
