import { APP_CONFIG, type AudioTrackConfig, type AudioLicenseType } from "./config";

export interface AudioState {
  isPlaying: boolean;
  isEnabled: boolean; // user's explicit preference
  volume: number; // 0 to 1
  isMuted: boolean;
  autoplayBlocked: boolean;
  isInLab: boolean;
  isLoaded: boolean;
  currentTrack: AudioTrackConfig;
  playlist: AudioTrackConfig[];
  currentTime: number;
  duration: number;
  repeatMode: "off" | "all" | "one";
  isShuffle: boolean;
  trackNotice?: string | null;
}

type AudioListener = (state: AudioState) => void;

export function getDefaultAudioState(): AudioState {
  return {
    isPlaying: false,
    isEnabled: true,
    volume: APP_CONFIG.backgroundAudio.defaultVolume,
    isMuted: false,
    autoplayBlocked: false,
    isInLab: false,
    isLoaded: false,
    currentTrack: APP_CONFIG.backgroundAudio.playlist[0],
    playlist: APP_CONFIG.backgroundAudio.playlist,
    currentTime: 0,
    duration: 0,
    repeatMode: "all",
    isShuffle: false,
    trackNotice: null,
  };
}

const CUSTOM_AUDIO_DB_NAME = "tamgiang_custom_audio_db";
const CUSTOM_AUDIO_STORE_NAME = "tracks";

interface StoredCustomAudioRecord {
  id: string;
  title: string;
  mimeType: string;
  blob: Blob;
  createdAt: number;
}

function openCustomAudioDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || typeof indexedDB === "undefined") {
      reject(new Error("IndexedDB unavailable"));
      return;
    }
    const req = indexedDB.open(CUSTOM_AUDIO_DB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(CUSTOM_AUDIO_STORE_NAME)) {
        db.createObjectStore(CUSTOM_AUDIO_STORE_NAME, { keyPath: "id" });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error || new Error("Failed to open IndexedDB"));
  });
}

async function saveCustomTrackToDb(record: StoredCustomAudioRecord): Promise<void> {
  try {
    const db = await openCustomAudioDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(CUSTOM_AUDIO_STORE_NAME, "readwrite");
      tx.objectStore(CUSTOM_AUDIO_STORE_NAME).put(record);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
    db.close();
  } catch (err) {
    console.warn("[TamGiang Audio] Could not persist custom track:", err);
  }
}

async function loadCustomTracksFromDb(): Promise<StoredCustomAudioRecord[]> {
  try {
    const db = await openCustomAudioDb();
    const records = await new Promise<StoredCustomAudioRecord[]>((resolve, reject) => {
      const tx = db.transaction(CUSTOM_AUDIO_STORE_NAME, "readonly");
      const req = tx.objectStore(CUSTOM_AUDIO_STORE_NAME).getAll();
      req.onsuccess = () => resolve((req.result as StoredCustomAudioRecord[]) || []);
      req.onerror = () => reject(req.error);
    });
    db.close();
    return records.sort((a, b) => b.createdAt - a.createdAt);
  } catch {
    return [];
  }
}

async function deleteCustomTrackFromDb(id: string): Promise<void> {
  try {
    const db = await openCustomAudioDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(CUSTOM_AUDIO_STORE_NAME, "readwrite");
      tx.objectStore(CUSTOM_AUDIO_STORE_NAME).delete(id);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
    db.close();
  } catch (err) {
    console.warn("[TamGiang Audio] Could not delete custom track:", err);
  }
}

export class BackgroundAudioManager {
  private audio: HTMLAudioElement | null = null;
  private listeners: Set<AudioListener> = new Set();
  private playlist: AudioTrackConfig[] = [...APP_CONFIG.backgroundAudio.playlist];
  private currentTrackIndex: number = 0;
  private previousVolume: number = APP_CONFIG.backgroundAudio.defaultVolume;
  private customObjectUrls: Map<string, string> = new Map();
  private customTracksHydrated: boolean = false;

  private state: AudioState = getDefaultAudioState();

  private isInitialized: boolean = false;

  constructor() {
    if (typeof window !== "undefined") {
      this.initFromStorage();
    }
  }

