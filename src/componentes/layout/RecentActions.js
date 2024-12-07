import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function RecentActions() {
  const [recentes, setRecentes] = useState([]);
  const navigate = useNavigate()

  useEffect(() => {
    const recentSearches = JSON.parse(localStorage.getItem('recentes')) || [];
    setRecentes(recentSearches);
  }, []);

  const handleRecentClick = (ticker) => {
    navigate(`/stats?ticker=${ticker}`);
  };

  return (
    <section className="recent-actions">
      <h2>Ativos Recentemente Pesquisados</h2>
      <div id="recentes-container" className="recentes-container">
        {recentes.length === 0 ? (
          <p>Nenhuma pesquisa recente.</p>
        ) : (
          recentes.map((ticker) => (
            <div key={ticker} className="recent-item" onClick={() => handleRecentClick(ticker)}>
              {ticker}
            </div>
          ))
        )}
      </div>
    </section>
  );
}

export default RecentActions;
