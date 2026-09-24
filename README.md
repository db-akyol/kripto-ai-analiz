# Kripto AI Analiz Platformu

Yapay zeka destekli günlük kripto para piyasası analizi yayınlayan bir Next.js uygulaması. Google Gemini modeli her gün için Bitcoin, Ethereum ve altcoin piyasasını kapsayan yapılandırılmış bir analiz üretiyor; uygulama bu analizleri teknik göstergeler, hedef fiyatlar, önemli noktalar ve risk başlıklarıyla birlikte sunuyor. Analizler JSON dosyaları olarak diske yazıldığı için sayfalar App Router ile sunucu tarafında, veritabanı olmadan render ediliyor. Ek olarak her sayfanın köşesinde kripto soruları yanıtlayan bir AI sohbet asistanı bulunuyor.

![Next.js](https://img.shields.io/badge/Next.js-14.2-000000?style=flat-square&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-18.2-61DAFB?style=flat-square&logo=react&logoColor=black)
![Google Gemini](https://img.shields.io/badge/Google%20Gemini-2.5%20Flash-4285F4?style=flat-square&logo=googlegemini&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES2022-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![CSS](https://img.shields.io/badge/CSS-Custom%20Properties-1572B6?style=flat-square&logo=css3&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-22c55e?style=flat-square)

---

## Özellikler

- **AI üretimli günlük analiz** — Gemini 2.5 Flash modeline verilen Türkçe uzman promptu, sabit şemaya sahip bir JSON döndürür: başlık, özet, trend (`bullish` / `bearish` / `neutral`), BTC & ETH fiyatı, markdown formatında tam analiz metni, teknik göstergeler, hedef fiyatlar, önemli noktalar, riskler ve piyasa istatistikleri.
- **Ana sayfa özeti** — En güncel analiz "Günün Analizi" olarak öne çıkarılır; altında son 6 geçmiş analiz kart ızgarasında listelenir. Hiç analiz yoksa boş durum ekranı gösterilir.
- **Piyasa istatistik paneli** — Toplam piyasa değeri, 24 saatlik hacim, aktif kullanıcı ve BTC dominansı kartları. Analizde veri yoksa bileşen kendi varsayılan değerlerine düşer.
- **Tarih bazlı detay sayfası** — `/analiz/[tarih]` rotası RSI (14), MACD, 50 ve 200 günlük hareketli ortalamaları; kısa/orta vadeli hedef ile destek seviyesini; önemli noktalar ve riskler listelerini ve tam analiz metnini gösterir.
- **Göstergeye göre renk mantığı** — RSI 70 üstü negatif, 30 altı pozitif olarak; MACD değeri `Bullish` / `Bearish` içeriğine göre renklendirilir. Trend rozetleri Yükseliş / Düşüş / Yatay olarak Türkçeleştirilir.
- **Kayan AI sohbet asistanı** — Kök layout'a yerleştirilmiş istemci bileşeni; `/api/chat` üzerinden Gemini'ye soru gönderir, yazma göstergesi ve otomatik kaydırma içerir, hata durumlarını kullanıcıya Türkçe mesajla bildirir.
- **Statik üretim** — `generateStaticParams` mevcut tüm analiz tarihlerini build sırasında üretir; `generateMetadata` her analiz için sayfa başlığı ve açıklamasını dinamik olarak oluşturur. Bulunmayan tarihlerde `notFound()` çalışır.
- **REST API katmanı** — Analizleri listeleme, tek tarih getirme, yeni analiz üretip kaydetme ve sohbet uç noktaları.
- **Cron'a hazır üretim scripti** — `scripts/generateAnalysis.js` günlük çalıştırılmak üzere tasarlanmıştır; o gün için dosya zaten varsa üretimi atlar.
- **Koyu tema arayüz** — CSS custom property'leri üzerine kurulu, 1024px ve 768px kırılımlarıyla duyarlı, 771 satırlık el yazımı stil dosyası.
- **Yasal uyarı** — Hem ana sayfada hem detay sayfasında içeriğin yatırım tavsiyesi olmadığına dair bilgilendirme yer alır.

---

## Teknolojiler

| Katman | Teknoloji | Versiyon |
| --- | --- | --- |
| Framework | [Next.js](https://nextjs.org) (App Router) | `^14.2.0` |
| UI | [React](https://react.dev) | `^18.2.0` |
| UI | React DOM | `^18.2.0` |
| Yapay zeka | [@google/generative-ai](https://www.npmjs.com/package/@google/generative-ai) | `^0.24.1` |
| Konfigürasyon | [dotenv](https://www.npmjs.com/package/dotenv) | `^17.2.3` |
| Derleme (dev) | [babel-plugin-react-compiler](https://www.npmjs.com/package/babel-plugin-react-compiler) | `1.0.0` |

Ek notlar:

- Dil: **JavaScript** (TypeScript kullanılmıyor).
- Stil: CSS framework'ü yok — tek bir `app/globals.css` dosyası ve CSS değişkenleri.
- Font: `next/font/google` üzerinden **Inter** (`display: swap`).
- `next.config.mjs` içinde `reactCompiler: true` bayrağı tanımlı, React Compiler babel eklentisi geliştirme bağımlılığı olarak ekli.
- `jsconfig.json` ile `@/*` yol takma adı proje köküne eşlenmiş.

---

## Mimari

### App Router yapısı

```
app/
├─ layout.js                     Kök layout: Inter fontu, metadata, global AIChat widget'ı
├─ page.js                       Ana sayfa (Server Component) — en güncel + geçmiş analizler
├─ globals.css                   Tüm arayüz stilleri
├─ analiz/[tarih]/page.js        Dinamik analiz detay sayfası (statik olarak üretilir)
└─ api/
   ├─ analysis/route.js          GET: tüm analizler · POST: yeni analiz üret ve kaydet
   ├─ analysis/[tarih]/route.js  GET: tek bir tarihin analizi
   └─ chat/route.js              POST: AI asistana mesaj gönder
```

### Veri kaynağı

Veritabanı **yoktur**. Her analiz `data/analyses/<YYYY-MM-DD>.json` dosyası olarak saklanır ve dosya adı aynı zamanda rota parametresidir.

`lib/analysisManager.js` bu dosya sistemi katmanını kapsüller:

| Fonksiyon | Görevi |
| --- | --- |
| `getAllAnalyses()` | Tüm JSON'ları okur, tarihe göre yeniden eskiye sıralar |
| `getAnalysisByDate(date)` | Tek tarihi okur, yoksa `null` döner |
| `getLatestAnalysis()` | En güncel analizi döner |
| `saveAnalysis(analysis)` | Analizi `<date>.json` olarak diske yazar |
| `analysisExistsForDate(date)` | Tarih için dosya var mı kontrol eder |

Tüm fonksiyonlar çağrılmadan önce `data/analyses` klasörünün varlığını garanti eder, bu yüzden klasör boşken de uygulama çalışır.

### Yapay zeka katmanı

`lib/gemini.js` iki fonksiyon sunar ve her ikisi de `gemini-2.5-flash` modelini kullanır:

- `generateAnalysis(date)` — Yapılandırılmış Türkçe analiz promptunu gönderir, yanıttaki JSON bloğunu regex ile ayıklayıp parse eder.
- `chatWithAI(message, context)` — Sohbet asistanının yanıtını üretir (maksimum 150 kelimelik kısa yanıt yönergesiyle).

### Veri akışı

```
scripts/generateAnalysis.js   ─┐
   (cron / manuel)             ├─► Gemini 2.5 Flash ─► JSON ─► data/analyses/<tarih>.json
POST /api/analysis            ─┘                                        │
                                                                        ▼
                                          lib/analysisManager ─► Server Components ─► HTML
```

Sohbet ise ayrı bir akıştır: `AIChat` bileşeni → `POST /api/chat` → `chatWithAI()` → Gemini.

### API uç noktaları

| Metot | Yol | Açıklama |
| --- | --- | --- |
| `GET` | `/api/analysis` | Tüm analizleri `{ analyses }` olarak döner |
| `POST` | `/api/analysis` | Gövdedeki `{ date }` için yeni analiz üretir ve kaydeder |
| `GET` | `/api/analysis/[tarih]` | İlgili tarihin analizini döner, yoksa `404` |
| `POST` | `/api/chat` | Gövdedeki `{ message }` için AI yanıtı döner |

### scripts/ klasörü

| Dosya | Görevi |
| --- | --- |
| `generateAnalysis.js` | Bugünün tarihiyle analiz üretip `data/analyses/` altına kaydeder. Dosya zaten varsa uyarı yazıp çıkar. Zamanlanmış görev (cron) olarak günlük çalıştırılmak üzere yazılmıştır. |
| `listModelsClean.js` | Generative Language API'sinden hesabın erişebildiği modelleri çeker, `generateContent` destekleyenleri listeler ve ilkiyle canlı bir test isteği atar. |
| `testModels.js` | Önceden tanımlı Gemini model adları listesini tek tek deneyerek hangilerinin çalıştığını, bulunamadığını veya kota sınırına takıldığını raporlar. |

Scriptler `.env.local` dosyasını `dotenv` ile okur ve CommonJS olarak doğrudan Node ile çalıştırılır.

---

## Ortam Değişkenleri

Proje kökünde bir `.env.local` dosyası oluşturun:

| Değişken | Zorunlu | Kullanıldığı yer | Açıklama |
| --- | --- | --- | --- |
| `GEMINI_API_KEY` | Evet | `lib/gemini.js`, `scripts/*.js` | Google AI Studio'dan alınan Generative Language API anahtarı. Analiz üretimi ve sohbet asistanı bu anahtar olmadan çalışmaz. |

```env
GEMINI_API_KEY=buraya_kendi_anahtarinizi_yazin
```

> `.env*` dosyaları `.gitignore` içinde tanımlıdır; anahtarlarınızı asla depoya göndermeyin.

---

## Kurulum

Gereksinimler: **Node.js 18.17+** (Next.js 14 için) ve npm.

```bash
# 1. Depoyu klonlayın
git clone https://github.com/<kullanici-adi>/kripto-news.git
cd kripto-news

# 2. Bağımlılıkları yükleyin
npm install

# 3. Ortam değişkenlerini tanımlayın
#    Kök dizinde .env.local oluşturup GEMINI_API_KEY değerini girin

# 4. (İsteğe bağlı) İlk analizi üretin
node scripts/generateAnalysis.js
```

Depodaki `data/analyses/` klasöründe örnek analiz dosyaları bulunduğu için, anahtar tanımlamadan da arayüzü inceleyebilirsiniz — yalnızca yeni analiz üretimi ve sohbet asistanı devre dışı kalır.

---

## Çalıştırma

```bash
npm run dev      # Geliştirme sunucusu — http://localhost:3000
npm run build    # Üretim derlemesi (analiz sayfaları statik olarak üretilir)
npm run start    # Derlenmiş uygulamayı üretim modunda başlatır
```

Yardımcı scriptler:

```bash
node scripts/generateAnalysis.js   # Bugünün analizini üret ve kaydet
node scripts/listModelsClean.js    # Erişilebilir Gemini modellerini listele
node scripts/testModels.js         # Model adaylarını tek tek test et
```

API üzerinden belirli bir tarih için analiz üretmek:

```bash
curl -X POST http://localhost:3000/api/analysis \
  -H "Content-Type: application/json" \
  -d '{"date":"2025-12-15"}'
```

> Not: Analiz sayfaları build aşamasında statik üretildiği için, üretim ortamında yeni eklenen bir analizin görünmesi için yeniden derleme gerekir.

---

## Proje Yapısı

```
kripto-news/
├─ app/
│  ├─ analiz/
│  │  └─ [tarih]/
│  │     └─ page.js              Analiz detay sayfası
│  ├─ api/
│  │  ├─ analysis/
│  │  │  ├─ [tarih]/route.js     Tek analiz uç noktası
│  │  │  └─ route.js             Listeleme + üretim uç noktası
│  │  └─ chat/route.js           AI sohbet uç noktası
│  ├─ globals.css                Koyu tema, CSS değişkenleri, duyarlı ızgaralar
│  ├─ layout.js                  Kök layout + global sohbet widget'ı
│  └─ page.js                    Ana sayfa
├─ components/
│  ├─ AIChat.js                  Kayan sohbet penceresi (Client Component)
│  ├─ AnalysisCard.js            Geçmiş analiz kartı + trend ikonu
│  └─ MarketStats.js             Piyasa istatistik kartları
├─ lib/
│  ├─ analysisManager.js         JSON tabanlı veri erişim katmanı
│  └─ gemini.js                  Gemini prompt'ları ve istemci sarmalayıcısı
├─ data/
│  └─ analyses/                  <YYYY-MM-DD>.json biçiminde analiz arşivi
├─ scripts/
│  ├─ generateAnalysis.js        Günlük analiz üretimi (cron)
│  ├─ listModelsClean.js         Model keşif aracı
│  └─ testModels.js              Model erişilebilirlik testi
├─ public/                       SVG ikonlar
├─ jsconfig.json                 @/* yol takma adı
├─ next.config.mjs               React Compiler bayrağı
└─ package.json
```

### Analiz JSON şeması

```jsonc
{
  "date": "2025-12-15",
  "title": "Günün başlığı",
  "trend": "bullish | bearish | neutral",
  "summary": "Kısa özet",
  "btcPrice": 0,
  "ethPrice": 0,
  "fullAnalysis": "Markdown biçiminde tam analiz metni",
  "technicalIndicators": { "rsi": 0, "rsiStatus": "", "macd": "", "ma50": 0, "ma200": 0 },
  "priceTargets": { "shortTerm": 0, "midTerm": 0, "support": 0 },
  "keyPoints": ["..."],
  "risks": ["..."],
  "marketStats": { "totalMarketCap": "", "volume24h": "", "btcDominance": "", "activeUsers": "" }
}
```

---

## Yasal Uyarı

Bu proje ve ürettiği içerikler yalnızca bilgilendirme ve teknik gösterim amaçlıdır; **yatırım tavsiyesi değildir**. Analizler bir dil modeli tarafından üretilir ve canlı piyasa verisine bağlı değildir. Kripto para yatırımları yüksek risk içerir.

---

## Lisans

Bu proje [MIT Lisansı](LICENSE) ile lisanslanmıştır.

Copyright (c) 2025 Deniz Akyol
