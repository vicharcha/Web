import { LoginForm } from "@/app/components/login-form"
import { AuthProvider } from "@/app/components/auth-provider"
import { Viewport } from 'next'

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "#09090B" }
  ]
}

export default function LoginPage() {
  return (
    <AuthProvider>
      <LoginForm />
    </AuthProvider>
  )
}
