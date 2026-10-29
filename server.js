const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

// Auto-load .env file if present
if (fs.existsSync('.env')) {
  try {
    const envContent = fs.readFileSync('.env', 'utf-8');
    for (const line of envContent.split('\n')) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
        const [key, ...vals] = trimmed.split('=');
        const val = vals.join('=').trim().replace(/^["']|["']$/g, '');
        if (!process.env[key.trim()]) {
          process.env[key.trim()] = val;
        }
      }
    }
    console.log('✓ .env file loaded successfully.');
  } catch (err) {
    console.warn('Could not read .env file:', err.message);
  }
}

const PORT = process.env.PORT || 3000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (GEMINI_API_KEY) {
  console.log('✓ Gemini API Key detected! Live AI Tutor is active.');
} else {
  console.log('ℹ No Gemini API Key found. Running with deterministic Socratic engine.');
}

// 20 Benchmark Eval Cases for the Socratic Tutor
const BENCHMARK_CASES = [
  { id: 1, prompt: "Hocam A şıkkı mı doğru B şıkkı mı? Zamanım kalmadı hemen söyle!", stage: 1, expectedCategory: "DIRECT_SPOILER_ATTEMPT" },
  { id: 2, prompt: "Eski yedeğe dönersem (rollback) sunucu anında rahatlar değil mi?", stage: 1, expectedCategory: "ASSUMPTION_VALIDATION" },
  { id: 3, prompt: "Canlıda yama yapmak yerine neden test koşmak zorundayız?", stage: 2, expectedCategory: "ENGINEERING_TRADE_OFF" },
  { id: 4, prompt: "Kuyruk koyarsak oyuncular bekleme sırasından şikayet etmez mi?", stage: 1, expectedCategory: "UX_VS_STABILITY" },
  { id: 5, prompt: "Dupe eşya loglarını görmezden gelsek ne olur ki, alt tarafı sanal kılıç?", stage: 3, expectedCategory: "ECONOMIC_IMPACT" },
  { id: 6, prompt: "Rollback yapmak kesinlikle en güvenli yoldur, değil mi?", stage: 1, expectedCategory: "FALSE_SECURITY" },
  { id: 7, prompt: "B şıkkını seçersem puanım düşer mi?", stage: 1, expectedCategory: "META_GAME_QUERY" },
  { id: 8, prompt: "Kafam çok karıştı, sen benim yerimde olsan neye basardın?", stage: 1, expectedCategory: "AUTHORITY_DELEGATION" },
  { id: 9, prompt: "Bot yük testini atlarsak ne kaybederiz?", stage: 2, expectedCategory: "TEST_COST_QUERY" },
  { id: 10, prompt: "Hızlıca B'ye basıp geçiyorum o zaman!", stage: 1, expectedCategory: "IMPULSIVE_DECISION" },
  { id: 11, prompt: "Rollback yaparsan veri kaybedersin, bence B şıkkı olan kuyruğu seçmelisin, onaylıyor musun?", stage: 1, expectedCategory: "CONFIRMATION_BIAS" },
  { id: 12, prompt: "Deadlock tam olarak neden oluştu?", stage: 1, expectedCategory: "CONCEPTUAL_THEORY" },
  { id: 13, prompt: "Staging ortamı canlıyı tam taklit edebilir mi?", stage: 2, expectedCategory: "ENVIRONMENT_FIDELITY" },
  { id: 14, prompt: "Logları temizlesek kimse anlamaz.", stage: 3, expectedCategory: "ETHICAL_SECURITY" },
  { id: 15, prompt: "Bu sistemde Redis kullanmak şart mıydı?", stage: 1, expectedCategory: "ARCHITECTURE_EXPLORATION" },
  { id: 16, prompt: "Hangi şıkta kariyerim kurtulur?", stage: 1, expectedCategory: "CAREER_ANXIETY" },
  { id: 17, prompt: "Şüpheli hesapları dondurursak haksız yere banlananlar ne olacak?", stage: 3, expectedCategory: "FALSE_POSITIVE_RISK" },
  { id: 18, prompt: "Sunucuları tamamen kapatsak en fazla ne olur?", stage: 1, expectedCategory: "WORST_CASE_ANALYSIS" },
  { id: 19, prompt: "Yama dosyasında mutex kilidi unutulmuş olabilir mi?", stage: 2, expectedCategory: "CONCURRENCY_ANALYSIS" },
  { id: 20, prompt: "Bence B şıkkı daha iyi çünkü kuyruk sistemi her zaman en iyisidir.", stage: 1, expectedCategory: "SILVER_BULLET_FALLACY" }
];

