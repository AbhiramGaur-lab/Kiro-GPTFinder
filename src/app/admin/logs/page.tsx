import { DashboardShell } from '../../../components/DashboardShell';
import { UserRole } from '@prisma/client';

export default function LogsPage() {
  return (
    <DashboardShell role={UserRole.ADMIN}>
      <div className="card">
        <h2>Access Logs</h2>
        <p>Filterable log of report views and logins with CSV export.</p>
      </div>
    </DashboardShell>
  );
}
