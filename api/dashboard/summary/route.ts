import type { NextRequest } from "next/server"
import { getDashboardSummary } from "../../../controllers/dashboard"

export async function GET(request: NextRequest) {
  return getDashboardSummary(request)
}
