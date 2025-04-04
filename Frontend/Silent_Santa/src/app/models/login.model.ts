export interface LogIn {
  email: string
  password?: string
  role?: string // Make role optional if it's not required for login
  rememberMe?: boolean
}

