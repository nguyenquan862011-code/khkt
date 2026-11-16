export interface StudyNote {
  id: string;
  title: string;
  content: string;
  updatedAt: string;
}

export type GradePreference = "all" | "Lớp 10" | "Lớp 11" | "Lớp 12";
export type StudyLevel = "co-ban" | "thong-hieu" | "nang-cao";

export interface StudyPreferences {
  grade: GradePreference;
  focusTopic: string;
  level: StudyLevel;
}

export interface LearningState {
  viewedLessons: string[];
  completedLabs: string[];
  favoriteExperiments: string[];
  favoriteFormulas: string[];
  favoriteLessons: string[];
  favoriteDocs: string[];
  solvedVdcIds: string[];
  /** Mã các câu hỏi trong ngân hàng bài tập được đánh dấu để xem lại. */
  savedQuestions: string[];
  notes: Record<string, StudyNote>;
  preferences: StudyPreferences;
}

const LEARNING_STORAGE_KEY = "tamgiang_learning_progress_v1";

type Listener = (state: LearningState) => void;
const listeners = new Set<Listener>();

function getDefaultPreferences(): StudyPreferences {
  return {
    grade: "all",
    focusTopic: "all",
    level: "thong-hieu",
  };
}

function getDefaultState(): LearningState {
  return {
    viewedLessons: [],
    completedLabs: [],
    favoriteExperiments: [],
    favoriteFormulas: [],
    favoriteLessons: [],
    favoriteDocs: [],
    solvedVdcIds: [],
    savedQuestions: [],
    notes: {},
    preferences: getDefaultPreferences(),
  };
}

let cachedState: LearningState | null = null;

function readStorage(): LearningState {
  if (typeof window === "undefined") return getDefaultState();
  try {
    const raw = localStorage.getItem(LEARNING_STORAGE_KEY);
    if (!raw) return getDefaultState();
    const parsed = JSON.parse(raw) as Partial<LearningState>;
    const defaults = getDefaultPreferences();
    const pref = parsed.preferences;
    return {
      viewedLessons: Array.isArray(parsed.viewedLessons) ? parsed.viewedLessons : [],
      completedLabs: Array.isArray(parsed.completedLabs) ? parsed.completedLabs : [],
      favoriteExperiments: Array.isArray(parsed.favoriteExperiments)
        ? parsed.favoriteExperiments
        : [],
      favoriteFormulas: Array.isArray(parsed.favoriteFormulas) ? parsed.favoriteFormulas : [],
      favoriteLessons: Array.isArray(parsed.favoriteLessons) ? parsed.favoriteLessons : [],
      favoriteDocs: Array.isArray(parsed.favoriteDocs) ? parsed.favoriteDocs : [],
      solvedVdcIds: Array.isArray(parsed.solvedVdcIds) ? parsed.solvedVdcIds : [],
      savedQuestions: Array.isArray(parsed.savedQuestions) ? parsed.savedQuestions : [],
      notes: parsed.notes && typeof parsed.notes === "object" ? parsed.notes : {},
      preferences:
        pref && typeof pref === "object"
          ? {
              grade:
                pref.grade === "Lớp 10" || pref.grade === "Lớp 11" || pref.grade === "Lớp 12"
                  ? pref.grade
                  : defaults.grade,
              focusTopic:
                typeof pref.focusTopic === "string" && pref.focusTopic.trim()
                  ? pref.focusTopic
                  : defaults.focusTopic,
              level:
                pref.level === "co-ban" || pref.level === "thong-hieu" || pref.level === "nang-cao"
                  ? pref.level
                  : defaults.level,
            }
          : defaults,
    };
  } catch {
    return getDefaultState();
  }
}

function writeStorage(next: LearningState): void {
  cachedState = next;
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(LEARNING_STORAGE_KEY, JSON.stringify(next));
    } catch (err) {
      console.warn("[TamGiang LearningStore] Failed to persist progress:", err);
    }
  }
  listeners.forEach((fn) => {
    try {
      fn(next);
    } catch {
      // ignore listener error
    }
  });
}

export function getLearningState(): LearningState {
  if (!cachedState) {
    cachedState = readStorage();
  }
  return cachedState;
}

export function subscribeLearningState(listener: Listener): () => void {
  listeners.add(listener);
  listener(getLearningState());
  return () => {
    listeners.delete(listener);
  };
}

function addUnique(list: string[], item: string, limit = 300): string[] {
  if (!item) return list;
  const filtered = list.filter((x) => x !== item);
  return [item, ...filtered].slice(0, limit);
}

