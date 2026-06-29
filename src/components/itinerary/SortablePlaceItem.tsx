"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { ItineraryItem } from "@/types/itinerary-item";

type SortablePlaceItemProps = {
  item: ItineraryItem;
  index: number;
  onDelete: (id: string) => void;
  isDeleting: boolean;
};

export function SortablePlaceItem({
  item,
  index,
  onDelete,
  isDeleting,
}: SortablePlaceItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`rounded-xl border bg-card p-4 shadow-sm ${
        isDragging ? "z-10 border-primary opacity-90 shadow-md" : "border-border"
      }`}
    >
      <div className="flex items-start gap-3">
        <button
          type="button"
          className="mt-0.5 cursor-grab rounded-md px-2 py-1 text-xs font-semibold text-primary active:cursor-grabbing"
          aria-label={`Kéo để sắp xếp ${item.title}`}
          {...attributes}
          {...listeners}
        >
          ⋮⋮
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sky-100 text-xs font-bold text-sky-700">
              {index + 1}
            </span>
            <h4 className="font-medium text-foreground">{item.title}</h4>
          </div>
          {item.location_name && (
            <p className="mt-1 text-sm text-muted">{item.location_name}</p>
          )}
          {item.notes && (
            <p className="mt-2 text-sm leading-relaxed text-muted">{item.notes}</p>
          )}
        </div>

        <button
          type="button"
          onClick={() => onDelete(item.id)}
          disabled={isDeleting}
          className="rounded-md px-2 py-1 text-xs text-muted transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
        >
          Xóa
        </button>
      </div>
    </div>
  );
}
