import SeriesEditor from "../SeriesEditor";
import { requireAdminPage } from "../../requireAdminPage";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Upload Series - Sekai Control",
};

export default async function NewSeriesPage() {
  await requireAdminPage();

  return <SeriesEditor />;
}

