"use client";
import React from "react";
import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    Font,
} from "@react-pdf/renderer";
import type {
    Quote,
    Task,
    AppSettings,
    Client,
    Category,
    QuoteColumn,
    QuoteItem,
    ColumnCalculationType,
} from "@/lib/types";
import { format } from "date-fns";

// Register local Roboto fonts (Vietnamese support)
Font.register({
    family: "Roboto",
    fonts: [
        {
            src: "/Font/Roboto/static/Roboto-Regular.ttf",
            fontWeight: 400,
        },
        {
            src: "/Font/Roboto/static/Roboto-Bold.ttf",
            fontWeight: 700,
        },
    ],
});



const fallbackT = {
    sum: "Sum",
    average: "Average",
    min: "Min",
    max: "Max",
    customFormula: "Custom",
    groupCategory: "Category",
    startDate: "Start Date",
    deadline: "Deadline",
    unitPrice: "Unit Price",
    grandTotal: "Grand Total",
    client: "Client",
    quoteCode: "Quote ID",
    createdAt: "Created At",
    quoteValidityNote:
        "This quote is valid for 30 days from the issue date.",
} as const;

type Props = {
    quote: Quote;
    task: Task;
    settings: AppSettings;
    clients?: Client[];
    categories?: Category[];
    clientName?: string;
    categoryName?: string;
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
};

// Styles
const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontFamily: "Roboto",
        fontSize: 10,
        color: "#1e293b",
    },
    header: {
        marginBottom: 20,
        paddingBottom: 15,
        borderBottomWidth: 2,
        borderBottomColor: "#2563eb",
    },
    title: {
        fontSize: 24,
        fontWeight: 700,
        color: "#2563eb",
        marginBottom: 8,
    },
    clientName: {
        fontSize: 14,
        fontWeight: 700,
        marginBottom: 6,
    },
    infoRow: {
        flexDirection: "row",
        marginBottom: 4,
    },
    infoLabel: {
        fontWeight: 700,
        marginRight: 4,
    },
    infoValue: {
        color: "#475569",
    },
    section: {
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: 700,
        marginBottom: 6,
        paddingBottom: 4,
        borderBottomWidth: 1,
        borderBottomColor: "#e2e8f0",
    },
    table: {
        width: "100%",
    },
    tableHeader: {
        flexDirection: "row",
        backgroundColor: "#f1f5f9",
        borderBottomWidth: 1,
        borderBottomColor: "#cbd5e1",
        paddingVertical: 6,
        paddingHorizontal: 4,
    },
    tableRow: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "#e2e8f0",
        paddingVertical: 5,
        paddingHorizontal: 4,
    },
    tableRowAlt: {
        backgroundColor: "#f8fafc",
    },
    cellText: {
        flex: 1,
        paddingHorizontal: 2,
    },
    cellNumber: {
        flex: 1,
        paddingHorizontal: 2,
        textAlign: "right",
    },
    headerCell: {
        fontWeight: 700,
    },
    footer: {
        marginTop: 20,
        paddingTop: 15,
        borderTopWidth: 2,
        borderTopColor: "#cbd5e1",
        alignItems: "flex-end",
    },
    totalBox: {
        backgroundColor: "#2563eb",
        padding: 15,
        borderRadius: 4,
        alignItems: "center",
        minWidth: 200,
    },
    totalLabel: {
        fontSize: 10,
        fontWeight: 700,
        color: "#ffffff",
        marginBottom: 4,
    },
    totalValue: {
        fontSize: 18,
        fontWeight: 700,
        color: "#ffffff",
    },
    notes: {
        marginTop: 20,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: "#e2e8f0",
        textAlign: "center",
        fontSize: 8,
        color: "#6b7280",
    },
});

const formatNumber = (v: number | string, lang: string = "en-US") => {
    const n = Number(v) || 0;
    try {
        return n.toLocaleString(lang, {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        });
    } catch {
        return String(n.toFixed(0));
    }
};

const formatDate = (dateString?: string | Date | null) => {
    if (!dateString) return "-";
    try {
        const date =
            dateString instanceof Date ? dateString : new Date(dateString as any);
        if (isNaN(date.getTime())) return "-";
        return format(date, "MMM dd, yyyy");
    } catch {
        return "-";
    }
};

