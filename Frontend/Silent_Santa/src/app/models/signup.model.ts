export interface SignUp {
  id?: string
  firstName: string
  lastName: string
  email: string
  phone: string
  password?: string
  role: string
  captchaToken?: string // Changed to match what the backend expects
}
