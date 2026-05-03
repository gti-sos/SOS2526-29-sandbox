<script>
  // Comprobamos si el frontend se esta ejecutando con Vite en local.
  const isViteLocal =
    window.location.hostname === "localhost" && window.location.port === "5173";

  // API_ORIGIN apunta al backend real cuando usamos Vite.
  const API_ORIGIN = isViteLocal
    ? "http://localhost:10000"
    : window.location.origin;

  // Informacion general del grupo.
  const group = {
    name: "SOS2526-29",
    description:
      "Proyecto de análisis de datos integrando desastres naturales, estadísticas urbanas y datos vinícolas.",
    repository: "https://github.com/gti-sos/SOS2526-29",
    deployUrl: isViteLocal
      ? "http://localhost:10000/"
      : `${window.location.origin}/`
  };

  // Lista de miembros y enlaces asociados a cada recurso.
  const members = [
    {
      name: "Rufino Moreno Pacheco",
      resource: "wine-stats",
      source: "wine-stats",
      frontendUrl: "/wine-stats",
      analyticsUrl: "/analytics/wine-stats",
      apiLinks: [
        {
          id: "api-v1-wine-stats",
          label: "API v1",
          url: `${API_ORIGIN}/api/v1/wine-stats`
        }
      ],
      docsLinks: [
        {
          id: "docs-v1-wine-stats",
          label: "Documentacion Postman v1",
          url: `${API_ORIGIN}/api/v1/wine-stats/docs`
        }
      ]
    },
    {
      name: "Luis Cortes Cobos (LCC)",
      resource: "citys-stats",
      source: "citys-stats",
      frontendUrl: "/citys-stats",
      analyticsUrl: "/analytics/citys-stats",
      apiLinks: [
        {
          id: "api-v1-citys-stats",
          label: "API v1",
          url: `${API_ORIGIN}/api/v1/citys-stats`
        },
        {
          id: "api-v2-citys-stats",
          label: "API v2",
          url: `${API_ORIGIN}/api/v2/citys-stats`
        }
      ],
      docsLinks: [
        {
          id: "docs-v1-citys-stats",
          label: "Documentacion Postman v1",
          url: `${API_ORIGIN}/api/v1/citys-stats/docs`
        },
        {
          id: "docs-v2-citys-stats",
          label: "Documentacion Postman v2",
          url: `${API_ORIGIN}/api/v2/citys-stats/docs`
        }
      ]
    },
    {
      name: "Alberto Lirola Gomez",
      resource: "natural-disasters",
      source: "natural-disasters",
      frontendUrl: "/natural-disasters",
      analyticsUrl: "/analytics/natural-disasters",
      apiLinks: [
        {
          id: "api-v1-natural-disasters",
          label: "API v1",
          url: `${API_ORIGIN}/api/v1/natural-disasters`
        },
        {
          id: "api-v2-natural-disasters",
          label: "API v2",
          url: `${API_ORIGIN}/api/v2/natural-disasters`
        }
      ],
      docsLinks: [
        {
          id: "docs-v1-natural-disasters",
          label: "Documentacion Postman v1",
          url: `${API_ORIGIN}/api/v1/natural-disasters/docs`
        },
        {
          id: "docs-v2-natural-disasters",
          label: "Documentacion Postman v2",
          url: `${API_ORIGIN}/api/v2/natural-disasters/docs`
        }
      ]
    }
  ];
</script>

<svelte:head>
  <title>SOS2526-29 | Inicio</title>
</svelte:head>

