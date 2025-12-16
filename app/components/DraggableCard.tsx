"use client";

import { useState } from "react";

interface DraggableCardProps {
  id: string;
  title: string;
  value: string | number;
  isLocked: boolean;
  onDragStart: (id: string) => void;
  onDragEnd: () => void;
  onDrop: (id: string) => void;
  children?: React.ReactNode;
}

export default function DraggableCard({
  id,
  title,
  value,
  isLocked,
  onDragStart,
  onDragEnd,
  onDrop,
  children,
}: DraggableCardProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    if (isLocked) {
      e.preventDefault();
      return;
    }
    setIsDragging(true);
    onDragStart(id);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", id);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    onDragEnd();
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (isLocked) return;
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent) => {
    if (isLocked) return;
    e.preventDefault();
    e.stopPropagation();
    const draggedId = e.dataTransfer.getData("text/plain");
    if (draggedId && draggedId !== id) {
      onDrop(draggedId);
    }
  };

  return (
    <div
      draggable={!isLocked}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={`bg-white dark:bg-zinc-900 rounded-lg shadow p-6 transition-all ${
        isDragging ? "opacity-50 scale-95" : ""
      } ${!isLocked ? "cursor-move hover:shadow-lg" : "cursor-default"}`}
    >
      <h3 className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">
        {title}
      </h3>
      {children || <p className="text-3xl font-bold text-black dark:text-white">{value}</p>}
    </div>
  );
}

