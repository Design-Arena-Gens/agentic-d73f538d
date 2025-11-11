import { fetchGoldHistory } from "@/lib/gold";
import { generateIdeas } from "@/lib/analysis";

export const dynamic = 'force-dynamic';

function formatNumber(n: number, digits: number = 2) {
  return n.toLocaleString(undefined, { maximumFractionDigits: digits, minimumFractionDigits: digits });
}

export default async function Page() {
  let error: string | null = null;
  let points: Awaited<ReturnType<typeof fetchGoldHistory>> = [];
  try {
    points = await fetchGoldHistory("XAUUSD=X", "6mo", "1d");
  } catch (e: any) {
    error = e?.message ?? 'Failed to load data';
  }

  const ideas = points.length ? generateIdeas(points) : [];

  const last = points.length ? points.at(-1)!.close : 0;
  const prev = points.length > 1 ? points.at(-2)!.close : 0;
  const change = points.length > 1 ? last - prev : 0;
  const changePct = points.length > 1 ? (change / prev) * 100 : 0;

  const firstDate = points.length ? new Date(points[0].date).toLocaleDateString() : '-';
  const lastDate = points.length ? new Date(points.at(-1)!.date).toLocaleDateString() : '-';

  return (
    <div>
      <section className="kpis">
        <div className="kpi">
          <div className="label">Symbol</div>
          <div className="value">XAUUSD=X</div>
          <div className="muted">Yahoo Finance spot gold (USD)</div>
        </div>
        <div className="kpi">
          <div className="label">Last Price</div>
          <div className="value">${formatNumber(last, 2)}</div>
          <div className="muted">as of {lastDate}</div>
        </div>
        <div className="kpi">
          <div className="label">Daily Change</div>
          <div className="value" style={{color: change >= 0 ? '#065f46' : '#991b1b'}}>
            {change >= 0 ? '+' : ''}{formatNumber(change, 2)} ({change >= 0 ? '+' : ''}{formatNumber(changePct, 2)}%)
          </div>
          <div className="muted">vs prior close</div>
        </div>
        <div className="kpi">
          <div className="label">History Range</div>
          <div className="value">6 months</div>
          <div className="muted">{firstDate} ? {lastDate}</div>
        </div>
      </section>

      <section className="card">
        <h2>Trading Ideas</h2>
        {error && (
          <p className="muted">{error}. Showing section once data loads at runtime.</p>
        )}
        {points.length > 0 && (
        <table className="table">
          <thead>
            <tr>
              <th>Idea</th>
              <th>Type</th>
              <th>Confidence</th>
              <th>Rationale</th>
            </tr>
          </thead>
          <tbody>
            {ideas.map((idea, idx) => (
              <tr key={idx}>
                <td>{idea.title}</td>
                <td><span className={`badge ${idea.type}`}>{idea.type.toUpperCase()}</span></td>
                <td>{Math.round(idea.confidence * 100)}%</td>
                <td>{idea.reasoning}</td>
              </tr>
            ))}
          </tbody>
        </table>
        )}
      </section>

      <section className="card">
        <h2>About</h2>
        <p className="muted">
          Signals are computed from daily prices: moving average crossovers, RSI, Bollinger Bands, and 20-day breakouts.
          This is not financial advice.
        </p>
      </section>
    </div>
  );
}
