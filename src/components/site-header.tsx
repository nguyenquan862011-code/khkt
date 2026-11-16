import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { AudioController } from "@/components/audio-controller";
import { GlobalSearchModal } from "@/components/global-search-modal";
import { StudyAssistantDrawer } from "@/components/study-assistant-drawer";
import { AccountButton } from "@/components/account-button";
import {
  Compass,
  BookOpen,
  ArrowRight,
  Menu,
  X,
  History,
  Award,
  Sliders,
  Calculator,
  Search,
  BookMarked,
  ListChecks,
  FlaskConical,
} from "lucide-react";

interface SiteHeaderProps {
  currentPath?: string;
}

export function SiteHeader({ currentPath }: SiteHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const routerPath = useRouterState({ select: (s) => s.location.pathname });
  const activePath = currentPath || routerPath;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const navLinks = [
    { href: "/", label: "Trang chủ", icon: null },
    { href: "/mo-phong", label: "Phòng Lab", icon: Compass },
    { href: "/thi-nghiem-kinh-dien", label: "Kinh điển (CE)", icon: History },
    { href: "/thi-nghiem", label: "Thư viện TN", icon: FlaskConical },
    { href: "/vdc", label: "Thử thách VDC", icon: Award },
    { href: "/luyen-tap", label: "Luyện tập", icon: ListChecks },
    { href: "/thiet-ke-thi-nghiem", label: "Thiết kế Lab", icon: Sliders },
    { href: "/cong-thuc", label: "Công thức", icon: Calculator },
    { href: "/tai-lieu", label: "Tài liệu", icon: BookOpen },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#153325] dark:border-[#12261C] bg-[#091A13] dark:bg-[#06120D] text-[#EDF5ED] backdrop-blur-md transition-colors duration-200">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8">
        {/* Brand Logo & Name */}
        <div className="flex min-w-0 items-center gap-4 lg:gap-6">
          <Link
            to="/"
            className="flex min-w-0 items-center gap-2 overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#38A875] rounded-lg p-0.5 sm:shrink-0"
            title="Trường THPT Tam Giang — Về trang chủ"
          >
            <Logo size="md" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-0.5" aria-label="Điều hướng chính">
            {navLinks.map((item) => {
              const isActive = activePath === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                    isActive
                      ? "bg-[#16845A]/25 text-[#C8ED78] font-semibold"
                      : "text-[#EDF5ED]/80 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {Icon && <Icon className="size-3.5 opacity-70" />}
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right utilities: Search + Notebook + Audio + Theme Toggle + Lab CTA */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="flex h-8.5 items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 text-xs text-[#EDF5ED]/85 hover:bg-white/10 hover:text-white transition-colors whitespace-nowrap shrink-0"
            title="Tìm kiếm nhanh toàn hệ thống (Ctrl+K)"
            aria-label="Tìm kiếm nhanh toàn hệ thống"
          >
            <Search className="size-3.5" />
            <span className="hidden lg:inline">Tìm nhanh</span>
          </button>

          <button
            type="button"
            onClick={() => setNotesOpen(true)}
            className="hidden sm:flex h-8.5 items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 text-xs text-[#C8ED78] hover:bg-white/10 transition-colors whitespace-nowrap shrink-0"
            title="Mở Sổ tay Tiến độ & Ghi chú"
            aria-label="Mở Sổ tay Tiến độ"
          >
            <BookMarked className="size-3.5" />
            <span className="hidden lg:inline">Sổ tay</span>
          </button>

          {/* Background Audio Controller */}
          <AudioController />

          {/* Light / Dark Mode Toggle */}
          <ThemeToggle />

          {/* Tài khoản học sinh (khách vẫn dùng được toàn bộ bài học & thí nghiệm) */}
          <AccountButton active={activePath === "/tai-khoan"} />

          {/* Primary Action Button: "Vào phòng thí nghiệm" */}
          <Link
            to="/mo-phong"
            className="group hidden sm:inline-flex items-center gap-1.5 rounded-lg bg-[#16845A] dark:bg-[#38A875] px-3 py-1.5 text-xs font-semibold text-white dark:text-[#0B1511] shadow-[0_1px_3px_rgba(0,0,0,0.2)] transition-all duration-200 hover:bg-[#126b48] dark:hover:bg-[#4ade80] hover:shadow-[0_0_15px_rgba(56,168,117,0.4)] active:scale-[0.98]"
          >
            <Compass className="size-3.5 transition-transform group-hover:rotate-45" />
            <span className="hidden md:inline">Vào phòng Lab 777+</span>
            <span className="md:hidden">Lab 777+</span>
            <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
          </Link>

          {/* Mobile hamburger menu toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex size-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-[#EDF5ED] hover:bg-white/10 xl:hidden"
            aria-label="Mở menu chuyển trang"
          >
            {mobileMenuOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div className="border-b border-[#153325] bg-[#091A13] dark:bg-[#06120D] px-4 py-3 xl:hidden">
          <nav className="flex flex-col gap-1">
            {/* Trên điện thoại nút Sổ tay được đưa vào menu để thanh tiêu đề không tràn ngang */}
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                setNotesOpen(true);
              }}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-medium text-[#C8ED78] hover:bg-white/5 sm:hidden"
            >
              <BookMarked className="size-3.5" />
              Sổ tay tiến độ & ghi chú
            </button>
            {navLinks.map((item) => {
              const isActive = activePath === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium ${
                    isActive
                      ? "bg-[#16845A]/25 text-[#C8ED78] font-bold"
                      : "text-[#EDF5ED]/80 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {Icon && <Icon className="size-4 text-[#38A875]" />}
                  <span>{item.label}</span>
                </Link>
              );
            })}
            <div className="pt-2 border-t border-white/10">
              <Link
                to="/mo-phong"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 rounded-lg bg-[#16845A] py-2 text-xs font-semibold text-white"
              >
                <Compass className="size-4" />
                <span>Vào phòng thí nghiệm 777 bài</span>
              </Link>
            </div>
          </nav>
        </div>
      )}
      <GlobalSearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
      <StudyAssistantDrawer open={notesOpen} onClose={() => setNotesOpen(false)} />
    </header>
  );
}
