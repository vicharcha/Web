import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { motion } from 'framer-motion'

interface BottomNavItemProps {
  id: string
  icon: React.ElementType
  label: string
  href: string
  isActive: boolean
  onClick: () => void
}

export function BottomNavItem({ icon: Icon, label, href, isActive, onClick }: BottomNavItemProps) {
  return (
    <Link href={href} passHref>
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "flex-col items-center text-xs relative group transition-colors duration-200",
          isActive ? "text-primary" : "text-muted-foreground hover:text-primary"
        )}
        onClick={onClick}
      >
        <Icon className="w-5 h-5 mb-1" />
        <span className="sr-only md:not-sr-only md:text-[10px]">{label}</span>
        {isActive && (
          <motion.span 
            className="absolute -bottom-2 left-1/2 w-1 h-1 bg-primary rounded-full"
            layoutId="bottomNavIndicator"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        )}
      </Button>
    </Link>
  )
}

