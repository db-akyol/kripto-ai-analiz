// Cron job script for generating daily analysis
// Run this script daily at a specific time (e.g., 09:00 AM)
// Usage: node scripts/generateAnalysis.js

require('dotenv').config({ path: '.env.local' });

const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const path = require('path');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const ANALYSES_DIR = path.join(__dirname, '..', 'data', 'analyses');

async function generateDailyAnalysis() {
  const today = new Date().toISOString().split('T')[0];
  const filePath = path.join(ANALYSES_DIR, `${today}.json`);

  // Check if analysis already exists for today
  if (fs.existsSync(filePath)) {
    console.log(`Analysis already exists for ${today}`);
    return;
  }

  console.log(`Generating analysis for ${today}...`);

  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const prompt = `Sen deneyimli bir kripto para analisti ve finansal danışmansın. Bugün ${today} tarihi için Bitcoin ve kripto para piyasası hakkında detaylı bir günlük analiz hazırla.

Analizin şu bölümleri içermeli:

1. **ÖZET**: Piyasanın genel durumunu 2-3 cümlede özetle.

2. **BİTCOİN ANALİZİ**: 
   - Güncel fiyat hareketi ve trend analizi
   - Önemli destek ve direnç seviyeleri
   - Teknik göstergeler (RSI, MACD, Hareketli Ortalamalar)
   - Kısa vadeli beklentiler

3. **ETHEREUM VE ALTCOİN'LER**:
   - ETH'nin güncel durumu
   - Öne çıkan altcoin hareketleri
   - DeFi ve Layer 2 gelişmeleri

4. **PİYASA GÖSTERGELERİ**:
   - Toplam piyasa değeri
   - 24 saatlik işlem hacmi
   - BTC dominansı

5. **ÖNEMLİ GELİŞMELER**:
   - Güncel haberler ve olaylar
   - Kurumsal yatırımlar
   - Regülasyon haberleri

6. **RİSKLER VE UYARILAR**:
   - Dikkat edilmesi gereken riskler

7. **SONUÇ VE TAVSİYELER**:
   - Genel değerlendirme
   - Yatırımcılara öneriler

Yanıtı JSON formatında ver:
{
  "date": "${today}",
  "title": "Günün başlığı",
  "trend": "bullish" veya "bearish" veya "neutral",
  "summary": "Kısa özet (max 3 cümle)",
  "btcPrice": tahmini BTC fiyatı (sayı olarak),
  "ethPrice": tahmini ETH fiyatı (sayı olarak),
  "fullAnalysis": "Tam analiz metni markdown formatında",
  "technicalIndicators": {
    "rsi": sayı,
    "rsiStatus": "Aşırı Alım" veya "Nötr" veya "Aşırı Satım",
    "macd": "Bullish Crossover" veya "Bearish Crossover" veya "Nötr",
    "ma50": sayı,
    "ma200": sayı
  },
  "priceTargets": {
    "shortTerm": sayı,
    "midTerm": sayı,
    "support": sayı
  },
  "keyPoints": ["önemli nokta 1", "önemli nokta 2", ...],
  "risks": ["risk 1", "risk 2", ...],
  "marketStats": {
    "totalMarketCap": "$X.XT" formatında,
    "volume24h": "$X.XB" formatında,
    "btcDominance": "XX.X%" formatında,
    "activeUsers": "XXXM" formatında
  }
}

Güncel piyasa koşullarını dikkate alarak gerçekçi ve profesyonel bir analiz yap. Türkçe olarak yaz.`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const analysis = JSON.parse(jsonMatch[0]);

      // Ensure directory exists
      if (!fs.existsSync(ANALYSES_DIR)) {
        fs.mkdirSync(ANALYSES_DIR, { recursive: true });
      }

      // Save analysis
      fs.writeFileSync(filePath, JSON.stringify(analysis, null, 2), 'utf-8');
      console.log(`Analysis saved to ${filePath}`);
      return analysis;
    }

    throw new Error('Could not parse JSON from response');
  } catch (error) {
    console.error('Error generating analysis:', error);
    throw error;
  }
}

// Run the script
generateDailyAnalysis()
  .then(() => {
    console.log('Daily analysis generation completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed to generate analysis:', error);
    process.exit(1);
  });