export const PDFQuote: React.FC<Props> = ({
    quote,
    task,
    settings,
    clients = [],
    categories = [],
    clientName,
    categoryName,
    defaultColumns = [],
    calculationResults = [],
    calculateRowValue,
    grandTotal = 0,
    hiddenColumnIds = [],
    showValidityNote = true,
}) => {
    if (!quote || !task || !settings) {
        return (
            <Document>
                <Page size="A4" style={styles.page}>
                    <Text>Error: Missing Data</Text>
                </Page>
            </Document>
        );
    }

    const currency = settings.currency || "USD";
    const lang = settings.language === "vi" ? "vi-VN" : "en-US";
    const T = { ...fallbackT } as typeof fallbackT & Record<string, string>;
    const primaryColor = settings.theme?.primary || "#2563eb";

    const currentClient = clients.find((c) => c.id === task.clientId);
    const currentCategory = categories.find((cat) => cat.id === task.categoryId);

    const safeCalculateRowValue =
        calculateRowValue ||
        ((item: QuoteItem, column: QuoteColumn) => {
            if (column.id === "unitPrice") return Number(item.unitPrice) || 0;
            return Number(item.customFields?.[column.id]) || 0;
        });

    const filterColumns = (cols: QuoteColumn[]) =>
        cols.filter((c) => !(hiddenColumnIds || []).includes(c.id));

    const columns = filterColumns(quote.columns || defaultColumns);

    // Calculate flex widths based on column type
    const getColumnFlex = (col: QuoteColumn) => {
        if (col.type === "number") return 0.8;
        if (col.id === "description") return 2;
        return 1;
    };

    return (
        <Page size="A4" style={styles.page}>
            {/* Header */}
            <View style={[styles.header, { borderBottomColor: primaryColor }]}>
                <Text style={[styles.title, { color: primaryColor }]}>{task.name}</Text>
                <Text style={styles.clientName}>
                    {clientName || currentClient?.name || T.client}
                </Text>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>{T.quoteCode}:</Text>
                    <Text style={styles.infoValue}>{quote.id || "N/A"}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>{T.createdAt}:</Text>
                    <Text style={styles.infoValue}>
                        {formatDate(task.createdAt || new Date().toISOString())}
                    </Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>{T.groupCategory}:</Text>
                    <Text style={styles.infoValue}>
                        {categoryName || currentCategory?.name || "-"}
                    </Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>{T.startDate}:</Text>
                    <Text style={styles.infoValue}>{formatDate(task.startDate)}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>{T.deadline}:</Text>
                    <Text style={styles.infoValue}>{formatDate(task.deadline)}</Text>
                </View>
            </View>

            {/* Sections */}
            {(quote.sections || []).map((section, sectionIndex) => (
                <View key={section.id || sectionIndex} style={styles.section}>
                    {section.name && (
                        <Text style={styles.sectionTitle}>{section.name}</Text>
                    )}
                    <View style={styles.table}>
                        {/* Table Header */}
                        <View style={styles.tableHeader}>
                            {columns.map((col) => (
                                <Text
                                    key={col.id}
                                    style={[
                                        col.type === "number" ? styles.cellNumber : styles.cellText,
                                        styles.headerCell,
                                        { flex: getColumnFlex(col) },
                                    ]}
                                >
                                    {col.id === "unitPrice"
                                        ? `${T.unitPrice} (${currency})`
                                        : col.name}
                                </Text>
                            ))}
                        </View>
                        {/* Table Rows */}
                        {section.items.map((item, index) => (
                            <View
                                key={item.id || index}
                                style={[
                                    styles.tableRow,
                                    index % 2 === 0 ? styles.tableRowAlt : {},
                                ]}
                            >
                                {columns.map((col) => {
                                    let displayValue: string | number = "";
                                    if (col.type === "number" && col.rowFormula) {
                                        displayValue = safeCalculateRowValue(
                                            item,
                                            col,
                                            quote.columns || defaultColumns
                                        );
                                    } else {
                                        const value =
                                            (item as any)[col.id] !== undefined
                                                ? (item as any)[col.id]
                                                : item.customFields?.[col.id];
                                        displayValue = value ?? "";
                                    }

                                    // Special handling for timeline column (which stores JSON)
                                    let formattedValue: string;
                                    if (col.id === 'timeline' && displayValue && typeof displayValue === 'string') {
                                        try {
                                            const timelineData = JSON.parse(displayValue);
                                            if (timelineData.start && timelineData.end) {
                                                formattedValue = `${formatDate(timelineData.start)} - ${formatDate(timelineData.end)}`;
                                            } else {
                                                formattedValue = '';
                                            }
                                        } catch {
                                            formattedValue = String(displayValue);
                                        }
                                    } else {
                                        formattedValue =
                                            col.type === "number"
                                                ? formatNumber(displayValue, lang)
                                                : String(displayValue);
                                    }

                                    return (
                                        <Text
                                            key={col.id}
                                            style={[
                                                col.type === "number"
                                                    ? styles.cellNumber
                                                    : styles.cellText,
                                                { flex: getColumnFlex(col) },
                                            ]}
                                        >
                                            {formattedValue}
                                        </Text>
                                    );
                                })}
                            </View>
                        ))}
                    </View>
                </View>
            ))}

            {/* Footer / Grand Total */}
            <View style={styles.footer}>
                <View style={[styles.totalBox, { backgroundColor: primaryColor }]}>
                    <Text style={styles.totalLabel}>{T.grandTotal}</Text>
                    <Text style={styles.totalValue}>
                        {formatNumber(grandTotal, lang)} {currency}
                    </Text>
                </View>
            </View>

            {/* Validity Note */}
            {showValidityNote && (
                <View style={styles.notes}>
                    <Text>{settings.quoteValidityNote || T.quoteValidityNote}</Text>
                </View>
            )}
        </Page>
    );
};

export default PDFQuote;
