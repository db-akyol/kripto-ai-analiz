import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function generateAnalysis(date) {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const prompt = `Sen deneyimli bir kripto para analisti ve finansal danışmansın. Bugün ${date} tarihi için Bitcoin ve kripto para piyasası hakkında detaylı bir günlük analiz hazırla.

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
   - Korku ve Açgözlülük endeksi

5. **ÖNEMLİ GELİŞMELER**:
   - Güncel haberler ve olaylar
   - Kurumsal yatırımlar
   - Regülasyon haberleri

6. **RİSKLER VE UYARILAR**:
   - Dikkat edilmesi gereken riskler
   - Olası senaryor

7. **SONUÇ VE TAVSİYELER**:
   - Genel değerlendirme
   - Yatırımcılara öneriler

Yanıtı JSON formatında ver:
{
  "date": "${date}",
  "title": "Günün başlığı",
  "trend": "bullish" veya "bearish" veya "neutral",
  "summary": "Kısa özet (max 3 cümle)",
  "btcPrice": tahmini BTC fiyatı (sayı olarak),
  "ethPrice": tahmini ETH fiyatı (sayı olarak),
  "fullAnalysis": "Tam analiz metni (yukarıdaki tüm bölümler markdown formatında)",
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
    "btcDominance": "XX.X%" formatında
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
      return JSON.parse(jsonMatch[0]);
    }
    
    throw new Error('Could not parse JSON from response');
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw error;
  }
}

export async function chatWithAI(message, context = '') {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const prompt = `Sen kripto para ve blockchain konusunda uzman bir AI asistanısın. Kullanıcının sorularını Türkçe olarak yanıtla. Yanıtların bilgilendirici, profesyonel ve anlaşılır olmalı. Yatırım tavsiyesi değil, sadece bilgi ve analiz sunduğunu belirt.

${context ? `Bağlam: ${context}\n\n` : ''}

Kullanıcı sorusu: ${message}

Kısa ve öz bir yanıt ver (maksimum 150 kelime). Emojiler kullanabilirsin.`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini Chat Error:', error);
    throw error;
  }
}
