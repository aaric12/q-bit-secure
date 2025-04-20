import { type NextRequest, NextResponse } from "next/server"
import { register } from "../routes/auth/register"
import { login } from "../routes/auth/login"
import { logout } from "../routes/auth/logout"
import { getDashboardSummary } from "../routes/dashboard/summary"
import { getAnalyticsSummary } from "../routes/analytics/summary"
import { detectEavesdropping } from "../routes/security/eavesdropping"
import { getAnomalyTimeline } from "../routes/security/anomalies"
import { runFullSimulation } from "../routes/simulation/full"

export async function handler(req: NextRequest) {
  const { pathname } = new URL(req.url)

  // Auth routes
  if (pathname === "/api/auth/register" && req.method === "POST") {
    return register(req)
  }

  if (pathname === "/api/auth/login" && req.method === "POST") {
    return login(req)
  }

  if (pathname === "/api/auth/logout" && req.method === "POST") {
    return logout()
  }

  // Dashboard routes
  if (pathname === "/api/dashboard/summary" && req.method === "GET") {
    return getDashboardSummary(req)
  }

  // Analytics routes
  if (pathname === "/api/analytics/summary" && req.method === "GET") {
    return getAnalyticsSummary(req)
  }

  // Security routes
  if (pathname === "/api/security/eavesdropping" && req.method === "POST") {
    return detectEavesdropping(req)
  }

  if (pathname === "/api/security/anomalies/timeline" && req.method === "GET") {
    return getAnomalyTimeline(req)
  }

  // Simulation routes
  if (pathname === "/api/simulation/full" && req.method === "POST") {
    return runFullSimulation(req)
  }

  // Route not found
  return NextResponse.json({ error: "Route not found" }, { status: 404 })
}
