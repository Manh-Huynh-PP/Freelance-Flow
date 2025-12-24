import Link from "next/link";

interface LandingFooterProps {
    language: "en" | "vi";
}

export function LandingFooter({ language }: LandingFooterProps) {
    return (
        <footer className="w-full border-t py-6 md:py-0">
            <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row px-4 md:px-6">
                <p className="text-sm text-muted-foreground">
                    {language === "vi"
                        ? "© 2025 Freelance Flow. Được thiết kế bởi Mạnh Huỳnh."
                        : "© 2025 Freelance Flow. Designed by Manh Huynh."}
                </p>
                <nav className="flex gap-4 text-sm">
                    <Link href="/privacy" className="hover:underline underline-offset-4">
                        {language === "vi" ? "Chính sách Quyền riêng tư" : "Privacy Policy"}
                    </Link>
                    <Link href="/terms" className="hover:underline underline-offset-4">
                        {language === "vi" ? "Điều khoản Dịch vụ" : "Terms of Service"}
                    </Link>
                    <Link href="/contact" className="hover:underline underline-offset-4">
                        {language === "vi" ? "Liên hệ" : "Contact"}
                    </Link>
                </nav>
            </div>
        </footer>
    );
}
