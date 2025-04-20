import type { NextRequest } from "next/server"
import { logout } from "../../../controllers/auth"

export async function POST(request: NextRequest) {
  return logout(request)
}
