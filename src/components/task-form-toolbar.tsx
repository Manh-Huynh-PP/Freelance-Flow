"use client";

import React, { useState, useTransition } from "react";
import { Calculator, Lightbulb, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calculator as CalculatorComponent } from "@/app/dashboard/widgets/calculator";
import { suggestQuoteAction } from "@/app/actions/ai-actions";
import { useToast } from "@/hooks/use-toast";
import { i18n } from "@/lib/i18n";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import type { AppSettings } from "@/lib/types";

type TaskFormToolbarProps = {
    settings: AppSettings;
    taskDescription?: string;
    taskCategory?: string;
    onApplySuggestion?: (items: Array<{ description: string; unitPrice: number }>) => void;
};

// Calculator Popover Tool
function CalculatorTool({ settings }: { settings: AppSettings }) {
    const [open, setOpen] = useState(false);
    const T = i18n[settings.language];

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <PopoverTrigger asChild>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 hover:bg-muted"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <Calculator className="h-4 w-4" />
                            </Button>
                        </PopoverTrigger>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                        <p>{T.simpleCalculator || "Máy tính"}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <PopoverContent
                className="w-auto p-0 border-none shadow-xl bg-transparent"
                align="start"
                side="top"
                sideOffset={8}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="bg-background border rounded-lg shadow-lg">
                    <CalculatorComponent settings={settings} />
                </div>
            </PopoverContent>
        </Popover>
    );
}

// Quote Suggestion Tool
function QuoteSuggestionTool({
    settings,
    taskDescription,
    taskCategory,
    onApplySuggestion,
}: {
    settings: AppSettings;
    taskDescription?: string;
    taskCategory?: string;
    onApplySuggestion?: (items: Array<{ description: string; unitPrice: number }>) => void;
}) {
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [suggestion, setSuggestion] = useState<Array<{ description: string; unitPrice: number }> | null>(null);
    const { toast } = useToast();
    const T = i18n[settings.language];

    const handleSuggestQuote = () => {
        if (!taskDescription || !taskCategory) {
            toast({
                variant: "destructive",
                title: T.missingInfo || "Thiếu thông tin",
                description: T.missingInfoDesc || "Vui lòng nhập mô tả và chọn danh mục trước.",
            });
            return;
        }

        const { preferredModelProvider, googleApiKey, openaiApiKey, googleModel, openaiModel } = settings;
        const apiKey = preferredModelProvider === 'google' ? googleApiKey : openaiApiKey;
        const modelName = preferredModelProvider === 'openai'
            ? (openaiModel || 'gpt-4o-mini')
            : (googleModel || 'gemini-1.5-flash');

        startTransition(async () => {
            try {
                const response = await suggestQuoteAction({
                    taskDescription,
                    taskCategory,
                    currency: settings.currency || 'VND',
                    language: settings.language || 'vi',
                    apiKey,
                    modelName
                });

                if (response.success && response.suggestedItems && response.suggestedItems.length > 0) {
                    setSuggestion(response.suggestedItems);
                } else {
                    setSuggestion(null);
                    toast({
                        variant: "destructive",
                        title: T.aiSuggestionFailed || "Gợi ý thất bại",
                        description: response.error || T.aiSuggestionFailedDesc,
                    });
                }
            } catch (error: any) {
                console.error("Failed to suggest quote:", error);
                toast({
                    variant: "destructive",
                    title: T.aiSuggestionFailed || "Gợi ý thất bại",
                    description: error.message,
                });
            }
        });
    };

    const handleApply = () => {
        if (suggestion && onApplySuggestion) {
            onApplySuggestion(suggestion);
            setSuggestion(null);
            setOpen(false);
        }
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <PopoverTrigger asChild>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 hover:bg-muted"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {isPending ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Lightbulb className="h-4 w-4" />
                                )}
                            </Button>
                        </PopoverTrigger>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                        <p>{T.suggestQuoteWithAI || "Gợi ý báo giá AI"}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <PopoverContent
                className="w-80"
                align="start"
                side="top"
                sideOffset={8}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h4 className="font-medium text-sm">{T.suggestQuoteWithAI || "Gợi ý báo giá AI"}</h4>
                    </div>

                    {!suggestion && !isPending && (
                        <div className="space-y-2">
                            <p className="text-xs text-muted-foreground">
                                {T.aiSuggestionDesc || "AI sẽ phân tích mô tả task và đề xuất các hạng mục báo giá phù hợp."}
                            </p>
                            <Button
                                size="sm"
                                className="w-full"
                                onClick={handleSuggestQuote}
                                disabled={!taskDescription || !taskCategory}
                            >
                                <Lightbulb className="h-4 w-4 mr-2" />
                                {T.getSuggestion || "Lấy gợi ý"}
                            </Button>
                            {(!taskDescription || !taskCategory) && (
                                <p className="text-xs text-destructive">
                                    {T.fillDescriptionFirst || "Vui lòng nhập mô tả và chọn danh mục trước."}
                                </p>
                            )}
                        </div>
                    )}

                    {isPending && (
                        <Card className="bg-secondary/50 border-dashed">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-center gap-3">
                                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                                    <div className="text-sm text-muted-foreground">
                                        <div className="font-medium">{T.gettingSuggestion || "Đang lấy gợi ý..."}</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {suggestion && suggestion.length > 0 && !isPending && (
                        <div className="space-y-3">
                            <Card className="bg-secondary/50">
                                <CardHeader className="p-3 pb-2">
                                    <CardTitle className="text-sm">{T.aiSuggestion || "Gợi ý từ AI"}</CardTitle>
                                </CardHeader>
                                <CardContent className="p-3 pt-0">
                                    <ul className="space-y-1 text-xs text-muted-foreground max-h-40 overflow-y-auto">
                                        {suggestion.map((item, index) => (
                                            <li key={index} className="flex justify-between items-center gap-2">
                                                <span className="flex-1 truncate">{item.description}</span>
                                                <span className="font-mono text-foreground whitespace-nowrap">
                                                    {item.unitPrice.toLocaleString()} {settings.currency}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>

                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button size="sm" className="w-full">
                                        {T.applySuggestion || "Áp dụng gợi ý"}
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>{T.applySuggestion}?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            {T.applySuggestionWarning || "Hành động này sẽ thay thế các hạng mục hiện tại."}
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>{T.cancel || "Hủy"}</AlertDialogCancel>
                                        <AlertDialogAction onClick={handleApply}>
                                            {T.confirmApply || "Xác nhận"}
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>

                            <Button
                                variant="outline"
                                size="sm"
                                className="w-full"
                                onClick={() => setSuggestion(null)}
                            >
                                {T.tryAgain || "Thử lại"}
                            </Button>
                        </div>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
}

// Fixed Toolbar Component
export function TaskFormToolbar({
    settings,
    taskDescription,
    taskCategory,
    onApplySuggestion,
}: TaskFormToolbarProps) {
    const T = i18n[settings.language];

    return (
        <div className="flex items-center gap-2 p-1 bg-muted/30 rounded-lg border border-border/50">
            <div className="text-[10px] uppercase font-bold text-muted-foreground px-2">
                Tools
            </div>
            <div className="h-4 w-px bg-border/50 mx-1" />

            <CalculatorTool settings={settings} />

            <QuoteSuggestionTool
                settings={settings}
                taskDescription={taskDescription}
                taskCategory={taskCategory}
                onApplySuggestion={onApplySuggestion}
            />
        </div>
    );
}
