import { LoginForm } from "@/components/login-form"
import { AuthProvider } from "@/components/auth-provider"
import { Metadata } from 'next'

export const metadata: Metadata = {
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
