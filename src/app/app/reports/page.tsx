import { DashboardShell } from '../../../components/DashboardShell';
import { UserRole } from '@prisma/client';
import Link from 'next/link';

const sampleReports = [
  { id: '1', name: 'Sales Overview', status: 'ACTIVE', tags: 'sales' },
  { id: '2', name: 'Support Pulse', status: 'ACTIVE', tags: 'support' }
];

export default function ReportsPage() {
  return (
    <DashboardShell role={UserRole.VENDOR}>
      <div className="card">
        <h2>Reports</h2>
        <table className="table" aria-label="Reports table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Status</th>
              <th>Tags</th>
            </tr>
          </thead>
          <tbody>
            {sampleReports.map((report) => (
              <tr key={report.id}>
                <td><Link href={`/app/reports/${report.id}`}>{report.name}</Link></td>
                <td><span className="badge status-active">{report.status}</span></td>
                <td>{report.tags}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardShell>
  );
}
