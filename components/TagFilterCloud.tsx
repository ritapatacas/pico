import { useState, useEffect } from "react";
import { X } from "lucide-react";

type TagFilterCloudProps = {
  allTags: string[];
  activeTags: string[];
  onAdd: (tag: string) => void;
};

export default function TagFilterCloud({ allTags, activeTags, onAdd }: TagFilterCloudProps) {
  const availableTags = allTags.filter(tag => !activeTags.includes(tag));

  return (
    <div className="flex flex-wrap gap-3">
      {availableTags.map(tag => (
        <button
          key={tag}
          onClick={() => onAdd(tag)}
          className="text-sm text-blue-700 underline hover:text-blue-900 transition"
        >
          {tag}
        </button>
      ))}
    </div>
  );
}