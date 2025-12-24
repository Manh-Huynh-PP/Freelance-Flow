"use client";

import React from "react";
import Link from "next/link";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { useEffect, useState } from "react";
import type { AppSettings } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FeedbackForm } from "@/components/feedback-form";
import { Mail, Github, MessageSquare } from "lucide-react";

export default function ContactPage() {
    const [language, setLanguage] = useState<"en" | "vi">("en");

    useEffect(() => {
        try {
            const storedSettings = localStorage.getItem("freelance-flow-settings");
            if (storedSettings) {
                const parsed: AppSettings = JSON.parse(storedSettings);
                if (parsed.language) setLanguage(parsed.language);
            }
        } catch { }
    }, []);

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <LandingHeader language={language} onLanguageChange={setLanguage} />
            <main className="container flex-1 px-4 md:px-6 py-10">
                <div className="max-w-3xl mx-auto space-y-8">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold font-headline">{language === "vi" ? "Liên hệ" : "Contact Us"}</h1>
                        <p className="text-muted-foreground mt-2">{language === "vi" ? "Chúng tôi rất muốn nghe từ bạn" : "We'd love to hear from you"}</p>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>{language === "vi" ? "Liên hệ" : "Get in Touch"}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-4">
                                {language === "vi"
                                    ? "Có phản hồi hoặc yêu cầu tính năng? Chúng tôi rất muốn nghe từ bạn."
                                    : "Have feedback or a feature request? We'd love to hear from you."}
                            </p>
                            <FeedbackForm language={language} />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>{language === "vi" ? "Các phương thức khác" : "Other Ways to Reach Us"}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-start gap-3">
                                <Github className="h-5 w-5 text-primary mt-0.5" />
                                <div>
                                    <h3 className="font-semibold">GitHub</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {language === "vi" ? "Báo cáo lỗi hoặc đóng góp tại" : "Report issues or contribute on"}{" "}
                                        <a
                                            href="https://github.com/manhhuynh-designer/Freelance-Flow"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-primary hover:underline"
                                        >
                                            GitHub Repository
                                        </a>
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <Mail className="h-5 w-5 text-primary mt-0.5" />
                                <div>
                                    <h3 className="font-semibold">Email</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {language === "vi" ? "Gửi email cho chúng tôi tại" : "Drop us a line at"}:{" "}
                                        <a
                                            href="mailto:admin@manhhuynh.work"
                                            className="text-primary hover:underline"
                                        >
                                            admin@manhhuynh.work
                                        </a>
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <MessageSquare className="h-5 w-5 text-primary mt-0.5" />
                                <div>
                                    <h3 className="font-semibold">{language === "vi" ? "Thảo luận" : "Discussions"}</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {language === "vi"
                                            ? "Tham gia thảo luận và chia sẻ ý tưởng trên trang GitHub Discussions của chúng tôi"
                                            : "Join discussions and share ideas on our GitHub Discussions page"}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="text-sm text-muted-foreground">
                        <Link className="hover:underline" href="/">{language === "vi" ? "Quay lại trang chủ" : "Back to Home"}</Link>
                    </div>
                </div>
            </main>
            <LandingFooter language={language} />
        </div>
    );
}
