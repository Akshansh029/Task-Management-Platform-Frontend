import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api/v1";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  path: "/",
};

/**
 * Helper to generate headers with optional Bearer token
 */
const getHeaders = (token) => {
  const headers = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

/**
 * Universal API Proxy Route Handler
 * Proxies requests to the backend, handles HTTP-only cookies for JWT,
 * and handles automatic token refresh logic.
 */
async function handleProxyRequest(req, { params, method }) {
  const pathParts = (await params).path;
  const path = pathParts.join("/");

  // Handle special session check route
  if (path === "auth/session" && method === "GET") {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const refreshToken = cookieStore.get("refreshToken")?.value;

    if (!accessToken) {
      return NextResponse.json({
        authenticated: false,
        message: "Missing access token",
      });
    }

    // Decode and check expiry server-side (no library needed)
    const isExpired = (token) => {
      try {
        const payload = JSON.parse(
          Buffer.from(token.split(".")[1], "base64").toString("utf8"),
        );
        // 30s buffer for clock skew
        return payload.exp < Math.floor(Date.now() / 1000) + 30;
      } catch {
        return true;
      }
    };

    if (!isExpired(accessToken)) {
      return NextResponse.json({
        authenticated: true,
        message: "token NOT expired",
      });
    }

    // Token exists but is expired — proactively refresh here
    if (refreshToken) {
      const refreshResponse = await fetch(`${BACKEND_URL}/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: `refreshToken=${refreshToken}`,
        },
      });

      if (refreshResponse.ok) {
        const refreshData = await refreshResponse.json().catch(() => ({}));
        const newAccessToken =
          refreshData.accessToken || refreshResponse.headers.get("accessToken");
        const newRefreshToken =
          refreshData.refreshToken ||
          refreshResponse.headers.get("refreshToken");

        const response = NextResponse.json({
          authenticated: true,
          message: "New access token fetched",
        });

        if (newAccessToken) {
          response.cookies.set("accessToken", newAccessToken, {
            ...COOKIE_OPTIONS,
            maxAge: 60 * 10, // 10 mins — match your backend
          });
        }
        if (newRefreshToken) {
          response.cookies.set("refreshToken", newRefreshToken, {
            ...COOKIE_OPTIONS,
            maxAge: 60 * 60 * 24 * 7,
          });
        }
        return response;
      }

      // Refresh failed — clear cookies and mark unauthenticated
      const response = NextResponse.json({
        authenticated: false,
        message: "Refresh failed",
      });
      response.cookies.delete("accessToken");
      response.cookies.delete("refreshToken");
      return response;
    }

    return NextResponse.json({
      authenticated: false,
      message: "Final failure",
    });
  }

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  const url = new URL(`${BACKEND_URL}/${path}`);
  if (method === "GET") {
    const searchParams = req.nextUrl.searchParams;
    searchParams.forEach((value, key) => {
      url.searchParams.append(key, value);
    });
  }

  let body = null;
  if (["POST", "PUT", "PATCH"].includes(method)) {
    try {
      body = await req.json();
    } catch (e) {
      body = null;
    }
  }

  // Helper to extract tokens from either body or headers
  const getTokens = async (res, bodyData) => {
    return {
      accessToken: bodyData.accessToken || res.headers.get("accessToken"),
      refreshToken: bodyData.refreshToken || res.headers.get("refreshToken"),
    };
  };

  let response = await fetch(url.toString(), {
    method,
    headers: getHeaders(accessToken),
    body: body ? JSON.stringify(body) : undefined,
  });

  let data = {};
  if (response.status !== 204) {
    data = await response.json().catch(() => ({}));
  }

  // Automatic token refresh logic
  if (
    response.status === 401 &&
    refreshToken &&
    path !== "auth/login" &&
    path !== "auth/refresh"
  ) {
    const refreshResponse = await fetch(`${BACKEND_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (refreshResponse.ok) {
      const refreshData = await refreshResponse.json().catch(() => ({}));
      const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
        await getTokens(refreshResponse, refreshData);

      if (!newAccessToken) {
        console.error(
          "[Proxy] Refresh succeeded but no accessToken found in response body or headers.",
        );
        return NextResponse.json(
          { message: "Invalid refresh response" },
          { status: 500 },
        );
      }

      // Retry original request with new token
      const retryResponse = await fetch(url.toString(), {
        method,
        headers: getHeaders(newAccessToken),
        body: body ? JSON.stringify(body) : undefined,
      });

      let retryData = {};
      if (retryResponse.status !== 204) {
        retryData = await retryResponse.json().catch(() => ({}));
      }

      const nextResponse =
        retryResponse.status === 204
          ? new NextResponse(null, { status: 204 })
          : NextResponse.json(retryData, { status: retryResponse.status });

      // Update cookies with new tokens
      nextResponse.cookies.set("accessToken", newAccessToken, {
        ...COOKIE_OPTIONS,
        maxAge: 60 * 60 * 24, // 1 day
      });

      if (newRefreshToken) {
        nextResponse.cookies.set("refreshToken", newRefreshToken, {
          ...COOKIE_OPTIONS,
          maxAge: 60 * 60 * 24 * 7, // 1 week
        });
      }

      return nextResponse;
    } else {
      const refreshError = await refreshResponse.json().catch(() => ({}));
      console.error(
        "[Proxy] Token refresh failed:",
        refreshResponse.status,
        refreshError,
      );

      const nextResponse = NextResponse.json(
        { message: "Session expired", details: refreshError.message },
        { status: 401 },
      );
      nextResponse.cookies.delete("accessToken");
      nextResponse.cookies.delete("refreshToken");
      return nextResponse;
    }
  }

  // Handle successful login/register or any other response
  const nextResponse =
    response.status === 204
      ? new NextResponse(null, { status: 204 })
      : NextResponse.json(data, { status: response.status });

  if (response.ok) {
    const isAuthRoute =
      path === "auth/login" ||
      path === "auth/register" ||
      path === "auth/refresh";
    if (isAuthRoute) {
      const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
        await getTokens(response, data);

      if (newAccessToken) {
        nextResponse.cookies.set("accessToken", newAccessToken, {
          ...COOKIE_OPTIONS,
          maxAge: 60 * 10, // 10 mins
        });
      }
      if (newRefreshToken) {
        nextResponse.cookies.set("refreshToken", newRefreshToken, {
          ...COOKIE_OPTIONS,
          maxAge: 60 * 60 * 24 * 30 * 2, // 2 months
        });
      }
    }
  } else if (response.status === 401 && path !== "auth/login") {
    nextResponse.cookies.delete("accessToken");
    nextResponse.cookies.delete("refreshToken");
  }

  return nextResponse;
}

export async function POST(req, context) {
  return handleProxyRequest(req, { ...context, method: "POST" });
}

export async function GET(req, context) {
  return handleProxyRequest(req, { ...context, method: "GET" });
}

export async function PUT(req, context) {
  return handleProxyRequest(req, { ...context, method: "PUT" });
}

export async function PATCH(req, context) {
  return handleProxyRequest(req, { ...context, method: "PATCH" });
}

export async function DELETE(req, context) {
  return handleProxyRequest(req, { ...context, method: "DELETE" });
}