<div class="container">
  <header class="hero">
    <div class="hero-content">
      <h1 class="title">{group.name}</h1>
      <p class="description">{group.description}</p>
      <div class="hero-links">
        <a href={group.repository} target="_blank" rel="noreferrer" class="link-github">
          <span class="icon">📦</span> GitHub
        </a>
        <a href={group.deployUrl} target="_blank" rel="noreferrer" class="link-deploy">
          <span class="icon">🚀</span> Despliegue
        </a>
      </div>
    </div>
  </header>

  <main class="content">
    <h2 class="section-title">Proyectos del Equipo</h2>
    <div class="projects-grid">
      {#each members as member}
        <div class="project-card" data-testid={`member-${member.resource}`}>
          <div class="card-header">
            <h3 class="card-title">{member.name}</h3>
            <span class="badge">{member.resource}</span>
          </div>
          
          <div class="card-body">
            <p class="card-info">
              <span class="label">API:</span> {member.resource}
            </p>
            <p class="card-info">
              <span class="label">Datos:</span> {member.source}
            </p>
          </div>

          <div class="card-actions">
            <a href={member.frontendUrl} data-testid={`frontend-${member.resource}`} class="btn btn-primary">
              <span class="btn-icon">🎯</span> Frontend
            </a>
            
            <a href={member.analyticsUrl} data-testid={`analytics-${member.resource}`} class="btn btn-secondary">
              <span class="btn-icon">📊</span> Analytics
            </a>

            <div class="api-links">
              {#each member.apiLinks as link}
                <a href={link.url} target="_blank" rel="noreferrer" data-testid={link.id} class="btn btn-outline">
                  {link.label}
                </a>
              {/each}
              
              {#each member.docsLinks as link}
                <a href={link.url} target="_blank" rel="noreferrer" data-testid={link.id} class="btn btn-outline">
                  📚 {link.label}
                </a>
              {/each}
            </div>
          </div>
        </div>
      {/each}
    </div>
  </main>
</div>
<style>
  :global(body) {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
    color: #f1f5f9;
    min-height: 100vh;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem 1rem;
  }

  .hero {
    text-align: center;
    margin-bottom: 4rem;
    padding: 3rem 0;
  }

  .hero-content {
    max-width: 800px;
    margin: 0 auto;
  }

  .title {
    font-size: 3.5rem;
    font-weight: 700;
    margin-bottom: 1rem;
    background: linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .description {
    font-size: 1.25rem;
    color: #94a3b8;
    margin-bottom: 2rem;
    line-height: 1.6;
  }

  .hero-links {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
  }

  .hero-links a {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    text-decoration: none;
    font-weight: 500;
    transition: all 0.2s ease;
  }

  .link-github {
    background: rgba(99, 102, 241, 0.1);
    border: 1px solid #6366f1;
    color: #a5b4fc;
  }

  .link-github:hover {
    background: rgba(99, 102, 241, 0.2);
    transform: translateY(-2px);
  }

  .link-deploy {
    background: rgba(34, 197, 94, 0.1);
    border: 1px solid #22c55e;
    color: #86efac;
  }

  .link-deploy:hover {
    background: rgba(34, 197, 94, 0.2);
    transform: translateY(-2px);
  }

  .content {
    margin-top: 2rem;
  }

  .section-title {
    font-size: 2rem;
    font-weight: 600;
    text-align: center;
    margin-bottom: 3rem;
    color: #f1f5f9;
  }

  .projects-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 2rem;
  }

  .project-card {
    background: rgba(30, 41, 59, 0.5);
    border: 1px solid rgba(148, 163, 184, 0.1);
    border-radius: 1rem;
    padding: 1.5rem;
    backdrop-filter: blur(10px);
    transition: all 0.3s ease;
  }

  .project-card:hover {
    transform: translateY(-4px);
    border-color: rgba(99, 102, 241, 0.3);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1rem;
  }

  .card-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #f1f5f9;
    margin: 0;
  }

  .badge {
    background: rgba(99, 102, 241, 0.2);
    color: #a5b4fc;
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    font-size: 0.875rem;
    font-weight: 500;
  }

  .card-body {
    margin-bottom: 1.5rem;
  }

  .card-info {
    display: flex;
    margin-bottom: 0.5rem;
    color: #94a3b8;
  }

  .label {
    font-weight: 600;
    margin-right: 0.5rem;
    color: #cbd5e1;
  }

  .card-actions {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;
    text-decoration: none;
    font-weight: 500;
    transition: all 0.2s ease;
    border: none;
    cursor: pointer;
  }

  .btn-primary {
    background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
    color: white;
  }

  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.3);
  }

  .btn-secondary {
    background: rgba(168, 85, 247, 0.1);
    border: 1px solid #a855f7;
    color: #c4b5fd;
  }

  .btn-secondary:hover {
    background: rgba(168, 85, 247, 0.2);
    transform: translateY(-2px);
  }

  .btn-outline {
    background: transparent;
    border: 1px solid rgba(148, 163, 184, 0.3);
    color: #94a3b8;
    font-size: 0.875rem;
  }

  .btn-outline:hover {
    background: rgba(148, 163, 184, 0.1);
    border-color: rgba(148, 163, 184, 0.5);
  }

  .api-links {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .icon {
    font-size: 1.25rem;
  }

  .btn-icon {
    font-size: 1rem;
  }

  @media (max-width: 768px) {
    .container {
      padding: 1rem;
    }

    .title {
      font-size: 2.5rem;
    }

    .projects-grid {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }

    .hero-links {
      flex-direction: column;
      align-items: center;
    }
  }
</style>
