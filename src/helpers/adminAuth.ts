import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";

type TokenPayload = JwtPayload & {
  id?: string;
};

export type AdminAuthResult =
  | { status: "authorized"; user: any }
  | { status: "unauthenticated" | "forbidden"; user: null };

export async function getAdminAuthFromToken(token?: string): Promise<AdminAuthResult> {
  if (!token) {
    return { status: "unauthenticated", user: null };
  }

  try {
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET!) as TokenPayload;

    if (!decodedToken.id) {
      return { status: "unauthenticated", user: null };
    }

    await connect();
    const user = await User.findById(decodedToken.id).select("_id username email isAdmin");

    if (!user) {
      return { status: "unauthenticated", user: null };
    }

    if (!user.isAdmin) {
      return { status: "forbidden", user: null };
    }

    return { status: "authorized", user };
  } catch {
    return { status: "unauthenticated", user: null };
  }
}

export async function getAdminAuthFromRequest(request: NextRequest) {
  return getAdminAuthFromToken(request.cookies.get("token")?.value);
}

export async function denyIfNotAdmin(request: NextRequest) {
  const auth = await getAdminAuthFromRequest(request);

  if (auth.status === "authorized") {
    return null;
  }

  if (auth.status === "unauthenticated") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({ error: "Not found" }, { status: 404 });
}

