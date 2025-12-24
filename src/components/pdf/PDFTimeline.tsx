"use client";
import React from "react";
import {
    Page,
    Text,
    View,
    StyleSheet,
    Font,
} from "@react-pdf/renderer";
import type {
    Task,
    Quote,
    AppSettings,
    Milestone,
    Client,
    Category,
} from "@/lib/types";
import { format, addDays } from "date-fns";

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
    startDate: "Start Date",
    deadline: "Deadline",
    milestones: "Milestones",
    timeline: "Timeline",
} as const;

type Props = {
    task: Task;
    quote?: Quote;
    milestones?: Milestone[];
    settings: AppSettings;
    clients?: Client[];
    categories?: Category[];
    viewMode?: "day" | "week" | "month";
};

// Constants for PDF layout (in points, 1pt = 1/72 inch)
const SIDEBAR_WIDTH = 140;
const ROW_HEIGHT = 28; // Increased to fit 2-line text
const SECTION_ROW_HEIGHT = 18;
const HEADER_HEIGHT = 50;
const DATE_ROW_HEIGHT = 18;
const BAR_HEIGHT = 14;
const DAY_WIDTH = 12; // Reduced from 25pt to fit more days

const styles = StyleSheet.create({
    page: {
        padding: 15,
        fontFamily: "Roboto",
        fontSize: 7,
        color: "#1e293b",
    },
    header: {
        marginBottom: 15,
        paddingBottom: 10,
        borderBottomWidth: 2,
        borderBottomColor: "#2563eb",
    },
    title: {
        fontSize: 13,
        fontWeight: 700,
        color: "#2563eb",
        marginBottom: 3,
    },
    subtitle: {
        fontSize: 8,
        color: "#6b7280",
        marginBottom: 6,
    },
    infoRow: {
        flexDirection: "row",
        gap: 20,
        marginBottom: 4,
    },
    infoItem: {
        flexDirection: "row",
    },
    infoLabel: {
        fontWeight: 700,
        marginRight: 4,
    },
    infoValue: {
        color: "#6b7280",
    },
    content: {
        flexDirection: "row",
    },
    sidebar: {
        width: SIDEBAR_WIDTH,
        borderRightWidth: 1,
        borderRightColor: "#e5e7eb",
        paddingRight: 5,
    },
    sidebarHeader: {
        height: DATE_ROW_HEIGHT,
        justifyContent: "center",
        borderBottomWidth: 1,
        borderBottomColor: "#e5e7eb",
    },
    sidebarTitle: {
        fontSize: 7,
        fontWeight: 700,
        color: "#374151",
    },
    sidebarSectionRow: {
        height: SECTION_ROW_HEIGHT,
        justifyContent: "center",
        backgroundColor: "#f8fafc",
        borderBottomWidth: 1,
        borderBottomColor: "#e5e7eb",
        paddingLeft: 2,
    },
    sidebarSectionText: {
        fontSize: 7,
        fontWeight: 700,
        color: "#111827",
    },
    sidebarRow: {
        height: ROW_HEIGHT, // Fixed height for perfect alignment
        flexDirection: "row",
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: "#f3f4f6",
        paddingLeft: 8,
    },
    bullet: {
        width: 6,
        height: 6,
        borderRadius: 3,
        marginRight: 6,
    },
    milestoneLabel: {
        fontSize: 7,
        color: "#374151",
        maxWidth: SIDEBAR_WIDTH - 30,
    },
    milestoneDates: {
        fontSize: 6,
        color: "#9ca3af",
        marginTop: 1,
    },
    timelineArea: {
        flex: 1,
    },
    dateHeaderRow: {
        height: DATE_ROW_HEIGHT,
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "#e5e7eb",
        backgroundColor: "#f9fafb",
    },
    dateCell: {
        justifyContent: "center",
        alignItems: "center",
        borderRightWidth: 1,
        borderRightColor: "#e5e7eb",
    },
    dateCellText: {
        fontSize: 6,
        color: "#6b7280",
    },
    timelineRow: {
        height: ROW_HEIGHT, // Fixed height matching sidebarRow
        position: "relative",
        borderBottomWidth: 1,
        borderBottomColor: "#f3f4f6",
    },
    sectionTimelineRow: {
        height: SECTION_ROW_HEIGHT,
        backgroundColor: "#f8fafc",
        borderBottomWidth: 1,
        borderBottomColor: "#e5e7eb",
    },
    bar: {
        position: "absolute",
        height: BAR_HEIGHT,
        top: (ROW_HEIGHT - BAR_HEIGHT) / 2,
        borderRadius: 3,
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
    },
    barText: {
        fontSize: 6,
        color: "#ffffff",
        fontWeight: 700,
    },
    footer: {
        marginTop: 15,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: "#e5e7eb",
        fontSize: 7,
        color: "#9ca3af",
        textAlign: "center",
    },
});

