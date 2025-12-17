export default function StatusPage() {
  return (
    <div className="content">
      <div className="card">
        <h2>Status</h2>
        <p>Health endpoints expose /api/health for DB connectivity and /api/ready for migration status.</p>
        <ul>
          <li>App uptime: tracked via deployment platform</li>
          <li>Database: PostgreSQL with Prisma migrations</li>
          <li>Logging: JSON structured output</li>
        </ul>
      </div>
    </div>
  );
}
