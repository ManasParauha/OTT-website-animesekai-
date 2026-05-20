import SeriesEditor from "../../SeriesEditor";
import { requireAdminPage } from "../../../requireAdminPage";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Edit Series - Sekai Control",
};

export default async function EditSeriesPage({ params }: { params: { id: string } }) {
  await requireAdminPage();

  return <SeriesEditor seriesId={params.id} />;
}

