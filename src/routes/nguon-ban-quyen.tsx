import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ShieldCheck,
  Scale,
  BookOpen,
  FlaskConical,
  Music4,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Mail,
} from "lucide-react";
import { APP_CONFIG } from "@/lib/config";
import { CLASSIC_EXPERIMENTS } from "@/data/classic-experiments";
import { SIMULATION_DOMAINS } from "@/lib/physics-simulations";

export const Route = createFileRoute("/nguon-ban-quyen")({
  head: () => ({
    meta: [
      { title: "Nguồn & Bản quyền — Trường THPT Tam Giang" },
      {
        name: "description",
        content:
          "Minh bạch về nguồn gốc nội dung, giấy phép và quyền tác giả của Phòng Thí Nghiệm Vật Lý Số — Trường THPT Tam Giang.",
      },
    ],
  }),
  component: AttributionPage,
});

function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof ShieldCheck;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-[#153325] bg-[#091A13] p-5 sm:p-6">
      <h2 className="flex items-center gap-2.5 text-base font-bold text-[#72CF91] sm:text-lg">
        <Icon className="size-5 shrink-0" />
        {title}
      </h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-[#C8DACB]">{children}</div>
    </section>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2">
      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-[#38A875]" />
      <span>{children}</span>
    </li>
  );
}

function AttributionPage() {
  const classicCount = CLASSIC_EXPERIMENTS.length;
  const interactiveCount = SIMULATION_DOMAINS.length;

  return (
    <main className="mx-auto max-w-3xl px-5 py-10 sm:px-8 sm:py-14">
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-[#72CF91] hover:underline"
      >
        <ArrowLeft className="size-3.5" /> Về trang chủ
      </Link>

      <header className="mt-5 space-y-3">
        <p className="inline-flex items-center gap-2 rounded-full border border-[#38A875]/40 bg-[#38A875]/10 px-3 py-1 text-[11px] font-semibold tracking-wide text-[#72CF91] uppercase">
          <ShieldCheck className="size-3.5" /> Minh bạch học thuật
        </p>
        <h1 className="text-2xl font-bold text-[#EDF5ED] sm:text-3xl">Nguồn &amp; Bản quyền</h1>
        <p className="text-sm leading-relaxed text-[#A5B7A8]">
          Trang này liệt kê chính xác phần nào của Phòng Thí Nghiệm Vật Lý Số do Trường THPT Tam
          Giang tự xây dựng, phần nào dùng tài nguyên của bên thứ ba, và theo giấy phép nào. Mục
          tiêu: tôn trọng quyền tác giả và để người dùng kiểm chứng được nguồn gốc tài liệu.
        </p>
      </header>

      <div className="mt-7 space-y-5">
        <Section icon={BookOpen} title="Nội dung do Trường THPT Tam Giang biên soạn">
          <p>
            Toàn bộ nội dung mô tả, câu hỏi phản biện, lời giải thích và giao diện dưới đây do nhà
            trường biên soạn hoặc viết riêng cho hệ thống này:
          </p>
          <ul className="space-y-2">
            <Bullet>
              <strong>{classicCount} thí nghiệm vật lý kinh điển</strong> — phần mô tả, quy trình,
              câu hỏi phản biện và đáp án (tệp <code>src/data/classic-experiments.ts</code>).
            </Bullet>
            <Bullet>
              <strong>{interactiveCount} mô hình mô phỏng tương tác</strong> — mô hình tính toán,
              tham số và đồ thị (tệp <code>src/lib/physics-simulations.ts</code>).
            </Bullet>
            <Bullet>
              Các mô phỏng chuyên sâu: giao thoa sóng, chuyển động tròn, tán sắc lăng kính, phòng
              lab vật lý tương tác.
            </Bullet>
            <Bullet>Toàn bộ mã nguồn giao diện, định tuyến và bộ kiểm thử của ứng dụng.</Bullet>
          </ul>
          <p className="text-xs text-[#8AA08D]">
            Khung chương trình (tên bài, thứ tự bài học) tham chiếu theo Chương trình GDPT môn Vật
            lý của Bộ Giáo dục và Đào tạo — đây là khung kiến thức chung, không thuộc quyền sở hữu
            độc quyền của bất kỳ cá nhân hay tổ chức nào.
          </p>
        </Section>

        <Section icon={Music4} title="Nhạc nền — Creative Commons">
          <p>
            Nhạc nền sử dụng tác phẩm của <strong>Sascha Ende</strong>, phát hành theo giấy phép{" "}
            <strong>Creative Commons Attribution 4.0 (CC BY 4.0)</strong>. Giấy phép này cho phép sử
            dụng, phân phối lại và chỉnh sửa, với điều kiện ghi công tác giả.
          </p>
          <div className="rounded-xl border border-[#153325] bg-[#0B1511] p-3.5 text-xs">
            <p className="font-semibold text-[#EDF5ED]">Ghi công:</p>
            <p className="mt-1">
              © 2024–2025 Sascha Ende · Licensed under Creative Commons Attribution 4.0 (CC BY 4.0)
            </p>
            <p className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1">
              <a
                className="inline-flex items-center gap-1 text-[#72CF91] hover:underline"
                href="https://creativecommons.org/licenses/by/4.0/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Giấy phép CC BY 4.0 <ExternalLink className="size-3" />
              </a>
              <a
                className="inline-flex items-center gap-1 text-[#72CF91] hover:underline"
                href="https://ende.app/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Nguồn: ENDE.APP <ExternalLink className="size-3" />
              </a>
            </p>
          </div>
          <p className="text-xs text-[#8AA08D]">
            Thông tin ghi công đầy đủ cho từng bản nhạc (tên tác phẩm, đường dẫn nguồn) được khai
            báo trong tệp <code>src/lib/config.ts</code> và hiển thị ngay trong trình phát nhạc.
          </p>
        </Section>

        <Section icon={Scale} title="Về nội dung tham khảo bên ngoài">
          <div className="flex items-start gap-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs text-amber-100">
            <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-300" />
            <p>
              Hệ thống <strong>không lưu trữ, không sao chép và không hiển thị lại</strong> nội dung
              bài giảng của bất kỳ website bên thứ ba nào. Nếu một bài học có nút{" "}
              <em>“Nguồn: vatly.ai”</em>, đó chỉ là một <strong>đường dẫn ra ngoài</strong> để bạn
              tự mở trang gốc trong tab mới — nội dung vẫn thuộc bản quyền của tác giả gốc và việc
              xem nội dung đó tuân theo điều khoản của trang đó.
            </p>
          </div>
          <p>
            Các mô phỏng bạn dùng trong hệ thống này được <strong>chạy cục bộ</strong> bằng mã nguồn
            của nhà trường, không nhúng qua khung iframe của trang khác.
          </p>
        </Section>

        <Section icon={FlaskConical} title="Yêu cầu về tài liệu hoặc báo lỗi bản quyền">
          <p>
            Nếu bạn là tác giả hoặc chủ sở hữu quyền và cho rằng hệ thống có nội dung chưa phù hợp,
            vui lòng liên hệ để nhà trường kiểm tra và gỡ bỏ trong thời gian sớm nhất:
          </p>
          <a
            href={`mailto:${APP_CONFIG.feedbackEmail}`}
            className="inline-flex items-center gap-2 rounded-xl border border-[#38A875]/40 bg-[#38A875]/10 px-3.5 py-2 text-sm font-semibold text-[#72CF91] hover:bg-[#38A875]/20"
          >
            <Mail className="size-4" /> {APP_CONFIG.feedbackEmail}
          </a>
          <p className="text-xs text-[#8AA08D]">
            Nhà trường cam kết phản hồi và xử lý mọi yêu cầu chính đáng về quyền tác giả.
          </p>
        </Section>
      </div>

      <footer className="mt-8 border-t border-[#153325] pt-5 text-xs text-[#8AA08D]">
        <p>
          Cập nhật lần cuối: tháng 11 năm 2026 · Trường THPT Tam Giang — Phòng Thí Nghiệm Vật Lý Số.
        </p>
      </footer>
    </main>
  );
}
