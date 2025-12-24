"use client";
import React from "react";
import { pdf } from "@react-pdf/renderer";
import { ProjectReportPDF, ProjectReportPDFProps } from "@/components/pdf/ProjectReportPDF";

type ExportOptions = Omit<ProjectReportPDFProps, "includeQuote" | "includeTimeline"> & {
    includeQuote?: boolean;
    includeTimeline?: boolean;
    fileName?: string;
};

/**
 * Export a combined Quote + Timeline PDF and trigger download.
 */
export async function exportProjectReportToPdf(options: ExportOptions): Promise<void> {
    const {
        task,
        quote,
        milestones,
        settings,
        clients,
        categories,
        defaultColumns,
        calculationResults,
        calculateRowValue,
        grandTotal,
        hiddenColumnIds,
        showValidityNote,
        includeQuote = true,
        includeTimeline = true,
        viewMode = "week",
        fileName,
    } = options;

    // Create the PDF document element
    const doc = (
        <ProjectReportPDF
            task={task}
            quote={quote}
            milestones={milestones}
            settings={settings}
            clients={clients}
            categories={categories}
            defaultColumns={defaultColumns}
            calculationResults={calculationResults}
            calculateRowValue={calculateRowValue}
            grandTotal={grandTotal}
            hiddenColumnIds={hiddenColumnIds}
            showValidityNote={showValidityNote}
            includeQuote={includeQuote}
            includeTimeline={includeTimeline}
            viewMode={viewMode}
        />
    );

    // Generate PDF blob with explicit type
    const blob = await pdf(doc).toBlob();
    const pdfBlob = new Blob([blob], { type: 'application/pdf' });

    // Trigger download
    const url = URL.createObjectURL(pdfBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName || `project-report-${task?.id || "export"}.pdf`;
    link.setAttribute('download', link.download); // Ensure download attribute is set
    document.body.appendChild(link);
    link.click();

    // Cleanup
    setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }, 100);
}

export default exportProjectReportToPdf;
