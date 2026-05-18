type Cattle = {
  id: string;
  tag: string;
  label?: string;
  status: string;
  origin?: string;
};

type WeightRecord = {
  id: string;
  cattleId: string;
  recordedAt: string;
  weight: number;
  unit: string;
};

type HealthEvent = {
  id: string;
  cattleId: string;
  eventDate: string;
  type: string;
  treatment?: string;
};

type CattleProfileProps = {
  cattle: Cattle;
  weights: WeightRecord[];
  healthEvents: HealthEvent[];
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "UTC"
  }).format(new Date(`${date}T00:00:00Z`));
}

function sortByDate<T extends { recordedAt?: string; eventDate?: string }>(records: T[]) {
  return [...records].sort((left, right) => {
    const leftDate = left.recordedAt ?? left.eventDate ?? "";
    const rightDate = right.recordedAt ?? right.eventDate ?? "";
    return leftDate.localeCompare(rightDate);
  });
}

export function CattleProfile({ cattle, weights, healthEvents }: CattleProfileProps) {
  const sortedWeights = sortByDate(weights);
  const sortedHealthEvents = sortByDate(healthEvents);
  const profileTitle = cattle.label || cattle.tag;

  return (
    <article className="cattle-profile">
      <header className="profile-header">
        <div>
          <p className="eyebrow">Perfil de hacienda</p>
          <h1>{profileTitle}</h1>
          <p>Caravana {cattle.tag}</p>
        </div>
        <span className="status-pill">{cattle.status}</span>
      </header>

      <section aria-labelledby="weight-history-title">
        <h2 id="weight-history-title">Historial de peso</h2>
        <ul aria-label="Historial de peso" className="record-list">
          {sortedWeights.map((weight) => (
            <li key={weight.id}>
              <span>{formatDate(weight.recordedAt)}</span>
              <strong>
                {weight.weight} {weight.unit}
              </strong>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="weight-chart-title">
        <h2 id="weight-chart-title">Grafico de peso</h2>
        {sortedWeights.length > 1 ? (
          <div
            aria-label="Grafico de peso en el tiempo"
            className="weight-chart"
            role="img"
          >
            {sortedWeights.map((weight) => (
              <span key={weight.id} style={{ height: `${Math.max(weight.weight / 6, 24)}px` }}>
                {weight.weight}
              </span>
            ))}
          </div>
        ) : (
          <p className="empty-state">No hay suficientes pesajes para mostrar un grafico.</p>
        )}
      </section>

      <section aria-labelledby="health-history-title">
        <h2 id="health-history-title">Sanidad</h2>
        {sortedHealthEvents.length > 0 ? (
          <ul className="record-list">
            {sortedHealthEvents.map((event) => (
              <li key={event.id}>
                <span>{formatDate(event.eventDate)}</span>
                <strong>{event.type}</strong>
                {event.treatment ? <p>{event.treatment}</p> : null}
              </li>
            ))}
          </ul>
        ) : (
          <p className="empty-state">No hay eventos sanitarios registrados.</p>
        )}
      </section>
    </article>
  );
}
