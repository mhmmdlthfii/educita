import express from 'express';
import path from 'path';
import { GoogleGenAI } from '@google/genai';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes FIRST
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // AI assistant reply endpoint to congratulate guests on behalf of Luthfi and Hanum
  app.post('/api/wedding/ai-reply', async (req, res) => {
    const { name, message } = req.body || {};
    try {
      if (!message) {
        return res.status(400).json({ error: 'Message is required' });
      }

      // Check if API key is configured
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        console.warn('GEMINI_API_KEY environment variable is not defined. Using offline mock replies.');
        // Return a warm Indonesian fallback reply
        return res.json({
          reply: `Aamiin ya rabbal alamin. Terima kasih banyak Kak ${name || 'Tamu Undangan'} atas barakah ucapan dan restu indahnya untuk ikatan pernikahan Luthfi & Hanum!`
        });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const prompt = `Kamu adalah AI Co-Host pernikahan Muhammad Luthfi, S.Pd. dan Siti Hanum Handayani, S.Kom. (brand Educita).
Seorang tamu bernama "${name || 'Tamu Undangan'}" meninggalkan ucapan doa berikut:
"${message}"

Tulislah balasan apresiasi ucapan selamat pernikahan yang sangat hangat, sopan, puitis, dan penuh rasa syukur dari pasangan pengantin Luthfi & Hanum.
Aturan penting:
1. Tulis maksimal 2 kalimat.
2. Gunakan Bahasa Indonesia yang indah, santun, ramah, dan tulus.
3. Sebutkan nama mereka "${name || 'Tamu Undangan'}".
4. Berikan doa balasan yang baik untuk mereka.`;

      const aiResponse = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
      });

      const replyText = aiResponse.text?.trim() || `Aamiin, terima kasih banyak Kak ${name || 'Tamu Undangan'} atas doa dan dukungannya untuk kami berdua!`;
      res.json({ reply: replyText });
    } catch (err: any) {
      console.error('Gemini AI Reply error:', err);
      res.json({
        reply: `Aamiin ya rabbal alamin. Terima kasih banyak Kak ${name || 'Tamu Undangan'} atas restu hangatnya untuk hari bahagia Luthfi & Hanum!`
      });
    }
  });

  // AI Route Assistant endpoint to guide guests to the venue in Mayong/Kudus
  app.post('/api/wedding/route-assistant', async (req, res) => {
    try {
      const { startLocation } = req.body;
      if (!startLocation) {
        return res.status(400).json({ error: 'Origin location is required' });
      }

      const locLower = startLocation.toLowerCase();

      // Check if API key is configured
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        console.warn('GEMINI_API_KEY is not defined. Using offline mock route assistant.');
        
        // Custom smart local fallback for the requested examples
        let recommendedRoute = `Keluar menuju Jl. Raya Kudus-Jepara, ikuti rute lurus melintasi perbatasan Mayong hingga sampai di gerbang Royal Bloom Pavilion di sebelah kiri jalan.`;
        let estimatedTime = `20 - 35 Menit`;
        let suggestedDeparture = `09:15 WIB (Disarankan berangkat 45 menit sebelum sesi dibuka untuk mengantisipasi kepadatan lalu lintas pagi hari di Pasar Mayong).`;

        if (locLower.includes('mayong')) {
          recommendedRoute = `Dari pusat Mayong, arahkan kendaraan ke Timur menyusuri Jl. Raya Mayong-Kudus. Lokasi Royal Bloom Pavilion berada di sebelah kanan jalan sebelum jembatan perbatasan Kudus.`;
          estimatedTime = `10 - 15 Menit`;
          suggestedDeparture = `09:30 WIB (Berangkat awal memudahkan Anda memilih tempat parkir premier terdekat).`;
        } else if (locLower.includes('term') || locLower.includes('kudus')) {
          recommendedRoute = `Dari Terminal Kudus / Kota Kudus, ambil rute Barat menuju Jl. Raya Kudus-Jepara. Lewati Pabrik Djarum, lalu terus lurus melintasi gerbang perbatasan Mayong. Lokasi berada tepat di sebelah kiri jalan.`;
          estimatedTime = `25 - 30 Menit`;
          suggestedDeparture = `09:15 WIB (Disarankan mengantisipasi antrean lampu merah di perempatan Jati).`;
        }

        return res.json({ recommendedRoute, estimatedTime, suggestedDeparture });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const prompt = `Kamu adalah Asisten Rute Cerdas untuk pernikahan Muhammad Luthfi, S.Pd. & Hanum Muftiani, S.Kom.
Lokasi Pernikahan (Tujuan): "Royal Bloom Pavilion, Jl. Raya Mayong No. 88 (Perbatasan Kudus - Jepara, Jawa Tengah)".
Asal Keberangkatan Tamu: "${startLocation}"

Berikan instruksi rute jalan terbaik menuju ke lokasi pernikahan.
Kembalikan respon dalam format JSON murni dengan key objek berikut:
{
  "recommendedRoute": "Deskripsi rute jalan singkat, jelas, menyebutkan jalan utama dan patokan/landmark penting di sekitar Mayong/Kudus.",
  "estimatedTime": "Estimasi durasi perjalanan (misal: '15 Menit' atau '40 Menit' tergantung jarak realistis).",
  "suggestedDeparture": "Waktu keberangkatan ideal serta tips kemacetan/parkir (misal: '09:20 WIB (Disarankan 40 menit sebelum acara untuk antisipasi kemacetan di pasar Mayong)')."
}
Kembalikan HANYA format JSON murni tanpa markdown formatting, tanpa backticks \`\`\`json.`;

      const aiResponse = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });

      const text = aiResponse.text?.trim() || '{}';
      const parsed = JSON.parse(text);
      res.json({
        recommendedRoute: parsed.recommendedRoute || 'Ambil Jl. Raya Kudus-Jepara langsung menuju wilayah Mayong.',
        estimatedTime: parsed.estimatedTime || '25 Menit',
        suggestedDeparture: parsed.suggestedDeparture || '09:15 WIB (Disarankan berangkat awal)'
      });

    } catch (err: any) {
      console.error('Route Assistant error:', err);
      res.json({
        recommendedRoute: `Keluar ke arah Jl. Raya Kudus-Jepara, terus lurus menuju area perbatasan Mayong. Gedung Royal Bloom Pavilion terletak di pinggir jalan raya utama.`,
        estimatedTime: `aprox. 30 Menit`,
        suggestedDeparture: `09:15 WIB (Disarankan menyisihkan waktu luang 45 menit)`
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
