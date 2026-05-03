<script>
  // onDestroy limpia la grafica al salir; tick espera a que Svelte pinte el HTML.
  import { onDestroy, onMount, tick } from "svelte";
  // Importamos datos de las tres APIs.
  import { getAllCitysStats } from "../services/citysStatsApi";
  import { getDisasters } from "../services/natural-disasters.js";
  import { getAllWineStats } from "../services/wine-stats.js";
  import { hcLightText } from "../lib/highcharts-light-surface.js";

  // Referencia a la libreria Highcharts cargada de forma dinamica.
  let Highcharts;
  // Elemento HTML donde se dibuja la grafica.
  let chartContainer;
  // Objeto de grafica creado por Highcharts.
  let chart;
  // Estado de carga.
  let loading = true;
  // Mensaje de error si falla alguna API.
  let error = "";
  // Metricas combinadas de las tres APIs.
  let metrics = [];
  let chartContainer2;
  let chart2;

  // Formateador para mostrar numeros con separadores espanoles.
  const formatter = new Intl.NumberFormat("es-ES", {
    maximumFractionDigits: 0
  });

  // Suma un campo numerico de una lista de objetos.
  function sum(items, field) {
    return items.reduce((total, item) => total + Number(item[field] || 0), 0);
  }

  // Carga Highcharts solo cuando hace falta.
  async function loadHighcharts() {
    if (Highcharts) return Highcharts;

    const module = await import("highcharts");
    Highcharts = module.default;
    window._Highcharts = Highcharts;
    await import("highcharts/modules/accessibility.js");

    return Highcharts;
  }

  // Convierte datos de las APIs en metricas para la grafica.
  function buildMetrics(citysStats, disasters, wines) {
    const raw = [
      {
        name: "LCC citys-stats",
        records: citysStats.length,
        indicatorName: "Poblacion total 2025",
        indicator: sum(citysStats, "un_2025_population")
      },
      {
        name: "ALG natural-disasters",
        records: disasters.length,
        indicatorName: "Muertes registradas",
        indicator: sum(disasters, "death_count")
      },
      {
        name: "RMP wine-stats",
        records: wines.length,
        indicatorName: "Unidades disponibles",
        indicator: sum(wines, "unit")
      }
    ];

    const maxIndicator = Math.max(...raw.map((item) => item.indicator), 1);

    return raw.map((item) => ({
      ...item,
      index: Number(((item.indicator / maxIndicator) * 100).toFixed(2))
    }));
  }

  // Dibuja la grafica de columnas.
  function renderChart() {
    if (!chartContainer || !chartContainer2) return;

    chart?.destroy();
    chart2?.destroy();

  const colors = ["#0f766e", "#dc2626", "#7c3aed"];

  // GRÁFICO 1 — Número de registros
  chart = Highcharts.chart(chartContainer, {
    chart: { type: "bar", backgroundColor: "transparent" },
    title: {
      text: "Registros por API",
      align: "left",
      style: hcLightText.title
    },
    subtitle: {
      text: "Número total de recursos en cada colección",
      align: "left",
      style: hcLightText.subtitle
    },
    accessibility: { enabled: true, description: "Gráfico de barras con el número de registros de cada API." },
    credits: { enabled: false },
    legend: { enabled: false },
    xAxis: {
      categories: metrics.map(m => m.name),
      title: { text: null },
      labels: { style: { color: hcLightText.axis.color } },
      lineColor: hcLightText.line,
      tickColor: hcLightText.line
    },
    yAxis: {
      min: 0,
      title: { text: "Registros", style: { color: hcLightText.axis.color } },
      labels: { style: { color: hcLightText.axis.color } },
      gridLineColor: hcLightText.grid,
      lineWidth: 1,
      lineColor: hcLightText.line,
      tickColor: hcLightText.line
    },
    tooltip: {
      formatter() {
        const metric = metrics[this.point.index];
        return `<b>${metric.name}</b><br/>Registros: <b>${formatter.format(metric.records)}</b>`;
      }
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        dataLabels: {
          enabled: true,
          format: "{y}",
          style: hcLightText.dataLabel
        },
        colorByPoint: true,
        colors
      }
    },
    series: [{ name: "Registros", data: metrics.map(m => m.records) }]
  });

  // GRÁFICO 2 — Indicador principal normalizado
  chart2 = Highcharts.chart(chartContainer2, {
    chart: { type: "bar", backgroundColor: "transparent" },
    title: {
      text: "Indicador principal normalizado (0-100)",
      align: "left",
      style: hcLightText.title
    },
    subtitle: {
      text: "Comparación relativa del indicador principal de cada API",
      align: "left",
      style: hcLightText.subtitle
    },
    accessibility: { enabled: true, description: "Gráfico de barras con el indicador normalizado de cada API." },
    credits: { enabled: false },
    legend: { enabled: false },
    xAxis: {
      categories: metrics.map(m => m.name),
      title: { text: null },
      labels: { style: { color: hcLightText.axis.color } },
      lineColor: hcLightText.line,
      tickColor: hcLightText.line
    },
    yAxis: {
      min: 0,
      max: 100,
      title: { text: "Índice (0-100)", style: { color: hcLightText.axis.color } },
      labels: { style: { color: hcLightText.axis.color } },
      gridLineColor: hcLightText.grid,
      lineWidth: 1,
      lineColor: hcLightText.line,
      tickColor: hcLightText.line
    },
    tooltip: {
      formatter() {
        const metric = metrics[this.point.index];
        return `<b>${metric.name}</b><br/>${metric.indicatorName}: <b>${formatter.format(metric.indicator)}</b><br/>Índice: <b>${metric.index}</b>`;
      }
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        dataLabels: {
          enabled: true,
          format: "{y}",
          style: hcLightText.dataLabel
        },
        colorByPoint: true,
        colors
      }
    },
    series: [{ name: "Índice", data: metrics.map(m => m.index) }]
  });
  }

  // Carga datos de las tres APIs y luego pinta la grafica.
  async function loadAnalytics() {
    loading = true;
    error = "";

    try {
      const [citysStats, disasters, wines] = await Promise.all([
        getAllCitysStats(),
        getDisasters(),
        getAllWineStats()
      ]);

      metrics = buildMetrics(citysStats, disasters, wines);
      loading = false;
      await tick();
      await loadHighcharts();
      renderChart();
    } catch (e) {
      error = e.message || "No se pudieron cargar los datos de analytics.";
      loading = false;
    }
  }

  // Al abrir la pantalla, cargamos las analiticas.
  onMount(loadAnalytics);

  // Al salir, destruimos la grafica para liberar memoria.
  onDestroy(() => {
    chart?.destroy();
    chart2?.destroy();
  });