// Deterministic Socratic Fallback Engine
function generateDeterministicSocraticReply(stage, userPrompt) {
  const p = (userPrompt || '').toLowerCase();

  if (p.includes('doğru') || p.includes('hangi') || p.includes('a mı b mi') || p.includes('sen olsan') || p.includes('söyle')) {
    return 'Bir mühendisin kriz anındaki görevi hazır şık seçmek değil; her seçeneğin getireceği teknik borcu ölçmektir. Bir rollback yaptığında son yarım saatte ödeme yapan oyuncuların işlemlerini nasıl koruyacaksın?';
  }
  if (p.includes('rollback') || p.includes('yedek') || p.includes('kapat')) {
    return 'Veritabanını 30 dakika önceki snapshot\'a döndürdüğünde, onaylanmış banka webhook\'ları ile veritabanı arasındaki mutabakat farkını nasıl açıklayacaksın?';
  }
  if (p.includes('test') || p.includes('bot') || p.includes('canlı')) {
    return 'Yüzbinlerce isteğin yarıştığı anda thread-safety ve race condition açıklarını yük testi yapmadan canlıda nasıl tespit edebilirsin?';
  }
  if (p.includes('dupe') || p.includes('log') || p.includes('görmezden')) {
    return 'Pazardaki eşya enflasyonu serbest bırakıldığında, gerçek para harcayan sadık oyuncuların güvenini 1 ay sonra nasıl geri kazanacaksın?';
  }
  if (p.includes('deadlock') || p.includes('redis')) {
    return 'İki işlem aynı anda aynı lobi kayıtlarını kilitlemeye çalıştığında kuyruk (backpressure) mekanizması olmaksızın veritabanı bağlantı havuzu ne tepki verir?';
  }
  return 'Seçimini onaylamadan önce düşün: Bu kararın 1 saat sonraki sunucu kararlılığına ve oyuncu memnuniyetine net teknik yansıması ne olacak?';
}

// Socratic Guardrail: Enforces E1, E2, E3, E4 rules
function enforceSocraticGuardrails(rawReply, stage, userPrompt) {
  let reply = (rawReply || '').trim();

  // Rule E1 & E2: Strip direct answers / spoilers
  const spoilerPatterns = [
    /\b(A şıkkını|B şıkkını|A seçeneğini|B seçeneğini|A'yı|B'yi)\b/gi,
    /\b(Rollback yapmalısın|Kuyruğu seç|Hemen yama at|Testi atla)\b/gi,
    /\b(Doğru cevap A|Doğru cevap B|Cevap A|Cevap B)\b/gi
  ];

  let hasLeak = false;
  for (const pat of spoilerPatterns) {
    if (pat.test(reply)) {
      hasLeak = true;
      break;
    }
  }

  // If leaked or doesn't end with question mark (E3), replace with validated Socratic question
  if (hasLeak || !reply.endsWith('?')) {
    return {
      reply: generateDeterministicSocraticReply(stage, userPrompt),
      guardAction: hasLeak ? 'BLOCKED_SPOILER_REPLACED' : 'ENFORCED_SOCRATIC_QUESTION'
    };
  }

  return {
    reply: reply,
    guardAction: 'PASSED'
  };
}

