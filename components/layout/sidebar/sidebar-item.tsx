import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

interface SidebarItemProps {
  item: {
    id: string
    icon: React.ElementType
    label: string
    href: string
    highlight?: boolean
    badge?: string
    important?: boolean
  }
  collapsed: boolean
  isActive: boolean
  onClick?: () => void
  className?: string
}

export function SidebarItem({ item, collapsed, isActive, onClick, className }: SidebarItemProps) {
  return (
    <Link href={item.href} passHref>
      <Button
        variant="ghost"
        className={cn(
          "w-full flex items-center gap-3 p-2 rounded-lg transition-all duration-200",
          collapsed ? "justify-center" : "justify-between",
          isActive && "bg-gradient-to-r from-primary/20 to-primary/10 text-primary",
          !isActive && "hover:bg-gray-100/5",
          item.important && "border border-red-500/20",
          "group relative",
          className
        )}
        onClick={onClick}
      >
        <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
          <div className="relative">
            <item.icon className={cn(
              "h-5 w-5 transition-colors",
              isActive ? "text-primary" : "text-muted-foreground group-hover:text-primary"
            )} />
            {item.badge && !collapsed && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full" />
            )}
          </div>
          {!collapsed && (
            <span className={cn(
              "font-medium text-sm truncate",
              isActive ? "text-primary" : "text-muted-foreground group-hover:text-primary"
            )}>
              {item.label}
            </span>
          )}
        </div>

        {!collapsed && item.highlight && (
          <ArrowRight className="w-4 h-4 text-muted-foreground/50 group-hover:text-primary transition-colors" />
        )}
      </Button>
    </Link>
  )
}

