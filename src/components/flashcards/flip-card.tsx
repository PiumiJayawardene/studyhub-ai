"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type FlipCardProps = {
  front: string;
  back: string;
  flipped: boolean;
  onFlip: () => void;
};

export function FlipCard({ front, back, flipped, onFlip }: FlipCardProps) {
  return (
    <div className="perspective-[1000px] w-full max-w-lg h-64" onClick={onFlip}>
      <div
        className={cn(
          "relative h-full w-full cursor-pointer transition-transform duration-500 [transform-style:preserve-3d]",
          flipped && "[transform:rotateY(180deg)]"
        )}
      >
        <div className="absolute inset-0 flex items-center justify-center rounded-xl border bg-card p-6 text-center text-lg font-medium [backface-visibility:hidden]">
          {front}
        </div>
        <div className="absolute inset-0 flex items-center justify-center rounded-xl border bg-muted p-6 text-center text-lg [backface-visibility:hidden] [transform:rotateY(180deg)]">
          {back}
        </div>
      </div>
    </div>
  );
}