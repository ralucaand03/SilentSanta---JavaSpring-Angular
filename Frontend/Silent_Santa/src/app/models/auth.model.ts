export interface AuthResponseData {
  idToken: string
  email: string
  refreshToken?: string
  expiresIn: number
  localId: string
  role?: string  
  firstName?: string
  lastName?: string 
}

