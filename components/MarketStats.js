export default function MarketStats({ stats }) {
  const defaultStats = {
    totalMarketCap: '$1.7T',
    volume24h: '$92.4B',
    activeUsers: '420M',
    btcDominance: '52.3%'
  };

  const data = stats || defaultStats;

  return (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.944 17.97L4.58 13.62 11.943 24l7.37-10.38-7.372 4.35h.003zM12.056 0L4.69 12.223l7.365 4.354 7.365-4.35L12.056 0z"/>
          </svg>
          Toplam Piyasa Değeri
        </div>
        <div className="value">{data.totalMarketCap}</div>
      </div>
      
      <div className="stat-card">
        <div className="icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
            <polyline points="17 6 23 6 23 12"></polyline>
          </svg>
          24s Hacim
        </div>
        <div className="value">{data.volume24h}</div>
      </div>
      
      <div className="stat-card">
        <div className="icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
          Aktif Kullanıcı
        </div>
        <div className="value">{data.activeUsers}</div>
      </div>
      
      <div className="stat-card">
        <div className="icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="20" x2="18" y2="10"></line>
            <line x1="12" y1="20" x2="12" y2="4"></line>
            <line x1="6" y1="20" x2="6" y2="14"></line>
          </svg>
          BTC Dominansı
        </div>
        <div className="value">{data.btcDominance}</div>
      </div>
    </div>
  );
}
