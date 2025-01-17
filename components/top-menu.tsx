"use client"

import { useState } from 'react'
import { CreditCard, Camera, Users, AirplayIcon as Broadcast, Settings, Search, Bell, MoreHorizontal, LogOut, PlusCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import { Badge } from '@/components/ui/badge'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from '@/components/auth-provider'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function TopMenu() {
  const [notifications] = useState(3)
  const { logout, user } = useAuth()

  return (
    <div className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-sm border-b">
      <div className="flex items-center justify-between p-2">
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Search className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="top">
              <SheetHeader>
                <SheetTitle>Search Vicharcha</SheetTitle>
              </SheetHeader>
              <div className="py-4">
                <Input placeholder="Search anything..." className="w-full" />
              </div>
            </SheetContent>
          </Sheet>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5" />
            {notifications > 0 && (
              <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0">
                {notifications}
              </Badge>
            )}
          </Button>
        </div>
        <h1 className="text-xl font-bold md:hidden">Vicharcha</h1>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="ghost" size="icon">
            <PlusCircle className="w-5 h-5" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar>
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Camera className="w-4 h-4 mr-2" />
                Photo/Video
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Users className="w-4 h-4 mr-2" />
                Groups
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Broadcast className="w-4 h-4 mr-2" />
                Broadcast
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => logout()}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}

