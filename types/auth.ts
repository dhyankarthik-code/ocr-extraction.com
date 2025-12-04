export interface Session {
  id: string
  email: string
  name?: string
  picture?: string
  provider: "google" | "facebook"
  createdAt: Date
}
