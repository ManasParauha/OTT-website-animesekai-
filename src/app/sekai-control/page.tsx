import AdminDashboard from "./AdminDashboard";
import { requireAdminPage } from "./requireAdminPage";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Sekai Control",
};

export default async function SekaiControlPage() {
  await requireAdminPage();

  return <AdminDashboard />;
}
