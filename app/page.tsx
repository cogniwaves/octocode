export default function HomePage() {
  return (
    <div className="md-surface-container min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="md-typescale-display-large mb-4">
            OctoCode
          </h1>
          <p className="md-typescale-title-large text-on-surface-variant">
            AI-Powered Development Platform
          </p>
          <p className="md-typescale-body-large mt-4 max-w-2xl mx-auto">
            Intelligent agents that automate software development workflows through decomposition, 
            specialization, and orchestration.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <div className="md-surface md-elevation-1 p-6 rounded-large">
            <h3 className="md-typescale-headline-small mb-3">Master Orchestrator</h3>
            <p className="md-typescale-body-medium text-on-surface-variant">
              Analyzes complex prompts and coordinates specialized agents for optimal workflow execution.
            </p>
          </div>

          <div className="md-surface md-elevation-1 p-6 rounded-large">
            <h3 className="md-typescale-headline-small mb-3">Specialist Agents</h3>
            <p className="md-typescale-body-medium text-on-surface-variant">
              Domain experts in Frontend, Backend, DevOps, and Database development.
            </p>
          </div>

          <div className="md-surface md-elevation-1 p-6 rounded-large">
            <h3 className="md-typescale-headline-small mb-3">Real-time Dashboard</h3>
            <p className="md-typescale-body-medium text-on-surface-variant">
              Live progress tracking with WebSocket-powered workflow visualization.
            </p>
          </div>
        </div>

        <div className="text-center">
          <div className="md-typescale-body-small text-on-surface-variant">
            Next.js 14 • TypeScript • Prisma • Material Design 3 • Docker
          </div>
        </div>
      </div>
    </div>
  )
}