  public async hydrateCustomTracks(): Promise<void> {
    if (typeof window === "undefined" || this.customTracksHydrated) return;
    this.customTracksHydrated = true;

    const records = await loadCustomTracksFromDb();
    if (records.length === 0) return;

    const customTracks: AudioTrackConfig[] = records.map((rec) => {
      const url = this.customObjectUrls.get(rec.id) || URL.createObjectURL(rec.blob);
      this.customObjectUrls.set(rec.id, url);
      return {
        id: rec.id,
        title: rec.title,
        artist: "Nhạc tải lên của bạn",
        genre: "Chill",
        src: url,
        isAvailable: true,
        license: "Tệp cá nhân tải lên",
        licenseType: "public-domain",
        sourceName: "Thiết bị người dùng (Lưu cục bộ)",
        note: "Tệp nhạc do bạn tải lên và được lưu trong trình duyệt để phát xuyên suốt khi học tập.",
        isCustom: true,
      };
    });

    this.playlist = [...customTracks, ...APP_CONFIG.backgroundAudio.playlist];
    this.state.playlist = this.playlist;

    try {
      const storedTrackId = localStorage.getItem(APP_CONFIG.backgroundAudio.storageKeyTrack);
      const targetId = storedTrackId || customTracks[0]?.id;
      const idx = targetId ? this.playlist.findIndex((t) => t.id === targetId) : -1;
      if (idx !== -1) {
        this.currentTrackIndex = idx;
        this.state.currentTrack = this.playlist[idx];
        const audio = this.getAudio();
        if (audio && this.state.currentTrack.src && !this.state.isPlaying) {
          audio.src = this.state.currentTrack.src;
        }
      }
    } catch {
      // ignore storage access issues
    }

    this.notify();
  }

