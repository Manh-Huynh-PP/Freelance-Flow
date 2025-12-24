"use client";
import React from "react";
import { Document } from "@react-pdf/renderer";
import type {
    Quote,
    Task,
    AppSettings,
    Client,
    Category,
    QuoteColumn,
    QuoteItem,
    Milestone,
    ColumnCalculationType,
} from "@/lib/types";
import { PDFQuote } from "./PDFQuote";
import { PDFTimeline } from "./PDFTimeline";

export type ProjectReportPDFProps = {
    task: Task;
    quote?: Quote;
    milestones?: Milestone[];
    settings: AppSettings;
    clients?: Client[];
    categories?: Category[];
    defaultColumns?: QuoteColumn[];
    calculationResults?: Array<{
        id: string;
        name: string;
        calculation: string;
        result: number | string;
        type: ColumnCalculationType;
    }>;
    calculateRowValue?: (
        item: QuoteItem,
        column: QuoteColumn,
        allColumns: QuoteColumn[]
    ) => number;
    grandTotal?: number;
    hiddenColumnIds?: string[];
    showValidityNote?: boolean;
    // Options to include/exclude pages
    includeQuote?: boolean;
    includeTimeline?: boolean;
    viewMode?: "day" | "week" | "month";
};

/**
 * Main PDF Document component that combines Quote and Timeline pages.
 */
export const ProjectReportPDF: React.FC<ProjectReportPDFProps> = ({
    task,
    quote,
    milestones = [],
    settings,
    clients = [],
    categories = [],
    defaultColumns = [],
    calculationResults = [],
    calculateRowValue,
    grandTotal = 0,
    hiddenColumnIds = [],
    showValidityNote = true,
    includeQuote = true,
    includeTimeline = true,
    viewMode = "week",
}) => {
    return (
        <Document>
            {/* Page 1: Quote */}
            {includeQuote && quote && (
                <PDFQuote
                    quote={quote}
                    task={task}
                    settings={settings}
                    clients={clients}
                    categories={categories}
                    defaultColumns={defaultColumns}
                    calculationResults={calculationResults}
                    calculateRowValue={calculateRowValue}
                    grandTotal={grandTotal}
                    hiddenColumnIds={hiddenColumnIds}
                    showValidityNote={showValidityNote}
                />
            )}

            {/* Page 2+: Timeline */}
            {includeTimeline && (
                <PDFTimeline
                    task={task}
                    quote={quote}
                    milestones={milestones}
                    settings={settings}
                    clients={clients}
                    categories={categories}
                    viewMode={viewMode}
                />
            )}
        </Document>
    );
};

export default ProjectReportPDF;