</script>

<svelte:head>
  <title>Analytics | SOS2526-29</title>
</svelte:head>

<main class="analytics-page">
    <header class="analytics-header">
    <div>
      <p class="eyebrow">SOS2526-29</p>
      <h1>Analytics del grupo</h1>
      <p class="subtitle">Datos combinados de citys-stats, natural-disasters y wine-stats.</p>
    </div>
    <div class="header-links">
      <a class="primary-link" href="/analytics/wine-stats">📊 Wine Stats</a>
      <a class="primary-link" href="/analytics/citys-stats">📊 Citys Stats</a>
      <a class="primary-link" href="/analytics/natural-disasters">📊 Natural Disasters</a>
    </div>
  </header>

  {#if loading}
    <p class="state" role="status">Cargando datos de analytics...</p>
  {:else if error}
    <div class="message error" role="alert">{error}</div>
    {:else}
    <section class="chart-panel" aria-labelledby="group-chart-title">
      <h2 id="group-chart-title">Registros por API</h2>
      <div class="chart-frame" bind:this={chartContainer}></div>
    </section>

    <section class="chart-panel" aria-labelledby="group-chart-title-2">
      <h2 id="group-chart-title-2">Indicador principal normalizado</h2>
      <div class="chart-frame" bind:this={chartContainer2}></div>
    </section>

    <section class="metric-grid" aria-label="Resumen de metricas integradas">
      {#each metrics as metric}
        <article class="metric-card">
          <h3>{metric.name}</h3>
          <dl>
            <div>
              <dt>Registros</dt>
              <dd>{formatter.format(metric.records)}</dd>
            </div>
            <div>
              <dt>{metric.indicatorName}</dt>
              <dd>{formatter.format(metric.indicator)}</dd>
            </div>
          </dl>
        </article>
      {/each}
    </section>
  {/if}
</main>

<style>
  :global(body) {
    margin: 0;
    font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
    background: #f6f7fb;
    color: #111827;
    color-scheme: light;
  }

  .analytics-page {
    max-width: 1180px;
    margin: 0 auto;
    padding: 28px 16px 48px;
    text-align: left;
    color: #111827;
  }

  .analytics-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 20px;
    margin-bottom: 24px;
    padding: 26px 28px;
    border-radius: 20px;
    background: linear-gradient(135deg, #0f172a 0%, #1e293b 72%, #172554 100%);
    border: 1px solid rgba(255, 255, 255, 0.14);
    box-shadow: 0 20px 45px rgba(15, 23, 42, 0.28);
    color: #ffffff;
  }

  .analytics-header .eyebrow {
    margin: 0 0 8px;
    color: #ffffff;
    font-size: 0.82rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.12em;
  }

  h1,
  h2,
  h3,
  p {
    margin: 0;
  }

  .analytics-header h1 {
    color: #ffffff;
    font-size: clamp(2rem, 4vw, 3.1rem);
    line-height: 1.08;
    font-weight: 800;
    letter-spacing: -0.02em;
    text-shadow: 0 1px 16px rgba(0, 0, 0, 0.25);
  }

  h2 {
    color: #0f172a;
    font-size: 1.2rem;
    margin-bottom: 14px;
  }
    .header-links {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    justify-content: flex-end;
  }

  h3 {
    color: #0f172a;
    font-size: 1rem;
    margin-bottom: 14px;
  }

  .analytics-header .subtitle {
    margin-top: 12px;
    color: #ffffff;
    font-size: 1.05rem;
    line-height: 1.55;
    max-width: 680px;
    font-weight: 500;
  }

  .analytics-header .primary-link {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 42px;
    padding: 0 16px;
    border-radius: 10px;
    background: #ffffff;
    color: #0f172a;
    text-decoration: none;
    font-weight: 700;
    white-space: nowrap;
    border: 2px solid rgba(255, 255, 255, 0.35);
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.2);
  }

  .analytics-header .primary-link:hover {
    background: #f1f5f9;
  }

  .chart-panel,
  .metric-card,
  .message,
  .state {
    border: 1px solid #d9e0ea;
    border-radius: 8px;
    background: #ffffff;
    box-shadow: 0 10px 28px rgba(15, 23, 42, 0.06);
  }

  .chart-panel {
    padding: 20px;
  }

  .chart-frame {
    min-height: 430px;
  }

  .metric-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 14px;
    margin-top: 16px;
  }

  .metric-card {
    padding: 16px;
  }

  dl {
    display: grid;
    gap: 12px;
    margin: 0;
  }

  dt {
    color: #64748b;
    font-size: 0.86rem;
  }

  dd {
    margin: 2px 0 0;
    color: #111827;
    font-size: 1.1rem;
    font-weight: 700;
  }

  .message,
  .state {
    padding: 16px;
  }

  .error {
    border-color: #fecaca;
    background: #fef2f2;
    color: #991b1b;
  }

  @media (max-width: 760px) {
    .analytics-header {
      align-items: stretch;
      flex-direction: column;
    }

    .analytics-header .primary-link {
      width: 100%;
      box-sizing: border-box;
    }

    .metric-grid {
      grid-template-columns: 1fr;
    }

    .chart-frame {
      min-height: 360px;
    }
  }
</style>
