"use client";

import { useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import type { BusinessLink } from "@/types";
import SortableLinkRow from "@/components/SortableLinkRow";
import AddLinkForm from "@/components/AddLinkForm";
import { reorderLinksAction } from "@/lib/actions/links";

export default function LinksManager({
  businessId,
  initialLinks,
}: {
  businessId: string;
  initialLinks: BusinessLink[];
}) {
  const [links, setLinks] = useState(initialLinks);

  useEffect(() => {
    setLinks(initialLinks);
  }, [initialLinks]);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = links.findIndex((l) => l.id === active.id);
    const newIndex = links.findIndex((l) => l.id === over.id);
    const newOrder = arrayMove(links, oldIndex, newIndex);
    setLinks(newOrder);
    await reorderLinksAction(businessId, newOrder.map((l) => l.id));
  }

  return (
    <div className="flex flex-col gap-6">
      <AddLinkForm businessId={businessId} />

      {links.length === 0 ? (
        <p className="text-center text-sm text-muted">
          Henüz bağlantı eklenmedi. Yukarıdan ilk bağlantınızı ekleyin.
        </p>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={links.map((l) => l.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="flex flex-col gap-2">
              {links.map((link) => (
                <SortableLinkRow key={link.id} link={link} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}
