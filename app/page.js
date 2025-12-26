import Link from 'next/link';
import MarketStats from '@/components/MarketStats';
import AnalysisCard from '@/components/AnalysisCard';
import { getAllAnalyses, getLatestAnalysis } from '@/lib/analysisManager';

export default function Home() {
  const analyses = getAllAnalyses();
  const latestAnalysis = getLatestAnalysis();

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
    <main className="container">
      {/* Header */}
      <header className="header">
        <h1>Kripto AI Analiz Platformu</h1>
        <p>Yapay zeka destekli günlük kripto piyasa analizleri, teknik göstergeler ve profesyonel yorumlar</p>
      </header>

      {/* Market Stats */}
      <MarketStats stats={latestAnalysis?.marketStats} />

      {/* Today's Analysis */}
      {latestAnalysis && (
        <section>
          <div className="section-header">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            <div>
              <h2>Günün Analizi</h2>
              <p>En son yapay zeka analizi</p>
            </div>
          </div>

          <article className="today-analysis">
            <div className="analysis-meta">
              <div className="analysis-date">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                {formatDate(latestAnalysis.date)}
              </div>
              <span className={`badge ${getTrendBadge(latestAnalysis.trend).class}`}>
                {getTrendBadge(latestAnalysis.trend).text}
              </span>
              <span className="badge badge-today">BUGÜNÜN ANALİZİ</span>
            </div>
            <h3>{latestAnalysis.title}</h3>
            <p className="summary">{latestAnalysis.summary}</p>
            <Link href={`/analiz/${latestAnalysis.date}`} className="read-more">
              Detaylı Analizi Oku
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </Link>
          </article>
        </section>
      )}

      {/* Past Analyses */}
      {analyses.length > 1 && (
        <section>
          <div className="section-header">
            <h2>Geçmiş Analizler</h2>
            <p>Önceki günlerin detaylı piyasa yorumlarına göz atın</p>
          </div>

          <div className="analysis-grid">
            {analyses.slice(1, 7).map((analysis) => (
              <AnalysisCard key={analysis.date} analysis={analysis} />
            ))}
          </div>
        </section>
      )}

      {/* Empty State */}
      {analyses.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
            Henüz analiz bulunmuyor. İlk analizi oluşturmak için API&apos;yi kullanın.
          </p>
        </div>
      )}

      <footer style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
        <p>© 2024 Kripto AI Analiz Platformu. Bu site yatırım tavsiyesi vermez.</p>
      </footer>
    </main>
  );
}
