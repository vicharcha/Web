import { Button } from "@/components/ui/button"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Paperclip, Image, Camera, FileText } from 'lucide-react'

interface AttachmentMenuProps {
  onSelect: (type: string) => void
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AttachmentMenu({ onSelect, open, onOpenChange }: AttachmentMenuProps) {
  return (
    <DropdownMenu open={open} onOpenChange={onOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Paperclip className="h-5 w-5" />
          <span className="sr-only">Add attachment</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem onClick={() => onSelect('document')}>
          <FileText className="mr-2 h-4 w-4" />
          Document
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onSelect('media')}>
          <Image className="mr-2 h-4 w-4" />
          Photo or Video
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onSelect('camera')}>
          <Camera className="mr-2 h-4 w-4" />
          Camera
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
