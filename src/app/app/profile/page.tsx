import { DashboardShell } from '../../../components/DashboardShell';
import { UserRole } from '@prisma/client';

export default function ProfilePage() {
  return (
    <DashboardShell role={UserRole.VENDOR}>
      <div className="card">
        <h2>Profile</h2>
        <p>View user and vendor metadata with device/session management.</p>
        <ul>
          <li>Status: Active</li>
          <li>Role: Vendor</li>
          <li>Plan: Free</li>
        </ul>
      </div>
    </DashboardShell>
  );
}
