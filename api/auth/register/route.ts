import type { NextRequest } from "next/server"
import { register } from "../../../controllers/auth"

export async function POST(request: NextRequest) {
  return register(request)
}
