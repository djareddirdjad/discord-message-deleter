window.addEventListener('dmd:start', async (e) => {
  const { authorId, delay } = e.detail;

  // Extract auth token from Discord's local storage
  const token = (function () {
    const iframe = document.createElement('iframe');
    document.head.append(iframe);
    const ls = iframe.contentWindow.localStorage;
    iframe.remove();
    return ls.getItem('token')?.replace(/"/g, '');
  })();

  if (!token) {
    console.error('[DMD] Could not retrieve token. Make sure you are logged into Discord.');
    return;
  }

  // Get current channel ID from the URL
  const channelMatch = location.pathname.match(/channels\/(?:\d+|@me)\/(\d+)/);
  if (!channelMatch) {
    console.error('[DMD] Could not determine channel ID from URL.');
    return;
  }
  const channelId = channelMatch[1];

  console.log(`[DMD] Starting deletion in channel ${channelId} for author ${authorId}`);

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  let lastId = null;
  let deleted = 0;

  while (!window.__dmdStop) {
    const url = new URL(`https://discord.com/api/v9/channels/${channelId}/messages`);
    url.searchParams.set('limit', '100');
    if (lastId) url.searchParams.set('before', lastId);

    const res = await fetch(url, {
      headers: { Authorization: token }
    });

    if (!res.ok) {
      console.error('[DMD] Failed to fetch messages:', res.status);
      break;
    }

    const messages = await res.json();
    if (!messages.length) {
      console.log('[DMD] No more messages found.');
      break;
    }

    const mine = messages.filter((m) => m.author.id === authorId);
    lastId = messages[messages.length - 1].id;

    if (!mine.length) continue;

    for (const msg of mine) {
      if (window.__dmdStop) break;

      const delRes = await fetch(
        `https://discord.com/api/v9/channels/${channelId}/messages/${msg.id}`,
        { method: 'DELETE', headers: { Authorization: token } }
      );

      if (delRes.status === 204) {
        deleted++;
        console.log(`[DMD] Deleted message ${msg.id} (total: ${deleted})`);
      } else if (delRes.status === 429) {
        const retryAfter = (await delRes.json()).retry_after * 1000;
        console.warn(`[DMD] Rate limited. Waiting ${retryAfter}ms...`);
        await sleep(retryAfter);
      } else {
        console.warn(`[DMD] Could not delete ${msg.id}: status ${delRes.status}`);
      }

      await sleep(delay);
    }
  }

  console.log(`[DMD] Done. Total deleted: ${deleted}`);
});
