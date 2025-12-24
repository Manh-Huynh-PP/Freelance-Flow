"use client";

import React from "react";
import Link from "next/link";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { useEffect, useState } from "react";
import type { AppSettings } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FeedbackForm } from "@/components/feedback-form";

export default function TermsPage() {
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
              {language === "vi" ? "Điều khoản Dịch vụ" : "Terms of Service"}
            </h1>
            <p className="text-muted-foreground mt-2">
              {language === "vi" ? "Cập nhật lần cuối" : "Last updated"}: 2025-12-14
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>📝 {language === "vi" ? "Tổng quan" : "Overview"}</CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none space-y-6">
              <p>
                {language === "vi"
                  ? "Bằng cách truy cập và sử dụng Freelance Flow, bạn đồng ý tuân thủ các Điều khoản Dịch vụ này. Vui lòng đọc kỹ chúng."
                  : "By accessing and using Freelance Flow, you agree to be bound by these Terms of Service. Please read them carefully."}
              </p>

              <div>
                <h3 className="text-xl font-semibold mt-6 mb-3">💻 {language === "vi" ? "Mô tả Dịch vụ" : "Service Description"}</h3>
                <p>
                  {language === "vi"
                    ? "Freelance Flow là nền tảng quản lý dự án dựa trên đám mây dành cho freelancer, sử dụng Supabase để xác thực và cơ sở dữ liệu. Dịch vụ bao gồm quản lý tác vụ, theo dõi khách hàng, các tính năng hỗ trợ AI và công cụ cộng tác."
                    : "Freelance Flow is a cloud-based project management platform for freelancers, utilizing Supabase for authentication and database. The service includes task management, client tracking, AI-powered features, and collaboration tools."}
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mt-6 mb-3">👤 {language === "vi" ? "Đăng ký Tài khoản" : "Account Registration"}</h3>
                <p>
                  {language === "vi"
                    ? "Để sử dụng Freelance Flow, bạn phải tạo tài khoản bằng địa chỉ email hợp lệ. Bạn chịu trách nhiệm duy trì bảo mật thông tin đăng nhập tài khoản của mình và cho tất cả các hoạt động xảy ra dưới tài khoản của bạn."
                    : "To use Freelance Flow, you must create an account with a valid email address. You are responsible for maintaining the security of your account credentials and for all activities that occur under your account."}
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mt-6 mb-3">👑 {language === "vi" ? "Quyền sở hữu & Sử dụng Dữ liệu" : "Data Ownership & Usage"}</h3>
                <p>
                  {language === "vi"
                    ? "Bạn giữ toàn quyền sở hữu đối với tất cả dữ liệu bạn tạo trên Freelance Flow, bao gồm các tác vụ, dự án và thông tin khách hàng. Chúng tôi không yêu cầu bất kỳ quyền nào đối với nội dung của bạn. Dữ liệu của bạn được lưu trữ an toàn trong Supabase và chỉ có thể truy cập bởi bạn."
                    : "You retain full ownership of all data you create on Freelance Flow, including tasks, projects, and client information. We do not claim any rights to your content. Your data is stored securely in Supabase and is only accessible by you."}
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mt-6 mb-3">� {language === "vi" ? "Nội dung người dùng" : "User Content"}</h3>
                <p>
                  {language === "vi"
                    ? "Bạn chịu trách nhiệm về tính chính xác và hợp pháp của nội dung văn bản (tác vụ, báo giá, thông tin khách hàng) bạn nhập vào hệ thống. Chúng tôi bảo lưu quyền xóa các nội dung vi phạm điều khoản sử dụng hoặc pháp luật hiện hành."
                    : "You are responsible for the accuracy and legality of the text content (tasks, quotes, client info) you enter into the system. We reserve the right to remove content that violates these terms or applicable laws."}
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mt-6 mb-3">🧠 {language === "vi" ? "Tính năng AI" : "AI Features"}</h3>
                <p>
                  {language === "vi"
                    ? "Các tính năng AI được cung cấp bởi API Gemini của Google. Bằng cách sử dụng các tính năng AI, bạn thừa nhận rằng các câu lệnh và dữ liệu liên quan của bạn sẽ được gửi đến Google AI để xử lý. Chúng tôi không lưu trữ các yêu cầu hoặc phản hồi của AI. Xem điều khoản AI của Google để biết thêm thông tin."
                    : "AI features are powered by Google's Gemini API. By using AI features, you acknowledge that your prompts and relevant data will be sent to Google AI for processing. We do not store AI requests or responses. See Google's AI terms for more information."}
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mt-6 mb-3">🚫 {language === "vi" ? "Sử dụng Hợp lệ" : "Acceptable Use"}</h3>
                <p>
                  {language === "vi"
                    ? "Bạn đồng ý không sử dụng Freelance Flow cho bất kỳ mục đích bất hợp pháp nào hoặc theo bất kỳ cách nào có thể gây hại, vô hiệu hóa hoặc làm suy giảm dịch vụ. Các hoạt động bị cấm bao gồm (nhưng không giới hạn): tải lên các tệp độc hại, cố gắng truy cập trái phép, hoặc sử dụng dịch vụ để lưu trữ hoặc chia sẻ nội dung bất hợp pháp."
                    : "You agree not to use Freelance Flow for any unlawful purpose or in any way that could damage, disable, or impair the service. Prohibited activities include (but are not limited to): uploading malicious files, attempting unauthorized access, or using the service to store or share illegal content."}
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mt-6 mb-3">⚡ {language === "vi" ? "Tính khả dụng của Dịch vụ" : "Service Availability"}</h3>
                <p>
                  {language === "vi"
                    ? "Chúng tôi cố gắng cung cấp dịch vụ đáng tin cậy nhưng không đảm bảo thời gian hoạt động 100%. Dịch vụ có thể tạm thời không khả dụng để bảo trì hoặc do các trường hợp nằm ngoài tầm kiểm soát của chúng tôi. Chúng tôi không chịu trách nhiệm cho bất kỳ thiệt hại nào do gián đoạn dịch vụ."
                    : "We strive to provide reliable service but do not guarantee 100% uptime. The service may be temporarily unavailable for maintenance or due to circumstances beyond our control. We are not liable for any damages resulting from service interruptions."}
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mt-6 mb-3">⚠️ {language === "vi" ? "Không bảo đảm" : "No Warranty"}</h3>
                <p>
                  {language === "vi"
                    ? "Freelance Flow được cung cấp \"nguyên trạng\" (\"as is\") mà không có bất kỳ bảo đảm nào, dù rõ ràng hay ngụ ý, bao gồm nhưng không giới hạn ở các bảo đảm về khả năng bán được, sự phù hợp cho một mục đích cụ thể hoặc không vi phạm. Bạn tự chịu rủi ro khi sử dụng."
                    : "Freelance Flow is provided \"as is\" without warranties of any kind, either express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, or non-infringement. Use at your own risk."}
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mt-6 mb-3">📉 {language === "vi" ? "Giới hạn Trách nhiệm" : "Limitation of Liability"}</h3>
                <p>
                  {language === "vi"
                    ? "Trong mọi trường hợp, Freelance Flow, các nhà phát triển hoặc người đóng góp của nó sẽ không chịu trách nhiệm cho bất kỳ thiệt hại gián tiếp, ngẫu nhiên, đặc biệt, do hậu quả hoặc trừng phạt nào, hoặc bất kỳ tổn thất nào về lợi nhuận hoặc doanh thu, cho dù phát sinh trực tiếp hay gián tiếp, hoặc bất kỳ tổn thất nào về dữ liệu, việc sử dụng, thiện chí hoặc các tổn thất vô hình khác do việc bạn sử dụng dịch vụ."
                    : "In no event shall Freelance Flow, its developers, or contributors be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from your use of the service."}
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mt-6 mb-3">💾 {language === "vi" ? "Sao lưu Dữ liệu" : "Data Backup"}</h3>
                <p>
                  {language === "vi"
                    ? "Mặc dù chúng tôi thực hiện các quy trình sao lưu hợp lý, bạn hoàn toàn chịu trách nhiệm duy trì các bản sao lưu dữ liệu của riêng mình. Chúng tôi khuyên bạn nên thường xuyên xuất dữ liệu bằng tính năng xuất tích hợp sẵn."
                    : "While we implement reasonable backup procedures, you are solely responsible for maintaining your own backups of your data. We recommend regularly exporting your data using the built-in export feature."}
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mt-6 mb-3">❌ {language === "vi" ? "Chấm dứt" : "Termination"}</h3>
                <p>
                  {language === "vi"
                    ? "Bạn có thể chấm dứt tài khoản của mình bất cứ lúc nào thông qua trang Cài đặt. Chúng tôi bảo lưu quyền đình chỉ hoặc chấm dứt các tài khoản vi phạm các điều khoản này. Khi chấm dứt, dữ liệu của bạn sẽ bị xóa vĩnh viễn và không thể phục hồi."
                    : "You may terminate your account at any time through the Settings page. We reserve the right to suspend or terminate accounts that violate these terms. Upon termination, your data will be permanently deleted and cannot be recovered."}
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mt-6 mb-3">🔄 {language === "vi" ? "Thay đổi Điều khoản" : "Changes to Terms"}</h3>
                <p>
                  {language === "vi"
                    ? "Chúng tôi có thể sửa đổi các điều khoản này bất cứ lúc nào. Các thay đổi sẽ có hiệu lực ngay khi đăng tải. Việc bạn tiếp tục sử dụng Freelance Flow sau khi có thay đổi đồng nghĩa với việc chấp nhận các điều khoản đã sửa đổi."
                    : "We may modify these terms at any time. Changes will be effective immediately upon posting. Your continued use of Freelance Flow after changes constitutes acceptance of the modified terms."}
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mt-6 mb-3">⚖️ {language === "vi" ? "Luật điều chỉnh" : "Governing Law"}</h3>
                <p>
                  {language === "vi"
                    ? "Các điều khoản này được điều chỉnh bởi luật pháp hiện hành. Mọi tranh chấp sẽ được giải quyết theo các luật đó."
                    : "These terms are governed by applicable laws. Any disputes shall be resolved in accordance with those laws."}
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mt-6 mb-3">📞 {language === "vi" ? "Liên hệ" : "Contact"}</h3>
                <p>
                  {language === "vi" ? "Bạn có câu hỏi về các điều khoản này? Liên hệ với chúng tôi tại " : "Questions about these terms? Contact us at "}
                  <a href="mailto:admin@manhhuynh.work" className="text-primary hover:underline">admin@manhhuynh.work</a>.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{language === "vi" ? "Liên hệ" : "Get in Touch"}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{language === "vi" ? "Có phản hồi hoặc yêu cầu tính năng? Chúng tôi rất muốn nghe từ bạn." : "Have feedback or a feature request? We'd love to hear from you."}</p>
              <FeedbackForm language={language} />
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
