import React, { useState } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, Bell, Users, Heart, MessageCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { motion } from 'framer-motion';

interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  category: string;
}

interface NotificationCategory {
  id: string;
  label: string;
  icon: React.ElementType;
}

export function NotificationPanel() {
  const categories: NotificationCategory[] = [
    { id: 'all', label: 'All', icon: Bell },
    { id: 'mentions', label: 'Mentions', icon: MessageCircle },
    { id: 'likes', label: 'Likes', icon: Heart },
    { id: 'follows', label: 'Follows', icon: Users },
  ];

  const [activeCategory, setActiveCategory] = useState('all');
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'New Like',
      message: 'Someone liked your post.',
      timestamp: '2 hours ago',
      read: false,
      category: 'likes',
    },
    {
      id: '2',
      title: 'New Follower',
      message: 'You have a new follower.',
      timestamp: '1 day ago',
      read: true,
      category: 'follows',
    },
  ]);

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const filteredNotifications = notifications.filter(notif => 
    activeCategory === 'all' || notif.category === activeCategory
  );

  return (
    <div className="w-[350px]">
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="w-full">
          {categories.map(category => (
            <TabsTrigger
              key={category.id}
              value={category.id}
              onClick={() => setActiveCategory(category.id)}
              className="flex items-center gap-2"
            >
              <category.icon className="h-4 w-4" />
              {category.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeCategory}>
          <ScrollArea className="h-[400px] w-full p-4">
            <div className="space-y-4">
              {filteredNotifications.map((notification) => (
                <motion.div 
                  key={notification.id}
                  className={`p-4 rounded-lg border ${
                    notification.read ? 'bg-background' : 'bg-muted'
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold">{notification.title}</h4>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => markAsRead(notification.id)}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">{notification.message}</p>
                  <span className="text-xs text-muted-foreground mt-2">
                    {notification.timestamp}
                  </span>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}