function toggleInList(list: string[], item: string): string[] {
  if (!item) return list;
  return list.includes(item) ? list.filter((x) => x !== item) : [item, ...list];
}

export function markLessonViewed(fullPath: string): LearningState {
  const cur = getLearningState();
  const next: LearningState = {
    ...cur,
    viewedLessons: addUnique(cur.viewedLessons, fullPath, 777),
  };
  writeStorage(next);
  return next;
}

export function markLabCompleted(labId: string): LearningState {
  const cur = getLearningState();
  const next: LearningState = {
    ...cur,
    completedLabs: addUnique(cur.completedLabs, labId, 100),
  };
  writeStorage(next);
  return next;
}

export function markVdcSolved(problemId: string): LearningState {
  const cur = getLearningState();
  const next: LearningState = {
    ...cur,
    solvedVdcIds: addUnique(cur.solvedVdcIds, problemId, 100),
  };
  writeStorage(next);
  return next;
}

export type FavoriteCategory =
  "favoriteExperiments" | "favoriteFormulas" | "favoriteLessons" | "favoriteDocs";

export function toggleFavoriteItem(category: FavoriteCategory, itemId: string): LearningState {
  const cur = getLearningState();
  const next: LearningState = {
    ...cur,
    [category]: toggleInList(cur[category], itemId),
  };
  writeStorage(next);
  return next;
}

export function updateStudyPreferences(patch: Partial<StudyPreferences>): LearningState {
  const cur = getLearningState();
  const next: LearningState = {
    ...cur,
    preferences: {
      ...cur.preferences,
      ...patch,
    },
  };
  writeStorage(next);
  return next;
}

export function saveStudyNote(id: string, title: string, content: string): LearningState {
  const cur = getLearningState();
  const trimmed = content.trim();
  const nextNotes = { ...cur.notes };
  if (!trimmed) {
    delete nextNotes[id];
  } else {
    nextNotes[id] = {
      id,
      title,
      content: trimmed,
      updatedAt: new Date().toISOString(),
    };
  }
  const next: LearningState = {
    ...cur,
    notes: nextNotes,
  };
  writeStorage(next);
  return next;
}

export function deleteStudyNote(id: string): LearningState {
  const cur = getLearningState();
  const nextNotes = { ...cur.notes };
  delete nextNotes[id];
  const next: LearningState = {
    ...cur,
    notes: nextNotes,
  };
  writeStorage(next);
  return next;
}

export function resetLearningProgress(): LearningState {
  const empty = getDefaultState();
  writeStorage(empty);
  return empty;
}

export function toggleSavedQuestion(questionId: string): LearningState {
  const cur = getLearningState();
  const next: LearningState = {
    ...cur,
    savedQuestions: toggleInList(cur.savedQuestions, questionId).slice(0, 500),
  };
  writeStorage(next);
  return next;
}

/**
 * Thay toàn bộ tiến độ cục bộ bằng dữ liệu đã đồng bộ từ tài khoản (hoặc xoá về mặc định khi đăng xuất).
 * Dữ liệu được chuẩn hoá lại qua cùng bộ kiểm tra như khi đọc từ localStorage.
 */
export function replaceLearningState(next: unknown): LearningState {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(LEARNING_STORAGE_KEY, JSON.stringify(next ?? {}));
    } catch {
      // bộ nhớ đầy: vẫn giữ trạng thái trong phiên hiện tại
    }
  }
  const clean = readStorage();
  writeStorage(clean);
  return clean;
}

const LIST_KEYS = [
  "viewedLessons",
  "completedLabs",
  "favoriteExperiments",
  "favoriteFormulas",
  "favoriteLessons",
  "favoriteDocs",
  "solvedVdcIds",
  "savedQuestions",
] as const;

/** Hợp nhất tiến độ của hai thiết bị: gộp danh sách (không trùng), ghi chú lấy bản sửa mới hơn. */
export function mergeLearningStates(
  local: LearningState,
  remote: Partial<LearningState>,
): LearningState {
  const merged: LearningState = { ...local, notes: { ...local.notes } };
  for (const key of LIST_KEYS) {
    const other = Array.isArray(remote[key]) ? (remote[key] as string[]) : [];
    merged[key] = [...new Set([...local[key], ...other.filter((x) => typeof x === "string")])];
  }
  for (const [id, note] of Object.entries(remote.notes ?? {})) {
    const mine = merged.notes[id];
    if (!mine || (note?.updatedAt ?? "") > mine.updatedAt) merged.notes[id] = note;
  }
  return merged;
}
