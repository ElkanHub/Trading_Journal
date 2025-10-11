import AdminDashboard from '@/components/admin/AdminDashboard';

//Prevents Next.js from statically prerendering the admin page
export const dynamic = 'force-dynamic';

export default function AdminPage() {
  return <AdminDashboard />;
}
