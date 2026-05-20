import MovieEditor from "../MovieEditor";
import { requireAdminPage } from "../../requireAdminPage";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Upload Movie - Sekai Control",
};

export default async function NewMoviePage() {
  await requireAdminPage();

  return <MovieEditor />;
}

