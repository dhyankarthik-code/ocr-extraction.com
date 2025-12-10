export interface Session {
  id: string
  email: string
  name?: string
  picture?: string
  phone?: string
  organization?: string
  provider: "google" | "facebook"
  isNewUser?: boolean  // Flag to show profile completion prompt
  createdAt: Date
}

