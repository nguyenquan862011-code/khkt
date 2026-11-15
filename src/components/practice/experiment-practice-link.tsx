import { Link } from "@tanstack/react-router";
import { ClipboardList } from "lucide-react";
import { EXPERIMENT_PRACTICE_LINKS } from "@/data/question-bank/links";

/** Nút dẫn từ một thí nghiệm sang bộ bài tập khai thác đúng thí nghiệm đó (nếu đã có). */
export function ExperimentPracticeLink({ experimentId }: { experimentId: string }) {
  const link = EXPERIMENT_PRACTICE_LINKS[experimentId];
  if (!link) return null;
  return (
    <Link
      to="/luyen-tap"
      search={{ bai: link.code }}
      className="inline-flex min-h-9 items-center gap-1.5 rounded-lg bg-[#16845A] px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[#126b48]"
    >
      <ClipboardList className="size-3.5 shrink-0" />
      {link.label}
    </Link>
  );
}
