"use client";

import React from "react";
import Link from "next/link";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { useEffect, useState } from "react";
import type { AppSettings } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacyPage() {
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
                        <h1 className="text-3xl md:text-4xl font-bold font-headline">
                            {language === "vi" ? "Chính sách Quyền riêng tư" : "Privacy Policy"}
                        </h1>
                        <p className="text-muted-foreground mt-2">
                            {language === "vi" ? "Cập nhật lần cuối" : "Last updated"}: 2025-12-14
                        </p>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>🛡️ {language === "vi" ? "Quyền riêng tư của bạn là ưu tiên hàng đầu" : "Your Privacy Matters"}</CardTitle>
                        </CardHeader>
                        <CardContent className="prose dark:prose-invert max-w-none space-y-6">
                            <p>
                                {language === "vi"
                                    ? "Freelance Flow tôn trọng quyền riêng tư của bạn và cam kết bảo vệ thông tin cá nhân của bạn. Chính sách này giải thích cách chúng tôi thu thập, sử dụng và bảo vệ dữ liệu của bạn."
                                    : "Freelance Flow respects your privacy and is committed to protecting your personal information. This policy explains how we collect, use, and safeguard your data."}
                            </p>

                            <div>
                                <h3 className="text-xl font-semibold mt-6 mb-3">🔐 {language === "vi" ? "Lưu trữ & Bảo mật Dữ liệu" : "Data Storage & Security"}</h3>
                                <p className="mb-2">
                                    {language === "vi"
                                        ? "Dữ liệu của bạn được lưu trữ an toàn trong tài khoản Supabase cá nhân của bạn. Tất cả các tác vụ, dự án, khách hàng và báo giá đều được mã hóa trong quá trình truyền tải và khi lưu trữ (at rest). Chúng tôi sử dụng các biện pháp bảo mật tiêu chuẩn ngành bao gồm:"
                                        : "Your data is securely stored in your personal Supabase account. All tasks, projects, clients, and quotes are encrypted in transit and at rest. We use industry-standard security practices including:"}
                                </p>
                                <ul className="list-disc pl-6 space-y-1">
                                    <li>{language === "vi" ? "Mã hóa HTTPS đầu cuối (End-to-end)." : "End-to-end HTTPS encryption."}</li>
                                    <li>{language === "vi" ? "Xác thực an toàn thông qua Supabase Auth." : "Secure authentication via Supabase Auth."}</li>
                                    <li>{language === "vi" ? "Chính sách bảo mật cấp hàng (Row-level security) để đảm bảo cô lập dữ liệu." : "Row-level security policies to ensure data isolation."}</li>
                                    <li>{language === "vi" ? "Mã hóa thông tin nhạy cảm của khách hàng (tên, email, số điện thoại)." : "Encrypted sensitive client information (names, emails, phone numbers)."}</li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold mt-6 mb-3">🔑 {language === "vi" ? "Xác thực" : "Authentication"}</h3>
                                <p>
                                    {language === "vi"
                                        ? "Chúng tôi sử dụng Supabase Authentication để xác thực người dùng an toàn. Khi bạn tạo tài khoản, email và mật khẩu của bạn được Supabase xử lý theo Chính sách quyền riêng tư của họ. Chúng tôi lưu trữ mã thông báo phiên (session tokens) một cách an toàn trong cookie trình duyệt."
                                        : "We use Supabase Authentication for secure user authentication. When you create an account, your email and password are handled by Supabase in accordance with their Privacy Policy. We store session tokens securely in browser cookies."}
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold mt-6 mb-3">📋 {language === "vi" ? "Dữ liệu Tác vụ & Báo giá" : "Task & Quote Data"}</h3>
                                <p>
                                    {language === "vi"
                                        ? "Ứng dụng xử lý dữ liệu liên quan đến tác vụ, dự án, khách hàng và báo giá của bạn. Hiện tại chúng tôi không hỗ trợ tính năng tải lên tệp tin (hình ảnh, video, tài liệu). Tất cả dữ liệu văn bản và cấu trúc được lưu trữ an toàn trong cơ sở dữ liệu."
                                        : "The application processes data related to your tasks, projects, clients, and quotes. We do not currently support file uploads (images, videos, documents). All text and structured data is stored securely in the database."}
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold mt-6 mb-3">🤝 {language === "vi" ? "Chia sẻ & Cộng tác" : "Sharing & Collaboration"}</h3>
                                <p>
                                    {language === "vi"
                                        ? "Khi bạn tạo liên kết chia sẻ cho các dự án hoặc tệp, bạn có quyền kiểm soát ai có thể truy cập chúng. Liên kết chia sẻ có thể được bảo vệ bằng mật khẩu và thiết lập ngày hết hạn. Chúng tôi theo dõi phân tích cơ bản về lượt xem chia sẻ (dấu thời gian, số lượt xem) nhưng không thu thập thông tin cá nhân về người xem."
                                        : "When you create share links for projects or files, you control who can access them. Share links can be password protected and set to expire. We track basic analytics on share views (timestamp, view count) but do not collect personal information about viewers."}
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold mt-6 mb-3">🤖 {language === "vi" ? "Tính năng AI" : "AI Features"}</h3>
                                <p>
                                    {language === "vi"
                                        ? "Các tính năng AI sử dụng API Gemini của Google thông qua một proxy phía máy chủ. Khi bạn sử dụng các tính năng AI, các câu lệnh (prompts) và dữ liệu tác vụ liên quan sẽ được gửi đến Google AI để xử lý. Chúng tôi không lưu trữ các yêu cầu hoặc phản hồi của AI. Bạn có thể tùy chọn cung cấp khóa API Google AI của riêng mình để truy cập trực tiếp."
                                        : "AI features use Google's Gemini API through a server-side proxy. When you use AI features, your prompts and relevant task data are sent to Google AI for processing. We do not store AI requests or responses. You can optionally provide your own Google AI API key for direct access."}
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold mt-6 mb-3">💾 {language === "vi" ? "Sao lưu & Xuất dữ liệu" : "Backups & Export"}</h3>
                                <p>
                                    {language === "vi"
                                        ? "Bạn có thể xuất dữ liệu của mình bất cứ lúc nào dưới định dạng JSON. Các bản sao lưu được lưu trực tiếp vào thiết bị của bạn. Bạn có toàn quyền kiểm soát và sở hữu dữ liệu của mình."
                                        : "You can export your data at any time in JSON format. Backups are saved directly to your device. You have full control and ownership of your data."}
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold mt-6 mb-3">📊 {language === "vi" ? "Phân tích" : "Analytics"}</h3>
                                <p>
                                    {language === "vi"
                                        ? "Chúng tôi sử dụng Vercel Analytics và Speed Insights để hiểu các mô hình sử dụng và cải thiện hiệu suất. Các dịch vụ này chỉ thu thập dữ liệu ẩn danh, tổng hợp. Không có thông tin nhận dạng cá nhân nào được theo dõi."
                                        : "We use Vercel Analytics and Speed Insights to understand usage patterns and improve performance. These services collect anonymous, aggregated data only. No personally identifiable information is tracked."}
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold mt-6 mb-3">🗑️ {language === "vi" ? "Lưu giữ Dữ liệu" : "Data Retention"}</h3>
                                <p>
                                    {language === "vi"
                                        ? "Dữ liệu của bạn vẫn nằm trong tài khoản Supabase cho đến khi bạn xóa nó. Bạn có thể xóa vĩnh viễn tất cả dữ liệu của mình thông qua trang Cài đặt. Dữ liệu đã xóa không thể phục hồi."
                                        : "Your data remains in your Supabase account until you delete it. You can permanently delete all your data through the Settings page. Deleted data cannot be recovered."}
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold mt-6 mb-3">⚖️ {language === "vi" ? "Quyền của Bạn" : "Your Rights"}</h3>
                                <p>
                                    {language === "vi"
                                        ? "Bạn có quyền truy cập, xuất, sửa đổi hoặc xóa dữ liệu của mình bất cứ lúc nào thông qua trang Cài đặt của ứng dụng hoặc bằng cách liên hệ với chúng tôi tại"
                                        : "You have the right to access, export, modify, or delete your data at any time through the app's Settings page or by contacting us at"}{" "}
                                    <a href="mailto:admin@manhhuynh.work" className="text-primary hover:underline">admin@manhhuynh.work</a>.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold mt-6 mb-3">🔄 {language === "vi" ? "Thay đổi Chính sách này" : "Changes to This Policy"}</h3>
                                <p>
                                    {language === "vi"
                                        ? "Chúng tôi có thể cập nhật chính sách quyền riêng tư này theo thời gian. Những thay đổi quan trọng sẽ được thông báo qua ứng dụng. Việc tiếp tục sử dụng sau khi có thay đổi đồng nghĩa với việc chấp nhận."
                                        : "We may update this privacy policy from time to time. Significant changes will be communicated through the app. Continued use after changes constitutes acceptance."}
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold mt-6 mb-3">📧 {language === "vi" ? "Liên hệ" : "Contact"}</h3>
                                <p>
                                    {language === "vi"
                                        ? "Đối với các câu hỏi hoặc thắc mắc liên quan đến quyền riêng tư, hãy liên hệ với chúng tôi tại"
                                        : "For privacy-related questions or concerns, contact us at"}{" "}
                                    <a href="mailto:admin@manhhuynh.work" className="text-primary hover:underline">admin@manhhuynh.work</a>
                                    {language === "vi" ? " hoặc thông qua " : " or through our "}
                                    <Link href="/contact" className="text-primary hover:underline">
                                        {language === "vi" ? "biểu mẫu liên hệ" : "contact form"}
                                    </Link>.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="text-sm text-muted-foreground">
                        <Link className="hover:underline" href="/">{language === "vi" ? "Quay lại Trang chủ" : "Back to Home"}</Link>
                    </div>
                </div>
            </main>
            <LandingFooter language={language} />
        </div>
    );
}
