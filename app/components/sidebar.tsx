"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  MessageSquare,
  Phone,
  Users,
  Brain,
  AlertTriangle,
  CreditCard,
  ShoppingBag,
  Settings,
  Code,
  X,
  Sun,
  Moon,
  Menu,
  ChevronLeft,
  ChevronRight,
  Bell,
} from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useMediaQuery } from "@/hooks/use-media-query"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const navItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: MessageSquare, label: "Messages", href: "/messages" },
  { icon: Brain, label: "AI Assistant", href: "/ai-assistant" },
  { icon: Phone, label: "Calls", href: "/calls" },
  { icon: Users, label: "Social", href: "/social" },
  { icon: ShoppingBag, label: "Shopping", href: "/shopping" },
  { icon: AlertTriangle, label: "Emergency", href: "/emergency" },
  { icon: CreditCard, label: "Payments", href: "/payments" },
]

function SidebarLogo({ isCollapsed }: { isCollapsed?: boolean }) {
  return (
    <div className={cn("flex items-center", isCollapsed ? "justify-center" : "gap-2")}>
      <div className="relative w-8 h-8">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-violet-600 rounded-lg transform rotate-45" />
        <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-xl">V</div>
      </div>
      {!isCollapsed && (
        <span className="font-bold bg-gradient-to-r from-pink-500 to-violet-600 bg-clip-text text-transparent">
          Vicharcha
        </span>
      )}
    </div>
  )
}

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const isMobile = useMediaQuery("(max-width: 768px)")
  const { setTheme, theme } = useTheme()
  const pathname = usePathname()

  const toggleSidebar = () => setIsCollapsed(!isCollapsed)

  const NavItem = ({ href, icon: Icon, label }) => {
    const isActive = pathname === href
    return (
      <Link
        href={href}
        className={cn(
          "flex items-center gap-3 px-4 py-3 mx-2 rounded-lg transition-colors",
          isActive ? "bg-accent text-accent-foreground" : "hover:bg-accent/50",
          isCollapsed && "w-10 px-2 mx-auto justify-center",
        )}
      >
        <Icon className="h-5 w-5 shrink-0" />
        {!isCollapsed && <span className="text-sm font-medium">{label}</span>}
      </Link>
    )
  }

  const MobileNav = () => (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 border-b bg-background/80 backdrop-blur-md z-40 flex items-center justify-between px-4">
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[280px] p-0">
            <div className="flex flex-col h-full bg-background">
              <div className="flex items-center justify-between p-4 border-b">
                <SidebarLogo />
                <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="flex-1 overflow-auto py-2">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 mx-2 rounded-lg transition-colors",
                      pathname === item.href ? "bg-accent text-accent-foreground" : "hover:bg-accent/50",
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                ))}
              </div>

              <div className="border-t p-4 space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User" />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-medium">John Doe</p>
                    <p className="text-xs text-muted-foreground">john@example.com</p>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3"
                  onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                >
                  {theme === "light" ? (
                    <>
                      <Moon className="h-5 w-5" />
                      <span>Dark Mode</span>
                    </>
                  ) : (
                    <>
                      <Sun className="h-5 w-5" />
                      <span>Light Mode</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
                {theme === "light" ? <Moon className="mr-2 h-4 w-4" /> : <Sun className="mr-2 h-4 w-4" />}
                <span>Change Theme</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 border-t bg-background/80 backdrop-blur-md z-40">
        <div className="flex items-center justify-around h-full px-2">
          {navItems.slice(0, 4).map((item) => {
            const isActive = pathname === item.href
            return (
              <Link key={item.href} href={item.href} className="flex flex-col items-center justify-center">
                <div
                  className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-xl transition-colors",
                    isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-accent/50",
                  )}
                >
                  <item.icon className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-medium mt-1">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )

  if (isMobile) {
    return <MobileNav />
  }

  return (
    <aside
      className={cn(
        "hidden md:flex border-r flex-col py-4 transition-all duration-300 ease-in-out h-screen sticky top-0",
        isCollapsed ? "w-[70px]" : "w-[280px]",
      )}
    >
      <div className={cn("flex items-center px-4 mb-6", isCollapsed ? "justify-center" : "justify-between")}>
        <SidebarLogo isCollapsed={isCollapsed} />
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className={isCollapsed ? "absolute right-[-20px] top-6 bg-background border rounded-full" : ""}
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      <div className="flex-1 px-3">
        <div className="space-y-1">
          {navItems.map((item) => (
            <NavItem key={item.href} {...item} />
          ))}
        </div>
      </div>

      <div className="mt-auto p-4 border-t space-y-4">
        <Button
          variant="ghost"
          className={cn("w-full", isCollapsed ? "px-2 justify-center" : "justify-start gap-3")}
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          {theme === "light" ? (
            <>
              <Moon className="h-5 w-5 shrink-0" />
              {!isCollapsed && <span>Dark Mode</span>}
            </>
          ) : (
            <>
              <Sun className="h-5 w-5 shrink-0" />
              {!isCollapsed && <span>Light Mode</span>}
            </>
          )}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className={cn("w-full", isCollapsed ? "justify-center" : "justify-start gap-3")}>
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              {!isCollapsed && (
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium truncate">John Doe</p>
                  <p className="text-xs text-muted-foreground truncate">john@example.com</p>
                </div>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  )
}