  public async addCustomTrack(file: File): Promise<AudioTrackConfig | null> {
    if (typeof window === "undefined" || !file) return null;

    const cleanTitle =
      file.name
        .replace(/\.[^/.]+$/, "")
        .replace(/[_-]+/g, " ")
        .trim() || "Nhạc tải lên";
    const id = `custom-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const blob = file.slice(0, file.size, file.type || "audio/mpeg");
    const objectUrl = URL.createObjectURL(blob);
    this.customObjectUrls.set(id, objectUrl);

    const track: AudioTrackConfig = {
      id,
      title: cleanTitle,
      artist: "Nhạc tải lên của bạn",
      genre: "Chill",
      src: objectUrl,
      isAvailable: true,
      license: "Tệp cá nhân tải lên",
      licenseType: "public-domain",
      sourceName: "Thiết bị người dùng (Lưu cục bộ)",
      note: "Tệp nhạc do bạn tải lên và được lưu trong trình duyệt để phát xuyên suốt khi học tập.",
      isCustom: true,
    };

    await saveCustomTrackToDb({
      id,
      title: cleanTitle,
      mimeType: file.type || "audio/mpeg",
      blob,
      createdAt: Date.now(),
    });

    this.playlist = [track, ...this.playlist.filter((t) => t.id !== id)];
    this.state.playlist = this.playlist;
    this.currentTrackIndex = 0;
    this.state.currentTrack = track;
    this.state.trackNotice = null;
    this.state.isEnabled = true;

    try {
      localStorage.setItem(APP_CONFIG.backgroundAudio.storageKeyTrack, id);
    } catch {
      // ignore
    }

    const audio = this.getAudio();
    if (audio) {
      audio.src = objectUrl;
      audio.currentTime = 0;
    }

    await this.play();
    return track;
  }

  public async removeCustomTrack(trackId: string): Promise<void> {
    const target = this.playlist.find((t) => t.id === trackId && t.isCustom);
    if (!target) return;

    const url = this.customObjectUrls.get(trackId);
    if (url) {
      URL.revokeObjectURL(url);
      this.customObjectUrls.delete(trackId);
    }

    await deleteCustomTrackFromDb(trackId);

    const wasCurrent = this.state.currentTrack.id === trackId;
    this.playlist = this.playlist.filter((t) => t.id !== trackId);
    this.state.playlist = this.playlist;

    if (wasCurrent) {
      const nextTrack = this.getAvailableTracks()[0] || this.playlist[0];
      this.currentTrackIndex = Math.max(
        0,
        this.playlist.findIndex((t) => t.id === nextTrack.id),
      );
      this.state.currentTrack = nextTrack;
      if (this.audio && nextTrack?.src) {
        this.audio.src = nextTrack.src;
        this.audio.currentTime = 0;
        if (this.state.isPlaying) {
          this.play().catch((err) => console.warn(err));
        }
      }
    } else {
      this.currentTrackIndex = Math.max(
        0,
        this.playlist.findIndex((t) => t.id === this.state.currentTrack.id),
      );
    }

    this.notify();
  }

  public getAvailableTracks(): AudioTrackConfig[] {
    return this.playlist.filter((t) => t.isAvailable && Boolean(t.src));
  }

  public getUnverifiedTracks(): AudioTrackConfig[] {
    return this.playlist.filter((t) => !t.isAvailable);
  }

  public getTracksByLicense(licenseType: AudioLicenseType | "all"): AudioTrackConfig[] {
    if (licenseType === "all") return [...this.playlist];
    return this.playlist.filter((t) => t.licenseType === licenseType);
  }

  public filterTracks(options: {
    status?: "all" | "available" | "unavailable";
    license?: AudioLicenseType | "all";
    search?: string;
    playlist?: AudioTrackConfig[];
  }): AudioTrackConfig[] {
    const { status = "all", license = "all", search = "", playlist = this.playlist } = options;
    const q = search.trim().toLowerCase();

    return playlist.filter((track) => {
      // Filter by file availability status
      if (status === "available" && (!track.isAvailable || !track.src)) return false;
      if (status === "unavailable" && track.isAvailable) return false;

      // Filter by license type
      if (license !== "all" && track.licenseType !== license) return false;

      // Search keyword filter across title, artist, composer, genre, license
      if (q) {
        const titleMatch = track.title.toLowerCase().includes(q);
        const artistMatch = track.artist.toLowerCase().includes(q);
        const composerMatch = track.composer?.toLowerCase().includes(q) ?? false;
        const genreMatch = track.genre.toLowerCase().includes(q);
        const licenseMatch = track.license.toLowerCase().includes(q);
        if (!titleMatch && !artistMatch && !composerMatch && !genreMatch && !licenseMatch) {
          return false;
        }
      }

      return true;
    });
  }

  private initFromStorage() {
    if (typeof window === "undefined" || this.isInitialized) return;
    this.isInitialized = true;

    try {
      const storedEnabled = localStorage.getItem(APP_CONFIG.backgroundAudio.storageKeyEnabled);
      if (storedEnabled !== null) {
        this.state.isEnabled = storedEnabled === "true";
      }

      const storedVolume = localStorage.getItem(APP_CONFIG.backgroundAudio.storageKeyVolume);
      if (storedVolume !== null) {
        const parsed = parseFloat(storedVolume);
        if (!isNaN(parsed) && parsed >= 0 && parsed <= 1) {
          this.state.volume = parsed;
          if (parsed > 0) this.previousVolume = parsed;
          this.state.isMuted = parsed === 0;
        }
      }

      const storedTrackId = localStorage.getItem(APP_CONFIG.backgroundAudio.storageKeyTrack);
      if (storedTrackId) {
        const idx = this.playlist.findIndex((t) => t.id === storedTrackId);
        if (idx !== -1) {
          this.currentTrackIndex = idx;
          this.state.currentTrack = this.playlist[idx];
        }
      }

      const storedRepeat = localStorage.getItem(APP_CONFIG.backgroundAudio.storageKeyRepeat);
      if (storedRepeat === "off" || storedRepeat === "all" || storedRepeat === "one") {
        this.state.repeatMode = storedRepeat;
      }

      const storedShuffle = localStorage.getItem(APP_CONFIG.backgroundAudio.storageKeyShuffle);
      if (storedShuffle !== null) {
        this.state.isShuffle = storedShuffle === "true";
      }
    } catch (err) {
      console.warn("[TamGiang Audio] Storage access warning:", err);
    }
  }

  private getAudio(): HTMLAudioElement | null {
    if (typeof window === "undefined") return null;

    if (!this.audio) {
      try {
        const audio = new Audio();
        audio.preload = "auto";
        audio.volume = this.state.isMuted ? 0 : this.state.volume;

        const initialSrc =
          this.state.currentTrack.isAvailable && this.state.currentTrack.src
            ? this.state.currentTrack.src
            : this.getAvailableTracks()[0]?.src || APP_CONFIG.backgroundAudio.src;

        audio.src = initialSrc;

        audio.addEventListener("playing", () => {
          this.state.isPlaying = true;
          this.state.autoplayBlocked = false;
          this.notify();
        });

        audio.addEventListener("pause", () => {
          this.state.isPlaying = false;
          this.notify();
        });

        audio.addEventListener("timeupdate", () => {
          this.state.currentTime = audio.currentTime || 0;
          this.state.duration = audio.duration || 0;
          this.notify();
        });

        audio.addEventListener("loadedmetadata", () => {
          this.state.duration = audio.duration || 0;
          this.state.isLoaded = true;
          this.notify();
        });

        audio.addEventListener("ended", () => {
          this.handleTrackEnded();
        });

        audio.addEventListener("error", (e) => {
          console.warn("[TamGiang Audio] Audio stream notice:", e);
          this.state.isLoaded = false;
          this.notify();
        });

        this.audio = audio;
      } catch (err) {
        console.warn("[TamGiang Audio] Could not instantiate Audio:", err);
      }
    }

    return this.audio;
  }

  private handleTrackEnded() {
    if (this.state.repeatMode === "one") {
      if (this.audio) {
        this.audio.currentTime = 0;
        this.audio.play().catch((err) => console.warn(err));
      }
    } else if (this.state.repeatMode === "all") {
      this.next();
    } else {
      // repeat off: stop at end of playlist
      if (this.currentTrackIndex < this.playlist.length - 1) {
        this.next();
      } else {
        this.state.isPlaying = false;
        this.notify();
      }
    }
  }

  public getState(): AudioState {
    return { ...this.state };
  }

  public subscribe(listener: AudioListener): () => void {
    this.listeners.add(listener);
    listener(this.getState());
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    const currentState = this.getState();
    this.listeners.forEach((listener) => {
      try {
        listener(currentState);
      } catch (err) {
        console.error("[TamGiang Audio] Listener error:", err);
      }
    });
  }

  public isLabRoute(pathname: string): boolean {
    if (!pathname) return false;
    const lower = pathname.toLowerCase();
    return (
      lower.startsWith("/mo-phong") ||
      lower.startsWith("/bai-hoc") ||
      lower.includes("mo-phong") ||
      lower.includes("bai-hoc") ||
      lower.includes("lab")
    );
  }

  /**
   * Handle route navigation:
   * Keeps music playing seamlessly when entering Lab.
   */
  public onRouteChanged(pathname: string) {
    if (typeof window !== "undefined") {
      this.getAudio();
    }
    const inLab = this.isLabRoute(pathname);
    this.state.isInLab = inLab;
    this.notify();
  }

  /**
   * Attempt playback
   */
  public async play(): Promise<boolean> {
    if (typeof window === "undefined") return false;

    const audio = this.getAudio();
    if (!audio) return false;

    const available = this.getAvailableTracks();
    const fallback = available[0] || APP_CONFIG.backgroundAudio.playlist[0];

    // If active track is unverified/has no file, provide clear notice and play verified fallback
    if (!this.state.currentTrack.isAvailable || !this.state.currentTrack.src) {
      this.state.trackNotice = `Bài "${this.state.currentTrack.title}" chưa có tệp được xác minh bản quyền. Đang phát bài có bản quyền mở: "${fallback.title}".`;
      if (fallback.src) {
        audio.src = fallback.src;
      }
    } else {
      this.state.trackNotice = null;
      const trackSrc = this.state.currentTrack.src;
      const expectedUrl = trackSrc.startsWith("/") ? window.location.origin + trackSrc : trackSrc;
      if (audio.src !== expectedUrl && audio.src !== trackSrc) {
        audio.src = trackSrc;
      }
    }

    this.state.isPlaying = true;
    this.state.isEnabled = true;
    this.state.autoplayBlocked = false;

    try {
      localStorage.setItem(APP_CONFIG.backgroundAudio.storageKeyEnabled, "true");
    } catch (err) {
      console.warn("[TamGiang Audio] Storage write skipped:", err);
    }
    this.notify();

    try {
      audio.volume = this.state.isMuted ? 0 : this.state.volume;
      await audio.play();
      return true;
    } catch (err: unknown) {
      const error = err as { name?: string };
      if (error?.name === "NotAllowedError") {
        this.state.autoplayBlocked = true;
        this.state.isPlaying = false;
        this.notify();
      } else {
        console.warn("[TamGiang Audio] Playback failed:", err);
        this.state.isPlaying = false;
        this.notify();
      }
      return false;
    }
  }

  /**
   * Pause playback
   */
  public pause() {
    if (typeof window === "undefined") return;
    if (this.audio) {
      this.audio.pause();
    }
    this.state.isPlaying = false;
    this.state.isEnabled = false;

    try {
      localStorage.setItem(APP_CONFIG.backgroundAudio.storageKeyEnabled, "false");
    } catch (err) {
      console.warn("[TamGiang Audio] Storage write skipped:", err);
    }
    this.notify();
  }

  /**
   * Toggle playback
   */
  public toggle() {
    if (this.state.isPlaying) {
      this.pause();
    } else {
      return this.play();
    }
  }

  /**
   * Select a specific track by index or ID
   */
  public selectTrack(trackId: string) {
    const idx = this.playlist.findIndex((t) => t.id === trackId);
    if (idx === -1) return;

    this.currentTrackIndex = idx;
    this.state.currentTrack = this.playlist[idx];

    try {
      localStorage.setItem(APP_CONFIG.backgroundAudio.storageKeyTrack, trackId);
    } catch (err) {
      console.warn("[TamGiang Audio] Storage write skipped:", err);
    }

    const available = this.getAvailableTracks();
    const fallback = available[0] || APP_CONFIG.backgroundAudio.playlist[0];

    if (!this.state.currentTrack.isAvailable || !this.state.currentTrack.src) {
      this.state.trackNotice = `Bài "${this.state.currentTrack.title}" chưa có tệp được xác minh giấy phép bản quyền. Vui lòng chọn bài đã có tệp được cấp phép mở.`;
    } else {
      this.state.trackNotice = null;
    }

    const audio = this.getAudio();
    if (audio) {
      if (!this.state.currentTrack.isAvailable || !this.state.currentTrack.src) {
        if (fallback.src) {
          audio.src = fallback.src;
          audio.currentTime = 0;
        }
      } else {
        audio.src = this.state.currentTrack.src;
        audio.currentTime = 0;
      }

      if (this.state.isEnabled || this.state.isPlaying) {
        this.play().catch((err) => console.warn(err));
      } else {
        this.notify();
      }
    } else {
      this.notify();
    }
  }

  /**
   * Next track (cycles through tracks, prefers verified tracks)
   */
  public next() {
    if (this.state.isShuffle) {
      const available = this.getAvailableTracks();
      const pool = available.length > 0 ? available : this.playlist;
      const nextIdx = Math.floor(Math.random() * pool.length);
      this.selectTrack(pool[nextIdx].id);
    } else {
      const nextIdx = (this.currentTrackIndex + 1) % this.playlist.length;
      this.selectTrack(this.playlist[nextIdx].id);
    }
  }

  /**
   * Previous track
   */
  public previous() {
    if (this.audio && this.audio.currentTime > 3) {
      this.audio.currentTime = 0;
      return;
    }
    const prevIdx = (this.currentTrackIndex - 1 + this.playlist.length) % this.playlist.length;
    this.selectTrack(this.playlist[prevIdx].id);
  }

  /**
   * Toggle shuffle mode
   */
  public toggleShuffle() {
    this.state.isShuffle = !this.state.isShuffle;
    try {
      localStorage.setItem(
        APP_CONFIG.backgroundAudio.storageKeyShuffle,
        this.state.isShuffle.toString(),
      );
    } catch (err) {
      console.warn(err);
    }
    this.notify();
  }

  /**
   * Cycle repeat mode (off -> all -> one -> off)
   */
  public cycleRepeatMode() {
    const modes: Array<"off" | "all" | "one"> = ["off", "all", "one"];
    const current = modes.indexOf(this.state.repeatMode);
    const next = modes[(current + 1) % modes.length];
    this.state.repeatMode = next;
    try {
      localStorage.setItem(APP_CONFIG.backgroundAudio.storageKeyRepeat, next);
    } catch (err) {
      console.warn(err);
    }
    this.notify();
  }

  /**
   * Seek audio position in seconds
   */
  public seek(timeInSeconds: number) {
    if (!this.audio) return;
    const clamped = Math.max(0, Math.min(this.state.duration || 0, timeInSeconds));
    this.audio.currentTime = clamped;
    this.state.currentTime = clamped;
    this.notify();
  }

  /**
   * Set volume [0.0 - 1.0]
   */
  public setVolume(vol: number) {
    const clamped = Math.max(0, Math.min(1, vol));
    this.state.volume = clamped;
    this.state.isMuted = clamped === 0;
    if (clamped > 0) {
      this.previousVolume = clamped;
    }
    if (this.audio) {
      this.audio.volume = clamped;
    }
    try {
      localStorage.setItem(APP_CONFIG.backgroundAudio.storageKeyVolume, clamped.toString());
    } catch (err) {
      console.warn(err);
    }
    this.notify();
  }

  /**
   * Toggle mute
   */
  public toggleMute() {
    if (this.state.isMuted || this.state.volume === 0) {
      const restoreVol = this.previousVolume > 0 ? this.previousVolume : 0.25;
      this.setVolume(restoreVol);
    } else {
      this.previousVolume = this.state.volume;
      this.setVolume(0);
    }
  }
}

// Global Singleton instance
export const audioManager = new BackgroundAudioManager();
