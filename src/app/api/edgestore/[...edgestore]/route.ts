import { createEdgeStoreNextHandler } from '@edgestore/server/adapters/next/app';
import { getAdminAuthFromToken } from '@/helpers/adminAuth';
import { edgeStoreRouter } from '@/lib/edgestoreRouter';

  const handler = createEdgeStoreNextHandler({
    router: edgeStoreRouter,
    createContext: async ({ req }) => {
      const auth = await getAdminAuthFromToken(req.cookies.get("token")?.value);
      return { isAdmin: auth.status === "authorized" ? "true" : "false" };
    },
  });

  export { handler as GET, handler as POST };
 
/**
 * This type is used to create the type-safe client for the frontend.
 */
