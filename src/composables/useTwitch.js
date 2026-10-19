import { useOverlay } from "./useOverlay.js";

const TWITCH_API = "https://api.twitch.tv/helix";
const POLL_INTERVAL = 30_000;

/* ── Helpers ─────────────────────────────────────── */

function getConfig() {
  return {
    clientId:     import.meta.env.VITE_TWITCH_CLIENT_ID     || "",
    token:        import.meta.env.VITE_TWITCH_TOKEN          || "",
    broadcasterId: import.meta.env.VITE_TWITCH_BROADCASTER_ID || "",
  };
}

function isConfigured() {
  const { clientId, token, broadcasterId } = getConfig();
  return !!(clientId && token && broadcasterId);
}

function headers() {
  const { clientId, token } = getConfig();
  return {
    "Client-Id":     clientId,
    "Authorization": `Bearer ${token}`,
  };
}

/* ── Follower ────────────────────────────────────── */

async function fetchLatestFollower(broadcasterId, setLatestFollower) {
  try {
    const res = await fetch(
      `${TWITCH_API}/channels/followers?broadcaster_id=${broadcasterId}&first=1`,
      { headers: headers() },
    );
    if (!res.ok) return;
    const data = await res.json();
    const username = data?.data?.[0]?.user_name;
    if (username) setLatestFollower(username);
  } catch { /* silent */ }
}

/* ── Subscriber ──────────────────────────────────── */

/*
  L'API Twitch ne trie pas les abonnés par date,
  donc on détecte les nouveaux par diff entre deux polls.
  Au premier poll on initialise l'ensemble sans afficher
  de nom, puis on signale chaque nouvel abonné détecté.
*/

let knownSubIds = null;

async function fetchLatestSub(broadcasterId, setLatestSub) {
  try {
    const res = await fetch(
      `${TWITCH_API}/subscriptions?broadcaster_id=${broadcasterId}&first=100`,
      { headers: headers() },
    );
    if (!res.ok) return;
    const data = await res.json();
    const subs = data?.data ?? [];

    const currentIds = new Set(subs.map((s) => s.user_id));

    if (knownSubIds === null) {
      knownSubIds = currentIds;
      if (subs[0]) setLatestSub(subs[0].user_name);
      return;
    }

    for (const sub of subs) {
      if (!knownSubIds.has(sub.user_id)) {
        setLatestSub(sub.user_name);
        break;
      }
    }

    knownSubIds = currentIds;
  } catch { /* silent */ }
}

/* ── Composable ──────────────────────────────────── */

export function useTwitch() {
  const { setLatestFollower, setLatestSub } = useOverlay();
  const { broadcasterId } = getConfig();

  async function sync() {
    await Promise.all([
      fetchLatestFollower(broadcasterId, setLatestFollower),
      fetchLatestSub(broadcasterId, setLatestSub),
    ]);
  }

  function startTwitchPolling() {
    if (!isConfigured()) return;
    sync();
    setInterval(sync, POLL_INTERVAL);
  }

  return { startTwitchPolling };
}
