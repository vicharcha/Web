import { LoginForm } from "@/components/login-form"
import { AuthProvider } from "@/components/auth-provider"
import { Metadata } from 'next'

export const viewport = {
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

// currently we don't need otp means i am saying this is sample page only all web pages are working or not we are checking currently after we integrate database and devlopments this is now sample
