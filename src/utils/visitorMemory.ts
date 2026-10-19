/**
 * Privacy-conscious visitor memory for Bloop's Little World.
 * Stores minimal metadata locally on the user's browser (no telemetry, no tracking).
 */

export interface VisitorProfile {
  nickname: string;
  hasVisited: boolean;
  firstVisitDate: string;
  lastVisitDate: string;
  visitCount: number;
  favoriteArea?: string;
}

const STORAGE_KEY = 'bloop_visitor_memory_v1';

export const visitorMemory = {
  getProfile(): VisitorProfile {
    if (typeof window === 'undefined') {
      return {
        nickname: '',
        hasVisited: false,
        firstVisitDate: new Date().toISOString(),
        lastVisitDate: new Date().toISOString(),
        visitCount: 1,
      };
    }

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return {
          nickname: typeof parsed.nickname === 'string' ? parsed.nickname.trim() : '',
          hasVisited: true,
          firstVisitDate: parsed.firstVisitDate || new Date().toISOString(),
          lastVisitDate: parsed.lastVisitDate || new Date().toISOString(),
          visitCount: typeof parsed.visitCount === 'number' ? parsed.visitCount : 1,
          favoriteArea: parsed.favoriteArea,
        };
      }
    } catch {
      // Storage unavailable or disabled
    }

    return {
      nickname: '',
      hasVisited: false,
      firstVisitDate: new Date().toISOString(),
      lastVisitDate: new Date().toISOString(),
      visitCount: 1,
    };
  },

  recordVisit(nickname?: string, favoriteArea?: string): VisitorProfile {
    const current = this.getProfile();
    const now = new Date().toISOString();

    const updated: VisitorProfile = {
      nickname: nickname !== undefined ? nickname.trim() : current.nickname,
      hasVisited: true,
      firstVisitDate: current.hasVisited ? current.firstVisitDate : now,
      lastVisitDate: now,
      visitCount: current.hasVisited ? current.visitCount + 1 : 1,
      favoriteArea: favoriteArea || current.favoriteArea,
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Graceful fallback if storage is restricted
    }

    return updated;
  },

  setNickname(nickname: string): VisitorProfile {
    const current = this.getProfile();
    const updated: VisitorProfile = {
      ...current,
      nickname: nickname.trim().slice(0, 30),
      hasVisited: true,
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {}

    return updated;
  },

  resetMemory(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  },
};
