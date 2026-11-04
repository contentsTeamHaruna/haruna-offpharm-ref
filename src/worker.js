// 오프약국 매대 레퍼런스 픽 — 이름별 저장(D1 pharmpicks)
const CORS = { 'access-control-allow-origin': '*', 'access-control-allow-methods': 'GET, PUT, OPTIONS', 'access-control-allow-headers': 'content-type' };
const json = (d, s = 200) => new Response(JSON.stringify(d), { status: s, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...CORS } });

export default {
  async fetch(req, env) {
    const p = new URL(req.url).pathname;
    if (req.method === 'OPTIONS') return new Response(null, { headers: CORS });
    if (p === '/api/picks' && req.method === 'GET') {
      const { results } = await env.DB.prepare('SELECT name, data, updated FROM pharmpicks ORDER BY name').all();
      return json(results.map(r => ({ name: r.name, ...JSON.parse(r.data), updated: r.updated })));
    }
    if (p === '/api/picks' && req.method === 'PUT') {
      const b = await req.json().catch(() => ({}));
      const name = typeof b.name === 'string' ? b.name.trim() : '';
      if (!name || name.length > 20 || !Array.isArray(b.ids)) return json({ error: 'bad' }, 400);
      const ids = [...new Set(b.ids.filter(x => typeof x === 'string' && x.length < 20))];
      const memo = {};
      if (b.memo && typeof b.memo === 'object') for (const [k, v] of Object.entries(b.memo)) if (ids.includes(k) && typeof v === 'string' && v.trim()) memo[k] = v.slice(0, 300);
      await env.DB.prepare('INSERT INTO pharmpicks(name, data, updated) VALUES(?1, ?2, ?3) ON CONFLICT(name) DO UPDATE SET data = excluded.data, updated = excluded.updated')
        .bind(name, JSON.stringify({ ids, memo }), Date.now()).run();
      return json({ ok: true, n: ids.length });
    }
    return env.ASSETS.fetch(req);
  },
};
