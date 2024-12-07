import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const caminho = process.env.REACT_APP_API_URL

function Rankings() {
  const [rankings, setRankings] = useState({ maioresValores: [], earnings: [], receitas: [] });

  useEffect(() => {
    async function carregarRankings() {
      try {
        const responseMaioresValores = await fetch(`${caminho}/maiores-valores`);
        const maioresValoresData = await responseMaioresValores.json();
        const responseEarnings = await fetch(`${caminho}/earnings`);
        const earningsData = await responseEarnings.json();
        const responseReceitas = await fetch(`${caminho}/receitas`);
        const receitasData = await responseReceitas.json();
        setRankings({ maioresValores: maioresValoresData, earnings: earningsData, receitas: receitasData });
      } catch (error) {
        console.error('Erro ao carregar os rankings:', error);
      }
    }

    carregarRankings();
  }, []);

  return (
    <section className="rankings">
      <h2>Rankings de Ações</h2>
      <div className="cards">
        <div className="card">
          <h3>📈 Maiores Valores</h3>
          <ul id="maiores-valores">
            {rankings.maioresValores.map(item => (
              <li key={item.ticker}>
                <Link to={`/stats?ticker=${encodeURIComponent(item.ticker)}`} className="ranking-link">
                  {item.ticker}: R$ {item.valor.toFixed(2)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="card">
          <h3>💰 Earnings per Share</h3>
          <ul id="earnings">
            {rankings.earnings.map(item => (
              <li key={item.ticker}>
                <Link to={`/stats?ticker=${encodeURIComponent(item.ticker)}`} className="ranking-link">
                  {item.ticker}: {typeof item.earnings_per_share === 'number' ? item.earnings_per_share.toFixed(2) : 'N/A'}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="card">
          <h3>📊 Receitas</h3>
          <ul id="receitas">
            {rankings.receitas.map(item => (
              <li key={item.ticker}>
                <Link to={`/stats?ticker=${encodeURIComponent(item.ticker)}`} className="ranking-link">
                  {item.ticker}: {item.receita || 'N/A'}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export default Rankings;
