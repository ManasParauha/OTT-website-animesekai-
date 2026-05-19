import { initEdgeStore } from "@edgestore/server";

const es = initEdgeStore.context<{ isAdmin: string }>().create();

export const edgeStoreRouter = es.router({
  publicFiles: es.fileBucket(),
  adminFiles: es.fileBucket().beforeUpload(({ ctx }) => ctx.isAdmin === "true"),
});

export type EdgeStoreRouter = typeof edgeStoreRouter;

