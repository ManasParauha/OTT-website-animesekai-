import MovieEditor from "../../MovieEditor";
import { requireAdminPage } from "../../../requireAdminPage";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Edit Movie - Sekai Control",
};

export default async function EditMoviePage({ params }: { params: { id: string } }) {
  await requireAdminPage();

  return <MovieEditor movieId={params.id} />;
}

