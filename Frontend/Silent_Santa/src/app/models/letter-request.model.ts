import type { Letters } from "./letters.model"
import type { User } from "./user.model"

export interface LetterRequest {
  letter: Letters
  requester: User
  requestId: string
  status: string
  requestDate?: Date
}
