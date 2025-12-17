import { DashboardShell } from '../../../components/DashboardShell';
import { UserRole } from '@prisma/client';

export default function AssignmentsPage() {
  return (
    <DashboardShell role={UserRole.ADMIN}>
      <div className="card">
        <h2>Assignments</h2>
        <p>Bulk assign or unassign reports while respecting plan limits.</p>
      </div>
    </DashboardShell>
  );
}
