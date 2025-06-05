import { createCookieSessionStorage, redirect } from "@remix-run/node";
import { prisma } from "~/db.server";

const sessionSecret = process.env.SESSION_SECRET || "changeme";

const storage = createCookieSessionStorage({
  cookie: {
    name: "books_session",
    secure: process.env.NODE_ENV === "production",
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    httpOnly: true,
  },
});

export function getSession(request: Request) {
  return storage.getSession(request.headers.get("Cookie"));
}

export async function getUser(request: Request) {
  const session = await getSession(request);
  const sessionId = session.get("sessionId");
  if (!sessionId) return null;
  const userSession = await prisma.session.findUnique({
    where: { id: sessionId },
    include: { user: true },
  });
  return userSession?.user ?? null;
}

export async function requireUser(request: Request) {
  const user = await getUser(request);
  if (!user) {
    const url = new URL(request.url);
    throw redirect(`/login?redirectTo=${encodeURIComponent(url.pathname + url.search)}`);
  }
  return user;
}

export async function requireAdmin(request: Request) {
  const user = await requireUser(request);
  if (user.role !== "ADMIN") {
    throw new Response("Unauthorized", { status: 403 });
  }
  return user;
}

export async function createUserSession(userId: number, redirectTo: string) {
  const userSession = await prisma.session.create({ data: { userId } });
  const session = await storage.getSession();
  session.set("sessionId", userSession.id);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await storage.commitSession(session),
    },
  });
}

export async function logout(request: Request) {
  const session = await getSession(request);
  const sessionId = session.get("sessionId");
  if (sessionId) {
    await prisma.session.delete({ where: { id: sessionId } }).catch(() => {});
  }
  return redirect("/", {
    headers: {
      "Set-Cookie": await storage.destroySession(session),
    },
  });
}
