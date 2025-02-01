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
  Menu,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  X,
  Settings,
} from "lucide-react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Logo } from "./logo"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useMediaQuery } from "@/hooks/use-media-query"
import { useTheme } from "next-themes"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

interface NavItemProps {
  href: string;
  icon: React.ElementType;
  label: string;
  isCollapsed: boolean;
  className?: string;
}

interface MobileNavItemProps {
  href: string;
  icon: React.ElementType;
  label: string;
}

interface ProfileSectionProps {
  isCollapsed: boolean;
}

interface SidebarContentProps {
  showLogo?: boolean;
}

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const isMobile = useMediaQuery("(max-width: 768px)")
  const { setTheme, theme } = useTheme()
  const pathname = usePathname()

  const toggleSidebar = () => setIsCollapsed(!isCollapsed)
  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light")

  useEffect(() => {
    if (!isMobile && isMobileMenuOpen) {
      setIsMobileMenuOpen(false)
    }
  }, [isMobile, isMobileMenuOpen])

  const mainNavItems = [
    { icon: Home, label: "Home", href: "/" },
    { icon: MessageSquare, label: "Messages", href: "/messages" },
    { icon: Phone, label: "Calls", href: "/calls" },
    { icon: Users, label: "Social", href: "/social" },
    { icon: ShoppingBag, label: "Shopping", href: "/shopping" },
  ]

  const secondaryNavItems = [
    { icon: Brain, label: "AI Assistant", href: "/ai-assistant" },
    { icon: AlertTriangle, label: "Emergency", href: "/emergency" },
    { icon: CreditCard, label: "Payments", href: "/payments" },
  ]

  const NavItem = ({ href, icon: Icon, label, isCollapsed, className }: NavItemProps) => {
    const isActive = pathname === href
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href={href}
              className={cn(
                "flex items-center text-muted-foreground hover:text-foreground transition-colors w-full px-4 py-2",
                isCollapsed ? "justify-center" : "justify-start",
                isActive && "text-foreground bg-accent/50 font-medium",
                "hover:bg-accent/50 rounded-lg",
                className,
              )}
            >
              <Icon size={24} className={cn("shrink-0", !isCollapsed && "mr-2")} />
              {!isCollapsed && <span className="truncate">{label}</span>}
            </Link>
          </TooltipTrigger>
          {isCollapsed && <TooltipContent side="right">{label}</TooltipContent>}
        </Tooltip>
      </TooltipProvider>
    )
  }

  const MobileNavItem = ({ href, icon: Icon, label }: MobileNavItemProps) => {
    const isActive = pathname === href
    return (
      <Link href={href} className="flex flex-col items-center justify-center relative w-16">
        <div
          className={cn(
            "flex items-center justify-center w-12 h-12 rounded-xl transition-all",
            isActive ? "bg-accent text-foreground" : "text-muted-foreground",
            "hover:bg-accent/50 hover:text-foreground",
          )}
        >
          <Icon size={24} />
        </div>
        <span className="text-xs mt-1 font-medium text-center">{label}</span>
        {isActive && <div className="absolute -bottom-4 w-1.5 h-1.5 rounded-full bg-primary" />}
      </Link>
    )
  }

  const SidebarContent = ({ showLogo = true }: SidebarContentProps) => (
    <div className="flex flex-col h-full">
      {showLogo && (
        <div className="flex items-center justify-between w-full px-4 mb-6">
          <Logo variant={isCollapsed ? "icon" : "small"} />
          {!isMobile && (
            <Button variant="ghost" size="icon" onClick={toggleSidebar} className="ml-2">
              {isCollapsed ? <ChevronRight size={24} /> : <ChevronLeft size={24} />}
            </Button>
          )}
        </div>
      )}
      <div className="flex-1 px-3">
        <div className="space-y-1">
          {mainNavItems.map((item) => (
            <NavItem key={item.href} {...item} isCollapsed={isCollapsed} />
          ))}
        </div>
        <div className="my-4 border-t border-border" />
        <div className="space-y-1">
          {secondaryNavItems.map((item) => (
            <NavItem key={item.href} {...item} isCollapsed={isCollapsed} />
          ))}
        </div>
      </div>
      <div className="mt-auto p-4 border-t border-border">
        <div className="flex flex-col gap-4">
          <NavItem href="/settings" icon={Settings} label="Settings" isCollapsed={isCollapsed} className="py-2.5" />
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className={cn("w-full justify-start", isCollapsed && "justify-center")}
          >
            {theme === "light" ? (
              <Moon size={20} className={cn("shrink-0", !isCollapsed && "mr-2")} />
            ) : (
              <Sun size={20} className={cn("shrink-0", !isCollapsed && "mr-2")} />
            )}
            {!isCollapsed && (theme === "light" ? "Dark Mode" : "Light Mode")}
          </Button>
          <ProfileSection isCollapsed={isCollapsed} />
        </div>
      </div>
    </div>
  )

  return (
    <TooltipProvider>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden md:flex border-r flex-col py-4 transition-all duration-300 ease-in-out h-screen sticky top-0",
          isCollapsed ? "w-20" : "w-64",
        )}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 border-b bg-background/80 backdrop-blur-md z-40 flex items-center px-4">
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="mr-4">
              <Menu size={24} />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 p-0 bg-background/80 backdrop-blur-md">
            <div className="flex flex-col h-full">
              <div className="p-4 border-b flex items-center justify-between">
                <Logo variant="small" />
                <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                  <X size={24} />
                </Button>
              </div>
              <SidebarContent showLogo={false} />
            </div>
          </SheetContent>
        </Sheet>
        <Logo variant="small" />
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-20 border-t bg-background/80 backdrop-blur-md z-40">
        <div className="flex items-center justify-around h-full px-2">
          {mainNavItems.map((item) => (
            <MobileNavItem key={item.href} {...item} />
          ))}
        </div>
      </nav>
    </TooltipProvider>
  )
}

function ProfileSection({ isCollapsed }: ProfileSectionProps) {
  return (
    <div className={cn("flex items-center gap-3", isCollapsed ? "justify-center" : "justify-start")}>
      <Avatar className="h-8 w-8">
        <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
        <AvatarFallback>U</AvatarFallback>
      </Avatar>
      {!isCollapsed && (
        <div className="truncate">
          <p className="text-sm font-medium leading-none">John Doe</p>
          <p className="text-xs text-muted-foreground">john@example.com</p>
        </div>
      )}
    </div>
  )
}
