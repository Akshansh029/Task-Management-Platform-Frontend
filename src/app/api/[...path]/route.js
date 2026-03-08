import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api/v1";

/**
 * Universal API Proxy Route Handler
 * Proxies requests to the backend, handles HTTP-only cookies for JWT,
 * and attaches Authorization header appropriately.
 */
export async function POST(req, { params }) {
  const path = (await params).path.join("/");
  const url = `${BACKEND_URL}/${path}`;
  const body = await req.json().catch(() => ({}));

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Special treatment for auth routes to set/read cookies
  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    return NextResponse.json(data, { status: response.status });
  }

  const nextResponse = NextResponse.json(data, { status: response.status });

  // If this is a login, set the token cookie as HTTP-only
  if (path === "auth/login" && data.token) {
    nextResponse.cookies.set("token", data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });
  }

  return nextResponse;
}

export async function GET(req, { params }) {
  const path = (await params).path.join("/");

  // Handle special session check route
  if (path === "auth/session") {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    return NextResponse.json({ authenticated: !!token });
  }

  const url = `${BACKEND_URL}/${path}?${req.nextUrl.searchParams.toString()}`;

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    method: "GET",
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 401) {
      const res = NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 },
      );
      res.cookies.delete("token");
      return res;
    }
    return NextResponse.json(data, { status: response.status });
  }

  return NextResponse.json(data);
}

export async function PUT(req, { params }) {
  const path = (await params).path.join("/");
  const url = `${BACKEND_URL}/${path}`;
  const body = await req.json().catch(() => ({}));

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  const response = await fetch(url, {
    method: "PUT",
    headers,
    body: JSON.stringify(body),
  });

  const data = await response.json().catch(() => ({}));
  return NextResponse.json(data, { status: response.status });
}

export async function PATCH(req, { params }) {
  const path = (await params).path.join("/");
  const url = `${BACKEND_URL}/${path}`;
  const body = await req.json().catch(() => ({}));

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  const response = await fetch(url, {
    method: "PATCH",
    headers,
    body: JSON.stringify(body),
  });

  const data = await response.json().catch(() => ({}));
  return NextResponse.json(data, { status: response.status });
}

export async function DELETE(req, { params }) {
  const path = (await params).path.join("/");
  const url = `${BACKEND_URL}/${path}`;

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  const response = await fetch(url, {
    method: "DELETE",
    headers,
  });

  if (response.status === 204) return new Response(null, { status: 204 });
  const data = await response.json().catch(() => ({}));
  return NextResponse.json(data, { status: response.status });
}
