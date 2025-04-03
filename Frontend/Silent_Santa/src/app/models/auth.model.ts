export interface AuthResponseData {
    id?: string
    firstName?: string
    lastName?: string
    email: string
    phone?: string
    role?: string
    // Original fields
    idToken?: string
    refreshToken?: string
    expiresIn?: string
    localId?: string
  }
  
  