import type { NextRequest } from "next/server"
import { getAnalyticsSummary } from "../../../controllers/analytics"

export async function GET(request: NextRequest) {
  return getAnalyticsSummary(request)
}
