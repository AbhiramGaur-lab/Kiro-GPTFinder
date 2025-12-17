import { DashboardShell } from '../../../components/DashboardShell';
import { UserRole } from '@prisma/client';

export default function PlansPage() {
  return (
    <DashboardShell role={UserRole.SUPER_ADMIN}>
      <div className="card">
        <h2>Plans</h2>
        <p>Configure Free and Premium limits and feature flags.</p>
      </div>
    </DashboardShell>
  );
}
