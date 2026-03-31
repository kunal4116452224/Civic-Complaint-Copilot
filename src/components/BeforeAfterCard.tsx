"use client";

import Image from "next/image";
import { useRef, useState, type ReactNode } from "react";
import { motion } from "framer-motion";

interface BeforeAfterCardProps {
  beforeLabel: string;
  afterLabel: string;
  beforeImage?: string;
  afterImage?: string;
  beforeAlt?: string;
  afterAlt?: string;
  beforeContent?: ReactNode;
  afterContent?: ReactNode;
  className?: string;
  initialPosition?: number;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function BeforeAfterCard({
  beforeLabel,
  afterLabel,
  beforeImage,
  afterImage,
  beforeAlt = "Before",
  afterAlt = "After",
  beforeContent,
  afterContent,
  className = "",
  initialPosition = 50,
}: BeforeAfterCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(clamp(initialPosition, 0, 100));
  const [isDragging, setIsDragging] = useState(false);

  const isContentComparison = !beforeImage && !afterImage;

  const setPositionFromClientX = (clientX: number) => {
    const bounds = containerRef.current?.getBoundingClientRect();
    if (!bounds) return;
    const next = ((clientX - bounds.left) / bounds.width) * 100;
    setPosition(clamp(next, 0, 100));
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
    setPositionFromClientX(event.clientX);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setPositionFromClientX(event.clientX);
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(false);
    event.currentTarget.releasePointerCapture(event.pointerId);
  };

  const beforeLayer = beforeImage ? (
    <Image src={beforeImage} alt={beforeAlt} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 60vw" />
  ) : (
    <div className="h-full w-full bg-slate-950">{beforeContent}</div>
  );

  const afterLayer = afterImage ? (
    <Image src={afterImage} alt={afterAlt} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 60vw" />
  ) : (
    <div className="h-full w-full bg-slate-950">{afterContent}</div>
  );

  return (
    <div className={`relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900 ${className}`}>
      <motion.div
        ref={containerRef}
        className={`relative w-full select-none touch-none ${isContentComparison ? "h-auto" : "aspect-[16/10]"}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        animate={isDragging ? { scale: 0.998 } : { scale: 1 }}
        transition={{ duration: 0.15 }}
      >
        {isContentComparison ? (
          <>
            <div className="grid">
              <div className="[grid-area:1/1]">{beforeLayer}</div>
              <div
                className="[grid-area:1/1] overflow-hidden"
                style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
              >
                {afterLayer}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="absolute inset-0">{beforeLayer}</div>
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
            >
              {afterLayer}
            </div>
          </>
        )}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/15" />

        <span className="absolute left-3 top-3 rounded-md bg-black/65 px-2 py-1 text-[10px] font-semibold tracking-wide text-white">
          {beforeLabel}
        </span>
        <span className="absolute right-3 top-3 rounded-md bg-black/65 px-2 py-1 text-[10px] font-semibold tracking-wide text-white">
          {afterLabel}
        </span>

        <div
          className="pointer-events-none absolute top-0 h-full"
          style={{ left: `${position}%`, transform: "translateX(-50%)" }}
        >
          <div className="h-full w-[2px] bg-white/85 shadow-[0_0_20px_rgba(255,255,255,0.6)]" />
          <div className="absolute left-1/2 top-1/2 h-9 w-9 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/80 bg-black/70 backdrop-blur-md">
            <div className="absolute inset-0 m-auto h-3 w-3 rounded-full bg-white" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
