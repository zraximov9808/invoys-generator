// Vercel serverless function: GET /api/orginfo?inn=311716390
// Looks the INN up on orginfo.uz and returns [{inn, name, address, url}].
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';

function decode(s) {
  return String(s || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&quot;/g, '"').replace(/&#34;/g, '"')
    .replace(/&#x27;|&#39;|&apos;/g, "'")
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n))
    .replace(/\s+/g, ' ').trim();
}

function parse(html) {
  const out = [];
  const re = /<a\b[^>]*href="(\/(?:ru|uz|en)\/organization\/[^"]+)"[^>]*>([\s\S]*?)<\/a>/g;
  let m;
  while ((m = re.exec(html))) {
    const body = m[2];
    if (!/card-title/.test(body)) continue;
    const inn = (body.match(/>\s*(\d{9}|\d{14})\s*</) || [])[1] || '';
    const name = decode((body.match(/<h6[^>]*card-title[^>]*>([\s\S]*?)<\/h6>/) || [])[1]);
    const address = decode((body.match(/alt="location"\s*\/?>([\s\S]*?)<\/p>/) || [])[1]);
    out.push({ inn, name, address, url: 'https://orginfo.uz' + m[1] });
  }
  return out;
}

module.exports = async (req, res) => {
  const inn = String((req.query && req.query.inn) || '').replace(/\D/g, '');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  if (inn.length !== 9 && inn.length !== 14) {
    res.statusCode = 400;
    return res.end(JSON.stringify({ error: 'INN 9 yoki 14 xonali bo\'lishi kerak', results: [] }));
  }
  try {
    const r = await fetch('https://orginfo.uz/ru/search/all/?q=' + inn, {
      headers: { 'User-Agent': UA, 'Accept': 'text/html', 'Accept-Language': 'ru,uz;q=0.8' }
    });
    if (!r.ok) throw new Error('orginfo.uz javobi: ' + r.status);
    const all = parse(await r.text());
    const exact = all.filter(x => x.inn === inn);
    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=604800');
    res.end(JSON.stringify({ results: exact.length ? exact : all.slice(0, 10) }));
  } catch (e) {
    res.statusCode = 502;
    res.end(JSON.stringify({ error: String(e.message || e), results: [] }));
  }
};

module.exports.parse = parse;
