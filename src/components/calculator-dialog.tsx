import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calculator as CalculatorComponent } from "@/app/dashboard/widgets/calculator";
import { AppSettings } from "@/lib/types";
import { Calculator, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";

import { i18n } from "@/lib/i18n";
import { DndContext, useDraggable, DragEndEvent } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

function DraggableCalculator({ settings }: { settings: AppSettings }) {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: 'calculator-popover',
    });

    const style = {
        transform: CSS.Translate.toString(transform),
    };

    return (
        <div ref={setNodeRef} style={style} className="w-[340px]">
            <div className="border rounded-lg shadow-lg bg-background">
                <div
                    className="flex items-center justify-between px-3 py-2 border-b cursor-move bg-muted/50"
                    {...listeners}
                    {...attributes}
                >
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Drag to move</span>
                </div>
                <CalculatorComponent settings={settings} />
            </div>
        </div>
    );
}

interface CalculatorDialogProps {
    settings: AppSettings;
    variant?: 'default' | 'floating';
}

export function CalculatorDialog({ settings, variant = 'default' }: CalculatorDialogProps) {
    const [open, setOpen] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [mounted, setMounted] = useState(false);
    const T = i18n[settings.language];
    const widgetConfig = settings.widgets?.find(w => w.id === 'calculator');

    useEffect(() => {
        setMounted(true);
    }, []);

    // if (widgetConfig && !widgetConfig.enabled) return null;

    const handleDragEnd = (event: DragEndEvent) => {
        const { delta } = event;
        setPosition((prev) => ({
            x: prev.x + delta.x,
            y: prev.y + delta.y,
        }));
    };

    const content = (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                {variant === 'floating' ? (
                    <Button
                        variant="secondary"
                        size="icon"
                        className="fixed bottom-6 right-6 h-12 w-12 rounded-full shadow-lg border ring-1 ring-background/50 hover:scale-105 transition-transform"
                        style={{ zIndex: 99999 }}
                        title={T.simpleCalculator}
                    >
                        <Calculator className="h-6 w-6" />
                    </Button>
                ) : (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        title={T.simpleCalculator}
                    >
                        <Calculator className="h-4 w-4" />
                    </Button>
                )}
            </PopoverTrigger>
            <PopoverContent
                className="w-auto p-0 border-none shadow-none bg-transparent m-2"
                align={variant === 'floating' ? "end" : "end"}
                side={variant === 'floating' ? "top" : "bottom"}
                style={{
                    transform: `translate(${position.x}px, ${position.y}px)`,
                }}
            >
                <DndContext onDragEnd={handleDragEnd}>
                    <DraggableCalculator settings={settings} />
                </DndContext>
            </PopoverContent>
        </Popover>
    );

    if (variant === 'floating' && mounted) {
        return createPortal(content, document.body);
    }

    return content;
}
