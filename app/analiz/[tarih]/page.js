import Link from 'next/link';
import { getAnalysisByDate, getAllAnalyses } from '@/lib/analysisManager';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const analyses = getAllAnalyses();
  return analyses.map((analysis) => ({
    tarih: analysis.date,
  }));
}

export async function generateMetadata({ params }) {
  const { tarih } = await params;
  const analysis = getAnalysisByDate(tarih);
  
  if (!analysis) {
    return { title: 'Analiz Bulunamadı' };
  }
  
  return {
    title: `${analysis.title} | Kripto AI Analiz`,
    description: analysis.summary,
  };
}

export default async function AnalysisPage({ params }) {
  const { tarih } = await params;
  const analysis = getAnalysisByDate(tarih);
  
  if (!analysis) {
    notFound();
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const getTrendBadge = (trend) => {
    if (trend === 'bullish') return { class: 'badge-bullish', text: 'Yükseliş' };
    if (trend === 'bearish') return { class: 'badge-bearish', text: 'Düşüş' };
    return { class: 'badge-neutral', text: 'Yatay' };
  };

  return (
    <main className="container" style={{ paddingTop: '40px' }}>
      {/* Back Link */}
      <Link href="/" className="back-link">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        Analizlere Dön
      </Link>

      {/* Header */}
      <header className="detail-header">
        <div className="meta">
          <div className="analysis-date">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            {formatDate(analysis.date)}
          </div>
          <span className={`badge ${getTrendBadge(analysis.trend).class}`}>
            {getTrendBadge(analysis.trend).text}
          </span>
        </div>
        <h1>{analysis.title}</h1>
        <p className="description">{analysis.summary}</p>
      </header>

      {/* Technical Indicators & Price Targets */}
      <div className="indicators-section">
        <div className="indicator-card">
          <h3>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
              <polyline points="17 6 23 6 23 12"></polyline>
            </svg>
            Teknik Göstergeler
          </h3>
          <div className="indicator-row">
            <span className="label">RSI (14)</span>
            <span className={`value ${analysis.technicalIndicators?.rsi > 70 ? 'negative' : analysis.technicalIndicators?.rsi < 30 ? 'positive' : ''}`}>
              {analysis.technicalIndicators?.rsi}
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </span>
          </div>
          <div className="indicator-row">
            <span className="label">MACD</span>
            <span className={`value ${analysis.technicalIndicators?.macd?.includes('Bullish') ? 'positive' : analysis.technicalIndicators?.macd?.includes('Bearish') ? 'negative' : ''}`}>
              {analysis.technicalIndicators?.macd}
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </span>
          </div>
          <div className="indicator-row">
            <span className="label">50 Günlük MA</span>
            <span className="value positive">
              ${analysis.technicalIndicators?.ma50?.toLocaleString()}
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </span>
          </div>
          <div className="indicator-row">
            <span className="label">200 Günlük MA</span>
            <span className="value positive">
              ${analysis.technicalIndicators?.ma200?.toLocaleString()}
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </span>
          </div>
        </div>

        <div className="indicator-card">
          <h3>Hedef Fiyatlar</h3>
          <div className="indicator-row">
            <span className="label">Kısa Vadeli Hedef</span>
            <span className="value positive">${analysis.priceTargets?.shortTerm?.toLocaleString()}</span>
          </div>
          <div className="indicator-row">
            <span className="label">Orta Vadeli Hedef</span>
            <span className="value positive">${analysis.priceTargets?.midTerm?.toLocaleString()}</span>
          </div>
          <div className="indicator-row">
            <span className="label">Destek Seviyesi</span>
            <span className="value">${analysis.priceTargets?.support?.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Key Points & Risks */}
      <div className="points-grid">
        <div className="points-card">
          <h3 className="positive">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            Önemli Noktalar
          </h3>
          <ul>
            {analysis.keyPoints?.map((point, idx) => (
              <li key={idx}>{point}</li>
            ))}
          </ul>
        </div>

        <div className="points-card">
          <h3 className="negative">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            Riskler ve Uyarılar
          </h3>
          <ul>
            {analysis.risks?.map((risk, idx) => (
              <li key={idx}>{risk}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Full Analysis */}
      {analysis.fullAnalysis && (
        <article className="full-analysis">
          <div dangerouslySetInnerHTML={{ 
            __html: analysis.fullAnalysis
              .replace(/## /g, '<h2>')
              .replace(/### /g, '<h3>')
              .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
              .replace(/\n- /g, '<br>• ')
              .replace(/\n\n/g, '</p><p>')
              .replace(/<h2>/g, '</p><h2>')
              .replace(/<h3>/g, '</p><h3>')
          }} />
        </article>
      )}

      {/* Disclaimer */}
      <div className="disclaimer">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
          <line x1="12" y1="9" x2="12" y2="13"></line>
          <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
        <p>Bu analiz bilgilendirme amaçlıdır ve yatırım tavsiyesi değildir. Kripto para yatırımları yüksek risk içerir. Yatırım kararlarınızı verirken kendi araştırmanızı yapın ve profesyonel danışmanlık alın.</p>
      </div>
    </main>
  );
}
