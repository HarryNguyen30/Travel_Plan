"use client";

import dynamic from "next/dynamic";
import { useMemo, useState, useTransition } from "react";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  type DragEndEvent,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { deleteItineraryItem, reorderItineraryItems } from "@/app/actions/itinerary-items";
import { formatPlanDayLabel } from "@/lib/plan-days";
import type { ItineraryItem } from "@/types/itinerary-item";
import type { TravelPlan } from "@/types/travel-plan";
import { AddPlacePanel } from "@/components/itinerary/AddPlacePanel";
import { SortablePlaceItem } from "@/components/itinerary/SortablePlaceItem";

const TripMap = dynamic(
  () => import("@/components/itinerary/TripMap").then((mod) => mod.TripMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full min-h-[360px] items-center justify-center rounded-2xl border border-border bg-slate-50 text-sm text-muted">
        Đang tải bản đồ...
      </div>
    ),
  }
);

type ItineraryPlannerProps = {
  plan: TravelPlan;
  initialItems: ItineraryItem[];
  dayDates: string[];
};

export function ItineraryPlanner({ plan, initialItems, dayDates }: ItineraryPlannerProps) {
  const [items, setItems] = useState(initialItems);
  const [selectedDay, setSelectedDay] = useState(dayDates[0] ?? plan.start_date);
  const [isDeleting, startDelete] = useTransition();
  const [isSavingOrder, startSaveOrder] = useTransition();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const dayItems = useMemo(
    () =>
      items
        .filter((item) => item.day_date === selectedDay)
        .sort((a, b) => a.sort_order - b.sort_order),
    [items, selectedDay]
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = dayItems.findIndex((item) => item.id === active.id);
    const newIndex = dayItems.findIndex((item) => item.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;

    const reordered = arrayMove(dayItems, oldIndex, newIndex).map((item, index) => ({
      ...item,
      sort_order: index,
    }));

    const otherItems = items.filter((item) => item.day_date !== selectedDay);
    setItems([...otherItems, ...reordered]);

    startSaveOrder(async () => {
      await reorderItineraryItems(
        plan.id,
        reordered.map((item, index) => ({
          id: item.id,
          day_date: selectedDay,
          sort_order: index,
        }))
      );
    });
  }

  function handleDelete(id: string) {
    startDelete(async () => {
      const result = await deleteItineraryItem(id, plan.id);
      if (result.success) {
        setItems((current) => current.filter((item) => item.id !== id));
      }
    });
  }

  function handleItemAdded(item: ItineraryItem) {
    setItems((current) => [...current, item]);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {dayDates.map((dayDate, index) => {
          const count = items.filter((item) => item.day_date === dayDate).length;
          const isActive = selectedDay === dayDate;

          return (
            <button
              key={dayDate}
              type="button"
              onClick={() => setSelectedDay(dayDate)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                isActive
                  ? "bg-primary text-white"
                  : "border border-border bg-card text-foreground hover:bg-slate-50"
              }`}
            >
              {formatPlanDayLabel(dayDate, index)}
              {count > 0 && (
                <span className={isActive ? "opacity-90" : "text-muted"}> ({count})</span>
              )}
            </button>
          );
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <div className="space-y-4">
          <AddPlacePanel
            planId={plan.id}
            dayDate={selectedDay}
            destination={plan.destination}
            onAdded={handleItemAdded}
          />

          <section className="rounded-2xl border border-border bg-card p-4 shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-foreground">Lịch trình trong ngày</h3>
                <p className="mt-1 text-xs text-muted">Kéo thả để sắp xếp thứ tự đi</p>
              </div>
              {isSavingOrder && (
                <span className="text-xs text-muted">Đang lưu...</span>
              )}
            </div>

            {dayItems.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border px-4 py-10 text-center">
                <p className="text-sm font-medium text-foreground">Chưa có địa điểm</p>
                <p className="mt-2 text-sm text-muted">
                  Tìm và thêm điểm tham quan để bắt đầu lên lịch.
                </p>
              </div>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={dayItems.map((item) => item.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-3">
                    {dayItems.map((item, index) => (
                      <SortablePlaceItem
                        key={item.id}
                        item={item}
                        index={index}
                        onDelete={handleDelete}
                        isDeleting={isDeleting}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}
          </section>
        </div>

        <section className="space-y-3">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Bản đồ lộ trình</h3>
            <p className="mt-1 text-xs text-muted">
              Các điểm được nối theo thứ tự trong ngày
            </p>
          </div>
          <TripMap items={dayItems} destination={plan.destination} />
        </section>
      </div>
    </div>
  );
}