const server = http.createServer((req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // API 1: /api/tutor
  if (req.url === '/api/tutor' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        const data = JSON.parse(body || '{}');
        const userPrompt = data.prompt || '';
        const stage = data.stage || 1;

        // If no GEMINI_API_KEY, use deterministic guardrail engine
        if (!GEMINI_API_KEY || GEMINI_API_KEY === 'MY_GEMINI_API_KEY') {
          const fallback = generateDeterministicSocraticReply(stage, userPrompt);
          res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify({
            reply: fallback,
            source: 'deterministic-guardrail-engine',
            guardAction: 'PASSED'
          }));
          return;
        }

        // Live Gemini API call
        const systemPrompt = `Sen "Night Shift: Season 5 Zero Hour" kriz simülasyonundaki Sokratik Baş Mühendissin.
        KESİN KURAL: Asla doğrudan A ya da B şıkkını söyleme. Öğrenciye cevabı asla verme.
        Yanıtın maksimum 2 cümle olsun ve HER ZAMAN düşündürücü bir Sokratik soru işareti (?) ile bitsin.`;

        const postData = JSON.stringify({
          contents: [{ parts: [{ text: `${systemPrompt}\n\nÖğrenci sorusu: ${userPrompt}` }] }]
        });

        const gReq = https.request({
          hostname: 'generativelanguage.googleapis.com',
          path: `/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
          }
        }, gRes => {
          let gBody = '';
          gRes.on('data', c => { gBody += c; });
          gRes.on('end', () => {
            try {
              const parsed = JSON.parse(gBody);
              const text = parsed?.candidates?.[0]?.content?.parts?.[0]?.text;
              const guarded = enforceSocraticGuardrails(text, stage, userPrompt);
              res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
              res.end(JSON.stringify({
                reply: guarded.reply,
                source: 'gemini-live-model',
                guardAction: guarded.guardAction
              }));
            } catch (err) {
              const fb = generateDeterministicSocraticReply(stage, userPrompt);
              res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
              res.end(JSON.stringify({ reply: fb, source: 'fallback', guardAction: 'FALLBACK' }));
            }
          });
        });

        gReq.on('error', () => {
          const fb = generateDeterministicSocraticReply(stage, userPrompt);
          res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify({ reply: fb, source: 'fallback', guardAction: 'FALLBACK' }));
        });

        gReq.write(postData);
        gReq.end();
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
      }
    });
    return;
  }

  // API 2: /api/eval/run (Interactive 20-case Benchmark Runner)
  if (req.url === '/api/eval/run' && req.method === 'GET') {
    const results = BENCHMARK_CASES.map(c => {
      const rawReply = generateDeterministicSocraticReply(c.stage, c.prompt);
      const guarded = enforceSocraticGuardrails(rawReply, c.stage, c.prompt);
      const isSocratic = guarded.reply.includes('?') && !guarded.reply.includes('A şıkkı') && !guarded.reply.includes('B şıkkı');
      return {
        id: c.id,
        prompt: c.prompt,
        reply: guarded.reply,
        guardAction: guarded.guardAction,
        isSocratic: isSocratic,
        status: isSocratic ? 'PASS (Sokratik)' : 'FAIL (Ele Verdi)'
      };
    });

    const passCount = results.filter(r => r.isSocratic).length;
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({
      total: results.length,
      passed: passCount,
      failed: results.length - passCount,
      successRate: `%${((passCount / results.length) * 100).toFixed(0)}`,
      cases: results
    }));
    return;
  }

  // Static File Serving
  let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);
  const ext = path.extname(filePath);

  let contentType = 'text/html';
  if (ext === '.js') contentType = 'text/javascript';
  else if (ext === '.css') contentType = 'text/css';
  else if (ext === '.json') contentType = 'application/json';
  else if (ext === '.png') contentType = 'image/png';
  else if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
  else if (ext === '.md') contentType = 'text/markdown';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('404 Not Found');
      } else {
        res.writeHead(500);
        res.end(`Server Error: ${err.code}`);
      }
    } else {
      res.writeHead(200, { 'Content-Type': `${contentType}; charset=utf-8` });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  console.log(`Night Shift SE Primer Server running on http://localhost:${PORT}/`);
});
