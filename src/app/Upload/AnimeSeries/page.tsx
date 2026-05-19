import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { getAdminAuthFromToken } from "@/helpers/adminAuth";

export const dynamic = "force-dynamic";

export default async function AnimeSeriesUploadRedirect() {
  const auth = await getAdminAuthFromToken(cookies().get("token")?.value);

  if (auth.status === "unauthenticated") {
    redirect("/Login");
  }

  if (auth.status !== "authorized") {
    notFound();
  }

  redirect("/sekai-control");
}

