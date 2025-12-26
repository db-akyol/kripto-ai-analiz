import Link from 'next/link';

export default function AnalysisCard({ analysis }) {
  const getTrendIcon = (trend) => {
    if (trend === 'bullish' || trend === 'Yükseliş') {
      return (
        <div className="trend-icon up">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
            <polyline points="17 6 23 6 23 12"></polyline>
          </svg>
        </div>
      );
    } else if (trend === 'bearish' || trend === 'Düşüş') {
      return (
        <div className="trend-icon down">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline>
            <polyline points="17 18 23 18 23 12"></polyline>
          </svg>
        </div>
      );
    }
    return (
      <div className="trend-icon neutral">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="20" x2="18" y2="10"></line>
          <line x1="12" y1="20" x2="12" y2="4"></line>
          <line x1="6" y1="20" x2="6" y2="14"></line>
        </svg>
      </div>
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  return (
    <Link href={`/analiz/${analysis.date}`}>
      <div className="analysis-card">
        <div className="card-header">
          <div className="card-date">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            {formatDate(analysis.date)}
          </div>
          {getTrendIcon(analysis.trend)}
        </div>
        <h4>{analysis.title}</h4>
        <p className="card-summary">{analysis.summary}</p>
        <div className="prices">
          <div className="price-item">
            <span className="price-label">Bitcoin</span>
            <span className="price-value btc">${analysis.btcPrice?.toLocaleString()}</span>
          </div>
          <div className="price-item">
            <span className="price-label">Ethereum</span>
            <span className="price-value eth">${analysis.ethPrice?.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
