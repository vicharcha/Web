"use client"

import { useState, useEffect } from 'react'
import { Bell, Settings, LogOut, Camera, Users, AirplayIcon as Broadcast, CreditCard, QrCode, Phone, Menu, Search, MessageSquare, Sparkles, Sun, Moon, Laptop, Video, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu"
import { useAuth } from '@/components/auth-provider'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"
import { motion, AnimatePresence } from "framer-motion"

const ThemeButton = () => {
  const { theme, setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-lg hover:bg-white/10 transition-colors duration-200"
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end"
        className="bg-gradient-to-b from-background/95 to-background/80 backdrop-blur-xl border-white/10 w-40"
      >
        <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
          <DropdownMenuRadioItem 
            value="light"
            className="hover:bg-white/10 cursor-pointer group"
          >
            <Sun className="h-4 w-4 mr-2 group-hover:text-yellow-500 transition-colors" />
            Light
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem 
            value="dark"
            className="hover:bg-white/10 cursor-pointer group"
          >
            <Moon className="h-4 w-4 mr-2 group-hover:text-blue-500 transition-colors" />
            Dark
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem 
            value="system"
            className="hover:bg-white/10 cursor-pointer group"
          >
            <Laptop className="h-4 w-4 mr-2 group-hover:text-purple-500 transition-colors" />
            System
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

const QuickActions = () => {
  const actions = [
    { icon: MessageSquare, label: "New Chat" },
    { icon: Users, label: "New Group" },
    { icon: Camera, label: "Camera" },
    { icon: Video, label: "Video" },
  ]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon"
          className="rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
        >
          <Plus className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56 bg-gradient-to-b from-background/95 to-background/80 backdrop-blur-xl border-white/10"
      >
        <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
          Quick Actions
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-white/10" />
        {actions.map((action, index) => (
          <DropdownMenuItem
            key={index}
            className="hover:bg-white/10 cursor-pointer group"
          >
            <action.icon className="h-4 w-4 mr-2 group-hover:text-purple-500 transition-colors" />
            {action.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function TopMenu() {
  const [notifications] = useState(3)
  const { logout, user } = useAuth()
  const [showQRScanner, setShowQRScanner] = useState(false)
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.div 
      className={cn(
        "sticky top-0 z-50 w-full",
        scrolled && "shadow-lg shadow-purple-500/5"
      )}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      <div className="bg-gradient-to-r from-background/95 via-background/90 to-background/95 backdrop-blur-xl border-b border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-3">
            {/* Left Section */}
            <div className="flex items-center gap-6">
              <motion.div 
                className="flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur-lg opacity-50" />
                  <div className="relative p-2 rounded-xl bg-background/50 backdrop-blur-sm border border-white/10">
                    <Sparkles className="w-6 h-6 text-purple-500" />
                  </div>
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Vicharcha
                </h1>
              </motion.div>
              
              <div className="hidden md:flex relative max-w-md group">
                <AnimatePresence>
                  {isSearchFocused && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-purple-500/20 rounded-lg"
                    />
                  )}
                </AnimatePresence>
                <Input 
                  placeholder="Search conversations..." 
                  className="pl-10 pr-4 bg-white/5 border-white/10 rounded-lg transition-all duration-300 focus:bg-white/10 focus:border-purple-500/50"
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                />
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-3">
              <ThemeButton />

              <QuickActions />

              <Sheet>
                <SheetTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="rounded-lg hover:bg-white/10 transition-colors duration-200"
                  >
                    <CreditCard className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent className="bg-gradient-to-b from-background/95 to-background/80 backdrop-blur-xl border-white/10">
                  <SheetHeader>
                    <SheetTitle className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      Quick Payment
                    </SheetTitle>
                  </SheetHeader>
                  <div className="space-y-4 mt-6">
                    <Button 
                      onClick={() => setShowQRScanner(true)} 
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    >
                      <QrCode className="mr-2 h-4 w-4" />
                      Scan QR Code
                    </Button>
                    <Input placeholder="Enter UPI ID" className="bg-white/5" />
                    <Input placeholder="Enter Amount" type="number" className="bg-white/5" />
                    <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                      Pay Now
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="relative rounded-lg hover:bg-white/10 transition-colors duration-200"
                  >
                    <Bell className="w-5 h-5" />
                    <AnimatePresence>
                      {notifications > 0 && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                        >
                          <Badge 
                            variant="destructive" 
                            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-gradient-to-r from-pink-500 to-purple-500"
                          >
                            {notifications}
                          </Badge>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="end" 
                  className="w-80 bg-gradient-to-b from-background/95 to-background/80 backdrop-blur-xl border-white/10"
                >
                  <DropdownMenuLabel className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-bold">
                    Notifications
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <div className="max-h-[500px] overflow-y-auto">
                    <div className="p-4 text-sm text-muted-foreground">No new notifications</div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Profile Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="rounded-full p-1 hover:bg-white/10 transition-all duration-200"
                  >
                    <Avatar className="ring-2 ring-offset-2 ring-offset-background ring-purple-500/50">
                      <AvatarImage src={user?.avatar || "/placeholder.svg"} />
                      <AvatarFallback className="bg-gradient-to-r from-purple-600 to-pink-600">
                        {user?.name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="end" 
                  className="w-56 bg-gradient-to-b from-background/95 to-background/80 backdrop-blur-xl border-white/10"
                >
                  <motion.div 
                    className="flex items-center gap-3 p-3"
                    whileHover={{ scale: 1.02 }}
                  >
                    <Avatar className="ring-2 ring-purple-500/50">
                      <AvatarImage src={user?.avatar || "/placeholder.svg"} />
                      <AvatarFallback className="bg-gradient-to-r from-purple-600 to-pink-600">
                        {user?.name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-medium">{user?.name}</span>
                      <span className="text-sm text-muted-foreground">{user?.phoneNumber}</span>
                    </div>
                  </motion.div>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuGroup>
                    <DropdownMenuItem className="hover:bg-white/10 group">
                      <Camera className="w-4 h-4 mr-2 group-hover:text-purple-500 transition-colors" />
                      Share Media
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:bg-white/10 group">
                      <MessageSquare className="w-4 h-4 mr-2 group-hover:text-purple-500 transition-colors" />
                      New Chat
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:bg-white/10 group">
                      <Users className="w-4 h-4 mr-2 group-hover:text-purple-500 transition-colors" />
                      New Group
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:bg-white/10 group">
                      <Broadcast className="w-4 h-4 mr-2 group-hover:text-purple-500 transition-colors" />
                      New Broadcast
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem className="hover:bg-white/10 group">
                    <Settings className="w-4 h-4 mr-2 group-hover:text-purple-500 transition-colors" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem 
                    className="text-red-400 hover:text-red-300 hover:bg-red-400/10 group" 
                    onSelect={() => logout()}
                  >
                    <LogOut className="w-4 h-4 mr-2 group-hover:text-red-300 transition-colors" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

