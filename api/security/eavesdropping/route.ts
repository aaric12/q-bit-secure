import type { NextRequest } from "next/server"
import { detectEavesdropping } from "../../../controllers/security"

export async function POST(request: NextRequest) {
  return detectEavesdropping(request)
}
