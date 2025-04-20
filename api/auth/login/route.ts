import type { NextRequest } from "next/server"
import { login } from "../../../controllers/auth"

export async function POST(request: NextRequest) {
  return login(request)
}
