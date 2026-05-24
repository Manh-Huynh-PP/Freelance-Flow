## [2026-05-24] Thêm tính năng Export Excel cho Business Dashboard
**Mode**: B (FEATURE)
**Files**:
- Read: `src/components/ai/BusinessDashboard.tsx`, `src/lib/excel-backup-service.ts`, `src/ai/analytics/business-intelligence-helpers.ts`
- Edited: `src/components/ai/BusinessDashboard.tsx`
- Created: `src/lib/export-financial-report.ts`

**Architecture decisions**: 
- Sử dụng `exceljs` để sinh file `.xlsx` trực tiếp ở Client Side nhằm bảo mật dữ liệu và tiết kiệm server resource. 
- Tách riêng hàm export ra thư mục `src/lib/` thay vì đặt trực tiếp trong component `BusinessDashboard.tsx` để code UI sạch sẽ và dễ maintain. Hàm lấy toàn bộ appData và dateRange để tự phân tích lại thành các bảng biểu.

**Changes**: 
- Tạo hàm `exportFinancialReportToExcel` gen ra 4 sheets: Summary, Revenue Items, Cost Items (gồm Fixed và Collaborator costs), Future & Lost Revenue.
- Thêm nút **Export Report** vào `BusinessDashboard.tsx` nằm ngay bên cạnh nút **Analyze with AI**, sử dụng chung state `isExporting` và loading spinner (lucide-react).

**Gotchas**: 
- Cần chú ý format tiền tệ trong file Excel, hiện tại đang fix dùng `Intl.NumberFormat` theo `currency` setting của app.
- Khi user tải báo cáo, các con số được generate chính xác theo period date range hiện tại đang chọn trên giao diện.

**Criteria passed**: Yes
