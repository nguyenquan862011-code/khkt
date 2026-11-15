import { Logo } from "@/components/logo";
import {
  ArrowUpRight,
  Compass,
  BookOpen,
  Layers,
  History,
  Award,
  Sliders,
  Calculator,
} from "lucide-react";
import { APP_CONFIG } from "@/lib/config";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-[#153325] dark:border-[#12261C] bg-[#091A13] dark:bg-[#06120D] text-[#EDF5ED] transition-colors duration-200">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-8">
          {/* Brand & Mission column */}
          <div className="space-y-4 md:col-span-5">
            <a
              href="/"
              className="inline-block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#38A875]"
            >
              <Logo size="md" showTagline />
            </a>
            <p className="max-w-md text-xs leading-relaxed text-[#EDF5ED]/75">
              Nền tảng học tập và khám phá Vật lý trực quan, hiện đại mang phong cách phòng thí
              nghiệm kỹ thuật số. Nhìn thấy để hiểu sâu bản chất thế giới tự nhiên.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#38A875]/30 bg-[#16845A]/15 px-2.5 py-1 text-[11px] font-medium text-[#72CF91]">
                <span className="size-1.5 rounded-full bg-[#38A875] animate-pulse" />
                Phòng Lab Số 777+ Mô phỏng
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#C8ED78]/30 bg-[#C8ED78]/10 px-2.5 py-1 text-[11px] font-medium text-[#C8ED78]">
                30 Thí nghiệm Kinh điển
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/5 px-2.5 py-1 text-[11px] font-medium text-white">
                Thử thách VDC & Thiết kế Lab
              </span>
            </div>
          </div>

          {/* Quick links */}
          <div className="space-y-3 md:col-span-3">
            <h4 className="font-mono text-xs uppercase tracking-wider text-[#72CF91]">
              Hệ sinh thái
            </h4>
            <ul className="space-y-2 text-xs text-[#EDF5ED]/80">
              <li>
                <a
                  href="/mo-phong"
                  className="inline-flex items-center gap-1.5 transition-colors hover:text-[#C8ED78]"
                >
                  <Compass className="size-3.5 text-[#38A875]" />
                  Phòng thí nghiệm số 777 bài
                  <ArrowUpRight className="size-3 opacity-60" />
                </a>
              </li>
              <li>
                <a
                  href="/thi-nghiem-kinh-dien"
                  className="inline-flex items-center gap-1.5 transition-colors hover:text-[#C8ED78]"
                >
                  <History className="size-3.5 text-[#38A875]" />
                  30 Thí nghiệm Kinh điển
                  <ArrowUpRight className="size-3 opacity-60" />
                </a>
              </li>
              <li>
                <a
                  href="/vdc"
                  className="inline-flex items-center gap-1.5 transition-colors hover:text-[#C8ED78]"
                >
                  <Award className="size-3.5 text-[#38A875]" />
                  Thử thách Vận dụng cao (VDC)
                </a>
              </li>
              <li>
                <a
                  href="/thiet-ke-thi-nghiem"
                  className="inline-flex items-center gap-1.5 transition-colors hover:text-[#C8ED78]"
                >
                  <Sliders className="size-3.5 text-[#38A875]" />
                  Thiết kế thí nghiệm & Sai số
                </a>
              </li>
              <li>
                <a
                  href="/cong-thuc"
                  className="inline-flex items-center gap-1.5 transition-colors hover:text-[#C8ED78]"
                >
                  <Calculator className="size-3.5 text-[#38A875]" />
                  Sổ tay công thức & Thứ nguyên
                </a>
              </li>
              <li>
                <a
                  href="/tai-lieu"
                  className="inline-flex items-center gap-1.5 transition-colors hover:text-[#C8ED78]"
                >
                  <BookOpen className="size-3.5 text-[#38A875]" />
                  Kho tài liệu Google Drive
                </a>
              </li>
            </ul>
          </div>

          {/* School information */}
          <div className="space-y-3 md:col-span-4 rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
            <h4 className="font-mono text-xs uppercase tracking-wider text-[#C8ED78] flex items-center gap-2">
              <span className="size-2 rounded-full bg-[#38A875]" />
              TRƯỜNG THPT TAM GIANG
            </h4>
            <p className="text-xs leading-relaxed text-[#EDF5ED]/80">
              Cổng học liệu và phòng thí nghiệm Vật lý số của Trường THPT Tam Giang, hỗ trợ học sinh
              quan sát hiện tượng trực quan, tương tác mô phỏng và ôn luyện kiến thức THPT theo
              chương trình mới.
            </p>
            <div className="pt-1">
              <div className="inline-flex items-center gap-2 rounded-lg border border-[#38A875]/40 bg-[#16845A]/20 px-3 py-1.5 text-xs font-medium text-[#72CF91]">
                <Layers className="size-3.5 text-[#72CF91]" />
                <span>Tổ Vật Lý · Trường THPT Tam Giang</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-center sm:flex-row sm:text-left">
          <p className="font-mono text-xs text-[#EDF5ED]/60">
            © {APP_CONFIG.copyrightYear} Trường THPT Tam Giang.
          </p>
          <div className="flex items-center gap-4 text-xs text-[#EDF5ED]/50">
            <span>Trường THPT Tam Giang · Phòng Thí Nghiệm Vật Lý Số</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
