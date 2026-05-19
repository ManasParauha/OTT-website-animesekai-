import { initEdgeStoreClient } from "@edgestore/server/core";
import { edgeStoreRouter } from "@/lib/edgestoreRouter";

const edgeStoreClient = initEdgeStoreClient({
  router: edgeStoreRouter,
});

function isEdgeStoreUrl(url: string) {
  try {
    return new URL(url).hostname === "files.edgestore.dev";
  } catch {
    return false;
  }
}

export async function deleteEdgeStoreFiles(urls: Array<string | null | undefined>) {
  const uniqueUrls = Array.from(
    new Set(urls.filter((url): url is string => Boolean(url && isEdgeStoreUrl(url))))
  );

  for (const url of uniqueUrls) {
    if (url.includes("/adminFiles/")) {
      await edgeStoreClient.adminFiles.deleteFile({ url });
    } else {
      await edgeStoreClient.publicFiles.deleteFile({ url });
    }
  }
}