// Date utilities
const MS_PER_DAY = 1000 * 60 * 60 * 24;

const getUtcTimestamp = (date: any): number => {
    if (!date) return NaN;
    if (date instanceof Date) {
        return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
    }
    const d = new Date(date);
    if (isNaN(d.getTime())) return NaN;
    return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
};

const getDayNumber = (timestamp: number): number => Math.floor(timestamp / MS_PER_DAY);

const dateToDayNum = (date: any): number | null => {
    if (!date) return null;
    const timestamp = getUtcTimestamp(date);
    if (isNaN(timestamp)) return null;
    return getDayNumber(timestamp);
};

const dayNumToFormat = (dayNum: number | null): string => {
    if (dayNum === null) return "-";
    const date = new Date(dayNum * MS_PER_DAY + new Date().getTimezoneOffset() * 60 * 1000);
    return format(date, "dd/MM"); // Date without year for compact display
};

export const PDFTimeline: React.FC<Props> = ({
    task,
    quote,
    milestones = [],
    settings,
    clients = [],
    categories = [],
    viewMode = "week",
}) => {
    if (!task || !settings) {
        return (
            <Page size="A4" orientation="landscape" style={styles.page}>
                <Text>Error: Missing Data</Text>
            </Page>
        );
    }

    const T = { ...fallbackT } as typeof fallbackT & Record<string, string>;
    const primaryColor = settings.theme?.primary || "#2563eb";

    const currentClient = clients.find((c) => c.id === task.clientId);
    const currentCategory = categories.find((cat) => cat.id === task.categoryId);

    // Get timeline range
    const taskStartDay = dateToDayNum(task.startDate);
    const taskEndDay = dateToDayNum(task.deadline);

    const startDay =
        taskStartDay !== null
            ? taskStartDay
            : dateToDayNum(new Date())!;
    const endDay =
        taskEndDay !== null
            ? taskEndDay
            : dateToDayNum(addDays(new Date(), 30))!;
    const totalDays = Math.max(1, endDay - startDay + 1);

    // Build rows
    type Row =
        | { type: "section"; id: string; name: string }
        | { type: "milestone"; id: string; name: string; milestone: Milestone | null };

    const buildRows = (): Row[] => {
        const rows: Row[] = [];
        const used = new Set<string>();

        const findMilestoneForItem = (
            sectionIndex: number,
            itemIndex: number,
            itemName?: string
        ): Milestone | null => {
            const sectionObj = (quote as any)?.sections?.[sectionIndex];
            const sectionId = sectionObj?.id || `section-${sectionIndex}`;
            const itemObj = sectionObj?.items?.[itemIndex];
            const itemId = itemObj?.id || `item-${itemIndex}`;
            const expectedId = `${sectionId}-${itemId}`;
            const byExactKey = milestones.find((m) => m.id === expectedId);
            if (byExactKey && !used.has(byExactKey.id)) return byExactKey;

            if (itemName) {
                const byName = milestones.find((m) => !used.has(m.id) && m.name === itemName);
                if (byName) return byName;
            }
            const any = milestones.find((m) => !used.has(m.id));
            return any || null;
        };

        if (quote?.sections && quote.sections.length > 0) {
            quote.sections.forEach((section, sIdx) => {
                const sectionId = section.id || `section-${sIdx}`;
                rows.push({
                    type: "section",
                    id: String(sectionId),
                    name: section.name || `Section ${sIdx + 1}`,
                });
                const items = section.items || [];
                items.forEach((item: any, iIdx: number) => {
                    const ms = findMilestoneForItem(sIdx, iIdx, item?.description);
                    if (ms) used.add(ms.id);
                    rows.push({
                        type: "milestone",
                        id: `${sectionId}-item-${iIdx}`,
                        name: item?.description || ms?.name || `Item ${iIdx + 1}`,
                        milestone: ms || null,
                    });
                });
            });
        } else {
            milestones.forEach((m, idx) => {
                rows.push({
                    type: "milestone",
                    id: m.id || `ms-${idx}`,
                    name: m.name,
                    milestone: m,
                });
            });
        }
        return rows;
    };

    const rows = buildRows();

    // INTELLIGENT AUTO-SCALING BASED ON CONTENT
    // Calculate optimal DAY_WIDTH based on number of days
    let dynamicDayWidth: number;
    if (totalDays <= 30) {
        dynamicDayWidth = 30; // Wide columns for short timelines
    } else if (totalDays <= 60) {
        dynamicDayWidth = 20;
    } else if (totalDays <= 90) {
        dynamicDayWidth = 15;
    } else {
        dynamicDayWidth = 12; // Narrower for long timelines
    }

    // Generate date headers - SHOW ALL DAYS
    const dateHeaders: { dayNum: number; label: string }[] = [];
    // Always show every day (interval = 1)
    for (let i = 0; i < totalDays; i++) {
        dateHeaders.push({
            dayNum: startDay + i,
            label: dayNumToFormat(startDay + i),
        });
    }

    const timelineWidth = totalDays * dynamicDayWidth;
    // Dynamic page width to fit all timeline content with proper margins
    const pageWidth = Math.max(842, SIDEBAR_WIDTH + timelineWidth + 60); // 842 = A4 landscape width, +60 for margins
    const pageHeight = 595; // A4 landscape height

    // Dynamic font size for date headers based on DAY_WIDTH
    const dateFontSize = Math.max(5, Math.min(7, dynamicDayWidth * 0.4));

    return (
        <Page size={[pageWidth, pageHeight]} style={styles.page}>
            {/* Header */}
            <View style={[styles.header, { borderBottomColor: primaryColor }]}>
                <Text style={[styles.title, { color: primaryColor }]}>
                    {task.name || "Timeline"}
                </Text>
                <Text style={styles.subtitle}>
                    {currentClient?.name || "Client"} • {currentCategory?.name || "Category"}
                </Text>
                <View style={styles.infoRow}>
                    <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>{T.startDate}:</Text>
                        <Text style={styles.infoValue}>
                            {taskStartDay !== null ? dayNumToFormat(taskStartDay) : "-"}
                        </Text>
                    </View>
                    <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>{T.deadline}:</Text>
                        <Text style={styles.infoValue}>
                            {taskEndDay !== null ? dayNumToFormat(taskEndDay) : "-"}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Content: Sidebar + Timeline */}
            <View style={styles.content}>
                {/* Sidebar */}
                <View style={styles.sidebar}>
                    <View style={styles.sidebarHeader}>
                        <Text style={styles.sidebarTitle}>
                            {T.milestones} ({milestones.length})
                        </Text>
                    </View>
                    {rows.map((row, i) =>
                        row.type === "section" ? (
                            <View key={`s-${row.id}`} style={styles.sidebarSectionRow}>
                                <Text style={styles.sidebarSectionText}>{row.name}</Text>
                            </View>
                        ) : (
                            <View key={`m-${row.id}`} style={styles.sidebarRow}>
                                <View
                                    style={[
                                        styles.bullet,
                                        { backgroundColor: row.milestone?.color || "#9ca3af" },
                                    ]}
                                />
                                <View>
                                    <Text style={styles.milestoneLabel}>
                                        {row.name}
                                    </Text>
                                    {row.milestone && (
                                        <Text style={styles.milestoneDates}>
                                            {row.milestone.startDate && row.milestone.endDate
                                                ? `${dayNumToFormat(dateToDayNum(row.milestone.startDate))} - ${dayNumToFormat(dateToDayNum(row.milestone.endDate))}`
                                                : row.milestone.startDate
                                                    ? dayNumToFormat(dateToDayNum(row.milestone.startDate))
                                                    : "-"}
                                        </Text>
                                    )}
                                </View>
                            </View>
                        )
                    )}
                </View>

                {/* Timeline Area */}
                <View style={[styles.timelineArea, { width: timelineWidth }]}>
                    {/* Date Headers */}
                    <View style={styles.dateHeaderRow}>
                        {dateHeaders.map((dh, i) => (
                            <View
                                key={i}
                                style={[
                                    styles.dateCell,
                                    { width: dynamicDayWidth }, // Dynamic width based on timeline length
                                ]}
                            >
                                <Text style={[styles.dateCellText, { fontSize: dateFontSize }]}>{dh.label}</Text>
                            </View>
                        ))}
                    </View>

                    {/* Timeline Rows */}
                    {rows.map((row, i) =>
                        row.type === "section" ? (
                            <View key={`tr-s-${row.id}`} style={styles.sectionTimelineRow} />
                        ) : (
                            <View key={`tr-m-${row.id}`} style={styles.timelineRow}>
                                {row.milestone && (() => {
                                    const msStartDay = dateToDayNum(row.milestone.startDate);
                                    const msEndDay =
                                        dateToDayNum(row.milestone.endDate) || msStartDay;
                                    if (msStartDay === null) return null;

                                    const left = (msStartDay - startDay) * dynamicDayWidth;
                                    const width = Math.max(
                                        dynamicDayWidth, // Minimum width = 1 day
                                        ((msEndDay || msStartDay) - msStartDay + 1) * dynamicDayWidth
                                    );

                                    return (
                                        <View
                                            style={[
                                                styles.bar,
                                                {
                                                    left,
                                                    width,
                                                    backgroundColor: row.milestone.color || primaryColor,
                                                },
                                            ]}
                                        >
                                            <Text style={styles.barText}>
                                                {row.milestone.name}
                                            </Text>
                                        </View>
                                    );
                                })()}
                            </View>
                        )
                    )}
                </View>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
                <Text>Exported on {format(new Date(), "dd/MM/yyyy HH:mm")} • Freelance Flow</Text>
            </View>
        </Page>
    );
};

export default PDFTimeline;
