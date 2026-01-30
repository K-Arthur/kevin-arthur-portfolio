"use client";
import React, { useState } from 'react';
import { DndContext, useDraggable, useDroppable } from '@dnd-kit/core';
import { motion } from 'framer-motion';

function DraggableCard({ id }) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: id,
    });
    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 999
    } : undefined;

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className={`bg-card p-3 rounded-lg shadow-sm border border-border cursor-grab active:cursor-grabbing group touch-none ${isDragging ? 'shadow-2xl ring-2 ring-primary rotate-2 scale-105' : 'hover:border-primary/50'}`}
        >
            <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-bold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded">URGENT</span>
                <div className="flex -space-x-1">
                    <div className="w-4 h-4 rounded-full bg-gray-300 border border-white"></div>
                    <div className="w-4 h-4 rounded-full bg-gray-400 border border-white"></div>
                </div>
            </div>
            <p className="text-sm font-semibold text-foreground">Patient Case #8492</p>
            <p className="text-[10px] text-muted-foreground mt-1">Pending Radiologist Review</p>
        </div>
    );
}

function DroppableColumn({ id, children, title }) {
    const { isOver, setNodeRef } = useDroppable({
        id: id,
    });

    return (
        <div ref={setNodeRef} className={`flex-1 rounded-xl p-3 transition-colors duration-200 ${isOver ? 'bg-primary/10 ring-2 ring-primary/20' : 'bg-secondary/40'}`}>
            <div className="flex justify-between items-center mb-4 px-1">
                <h5 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{title}</h5>
                <span className="text-[10px] font-mono text-muted-foreground bg-background/50 px-1.5 rounded">{children ? 1 : 0}</span>
            </div>
            <div className="min-h-[120px] space-y-2">
                {children}
                {!children && <div className="h-full border-2 border-dashed border-border/50 rounded-lg opacity-50"></div>}
            </div>
        </div>
    );
}

export default function WorkflowDemo() {
    const [parent, setParent] = useState('Inbox');
    const draggableMarkup = <DraggableCard id="draggable" />;

    function handleDragEnd(event) {
        const { over } = event;
        if (over) {
            setParent(over.id);
        }
    }

    return (
        <div className="w-full max-w-3xl mx-auto my-12 pt-8 pb-4 px-4 bg-muted/10 border border-border/50 rounded-2xl select-none">
            <div className="text-center mb-8">
                <h4 className="font-bold text-base">Drag-and-Drop Workflow</h4>
                <p className="text-sm text-muted-foreground">Try moving the patient case between stages to see the fluid interaction.</p>
            </div>

            <DndContext onDragEnd={handleDragEnd}>
                <div className="flex gap-3 md:gap-6 overflow-x-auto pb-4">
                    {['Inbox', 'Analysis', 'Review'].map((id) => (
                        <DroppableColumn key={id} id={id} title={id}>
                            {parent === id ? draggableMarkup : null}
                        </DroppableColumn>
                    ))}
                </div>
            </DndContext>
        </div>
    );
}
