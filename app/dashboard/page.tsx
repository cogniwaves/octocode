export default function DashboardPage() {
  return (
    <div className="md-surface-container min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="md-typescale-display-medium mb-2">Dashboard</h1>
          <p className="md-typescale-body-large text-on-surface-variant">
            Monitor your AI development workflows
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="md-surface md-elevation-1 p-6 rounded-large">
            <h3 className="md-typescale-title-large mb-2">Active Projects</h3>
            <div className="md-typescale-display-large text-primary">0</div>
            <p className="md-typescale-body-small text-on-surface-variant mt-1">
              Projects in development
            </p>
          </div>

          <div className="md-surface md-elevation-1 p-6 rounded-large">
            <h3 className="md-typescale-title-large mb-2">Running Tasks</h3>
            <div className="md-typescale-display-large text-secondary">0</div>
            <p className="md-typescale-body-small text-on-surface-variant mt-1">
              Tasks being processed
            </p>
          </div>

          <div className="md-surface md-elevation-1 p-6 rounded-large">
            <h3 className="md-typescale-title-large mb-2">Completed Today</h3>
            <div className="md-typescale-display-large text-tertiary">0</div>
            <p className="md-typescale-body-small text-on-surface-variant mt-1">
              Tasks finished today
            </p>
          </div>
        </div>

        <div className="md-surface md-elevation-1 rounded-large p-6">
          <h2 className="md-typescale-headline-small mb-4">Recent Activity</h2>
          <div className="text-center py-12">
            <p className="md-typescale-body-large text-on-surface-variant">
              No recent activity to display
            </p>
            <p className="md-typescale-body-medium text-on-surface-variant mt-2">
              Start by creating a new project
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}