import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { getAdminAuthFromToken } from "@/helpers/adminAuth";
import AdminDashboard from "./AdminDashboard";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Sekai Control",
};

export default async function SekaiControlPage() {
  const auth = await getAdminAuthFromToken(cookies().get("token")?.value);

  if (auth.status === "unauthenticated") {
    redirect("/Login");
  }

  if (auth.status !== "authorized") {
    notFound();
  }

  return <AdminDashboard />;
}

