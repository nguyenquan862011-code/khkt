import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/logo";
import {
  ArrowUpRight,
  Compass,
  BookOpen,
  History,
  Award,
  Sliders,
  Calculator,
  Mail,
  Copy,
  Check,
  ShieldCheck,
} from "lucide-react";
import { APP_CONFIG } from "@/lib/config";

export function Footer() {
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(APP_CONFIG.feedbackEmail);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2500);
    } catch {
      // Fallback ignored if clipboard unavailable
    }
  };

  return (
    <footer className="mt-auto border-t border-[#153325] dark:border-[#12261C] bg-[#091A13] dark:bg-[#06120D] text-[#EDF5ED] transition-colors duration-200">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-8 items-start">
          {/* Brand & Mission column */}
          <div className="space-y-4 md:col-span-4">
            <Link
              to="/"
              className="inline-block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#38A875]"
            >
              <Logo size="md" showTagline />
            </Link>
            <p className="max-w-md text-xs leading-relaxed text-[#EDF5ED]/75">
              TAMGIANG PHYSICS – Phòng thí nghiệm Vật lý số dành cho học sinh Trường THPT Tam Giang.
              Nhìn thấy hiện tượng, hiểu được bản chất, làm chủ tri thức.
            </p>
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 pt-1 text-[11px] font-medium text-[#72CF91]">
              <span>777+ Mô phỏng</span>
              <span aria-hidden="true" className="text-[#EDF5ED]/30">
                ·
              </span>
              <span>30 Thí nghiệm Kinh điển</span>
              <span aria-hidden="true" className="text-[#EDF5ED]/30">
                ·
              </span>
              <span>Truy cập mở không cần đăng nhập</span>
            </div>
          </div>

          {/* Ecosystem quick links */}
          <div className="space-y-3 md:col-span-3">
            <h4 className="font-mono text-xs font-semibold uppercase tracking-wider text-[#72CF91]">
              Hệ sinh thái
            </h4>
            <ul className="space-y-2.5 text-xs text-[#EDF5ED]/85">
              <li>
                <Link
                  to="/mo-phong"
                  className="inline-flex items-center gap-2 transition-colors hover:text-[#C8ED78]"
                >
                  <Compass className="size-3.5 shrink-0 text-[#38A875]" />
                  <span>Phòng thí nghiệm số 777 bài</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/thi-nghiem-kinh-dien"
                  className="inline-flex items-center gap-2 transition-colors hover:text-[#C8ED78]"
                >
                  <History className="size-3.5 shrink-0 text-[#38A875]" />
                  <span>30 Thí nghiệm Kinh điển</span>
                  <ArrowUpRight className="size-3 opacity-60" />
                </Link>
              </li>
              <li>
                <Link
                  to="/vdc"
                  className="inline-flex items-center gap-2 transition-colors hover:text-[#C8ED78]"
                >
                  <Award className="size-3.5 shrink-0 text-[#38A875]" />
                  <span>Thử thách Vận dụng cao (VDC)</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/thiet-ke-thi-nghiem"
                  className="inline-flex items-center gap-2 transition-colors hover:text-[#C8ED78]"
                >
                  <Sliders className="size-3.5 shrink-0 text-[#38A875]" />
                  <span>Thiết kế thí nghiệm & Sai số</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/cong-thuc"
                  className="inline-flex items-center gap-2 transition-colors hover:text-[#C8ED78]"
                >
                  <Calculator className="size-3.5 shrink-0 text-[#38A875]" />
                  <span>Sổ tay công thức & Thứ nguyên</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/tai-lieu"
                  className="inline-flex items-center gap-2 transition-colors hover:text-[#C8ED78]"
                >
                  <BookOpen className="size-3.5 shrink-0 text-[#38A875]" />
                  <span>Kho tài liệu Google Drive</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/nguon-ban-quyen"
                  className="inline-flex items-center gap-2 transition-colors hover:text-[#C8ED78]"
                >
                  <ShieldCheck className="size-3.5 shrink-0 text-[#38A875]" />
                  <span>Nguồn &amp; Bản quyền</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Community Companion & Feedback Card */}
          <div className="md:col-span-5 rounded-2xl border border-[#2B4033] bg-[#0D1E16] p-5 sm:p-6 space-y-4">
            <h4 className="font-mono text-xs font-semibold uppercase tracking-wider text-[#C8ED78] flex items-center gap-2">
              <span
                className="size-2.5 rounded-full bg-[#16845A] dark:bg-[#38A875]"
                aria-hidden="true"
              />
              <span>ĐỒNG HÀNH & PHÁT TRIỂN</span>
            </h4>
            <p className="text-xs leading-relaxed text-[#EDF5ED]/85">
              Mình là Quân — người phát triển TamGiangPhysics với mong muốn giúp việc học Vật lý trở
              nên trực quan và dễ hiểu hơn. Nền tảng vẫn đang được hoàn thiện từng ngày, rất mong
              nhận được góp ý, báo lỗi hoặc ý tưởng tính năng mới từ bạn để website ngày càng tốt
              hơn!
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-0.5">
              <a
                href={`mailto:${APP_CONFIG.feedbackEmail}?subject=${encodeURIComponent("Góp ý & Báo lỗi TamGiangPhysics")}`}
                className="inline-flex items-center gap-2.5 rounded-full border border-[#38A875]/45 bg-[#16845A]/15 px-4 py-2.5 text-xs text-[#EDF5ED] transition-all hover:border-[#72CF91]/70 hover:bg-[#16845A]/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#38A875]"
              >
                <Mail className="size-4 shrink-0 text-[#72CF91]" />
                <span>
                  Gửi góp ý qua Email:{" "}
                  <strong className="font-semibold text-white underline underline-offset-4">
                    {APP_CONFIG.feedbackEmail}
                  </strong>
                </span>
              </a>

              <button
                type="button"
                onClick={handleCopyEmail}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-2 text-[11px] font-medium text-[#EDF5ED]/80 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#38A875]"
                title="Sao chép địa chỉ Email góp ý"
                aria-label="Sao chép địa chỉ Email góp ý"
              >
                {copiedEmail ? (
                  <>
                    <Check className="size-3.5 text-[#C8ED78]" />
                    <span className="text-[#C8ED78]">Đã sao chép</span>
                  </>
                ) : (
                  <>
                    <Copy className="size-3.5 text-[#72CF91]" />
                    <span>Sao chép</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Bottom centered copyright */}
        <div className="mt-10 border-t border-white/10 pt-6 text-center space-y-1.5">
          <p className="font-mono text-xs text-[#EDF5ED]/75">
            © {APP_CONFIG.copyrightYear} Phát triển bởi {APP_CONFIG.authorCredit}.
          </p>
          <p className="text-xs text-[#EDF5ED]/55">TamGiangPhysics · Modern Scientific UI</p>
        </div>
      </div>
    </footer>
  );
}
