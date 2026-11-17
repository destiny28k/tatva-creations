// Small client-side handoff between the page that opens a project and the overlay that shows it,
// so the clicked image can fly into place and the right photo is shown first.

export type Flight = { rect: DOMRect; image: string; view: number };

let pending: Flight | null = null;
let openedInApp = false;

export function setFlight(f: Flight | null) {
  pending = f;
  openedInApp = true;
}

/** Read without clearing: safe to call during render. */
export function peekFlight(): Flight | null {
  return pending;
}

export function clearFlight() {
  pending = null;
}

/** True once the visitor has opened an overlay from inside the site, so Back can return to it. */
export function cameFromSite(): boolean {
  return openedInApp;
}

export function markInApp() {
  openedInApp = true;
}

// The intro plays once per visit, not every time the home page mounts again.
let introPlayed = false;
export const hasIntroPlayed = () => introPlayed;
export const markIntroPlayed = () => {
  introPlayed = true;
};
