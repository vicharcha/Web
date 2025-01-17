"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Send, Repeat, PlusCircle, ArrowUpRight, ArrowDownLeft, Search } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { motion } from 'framer-motion'

const recentTransactions = [
  { id: '1', type: 'sent', amount: 500, to: 'Rahul', date: '2023-05-15' },
  { id: '2', type: 'received', amount: 1000, from: 'Priya', date: '2023-05-14' },
  { id: '3', type: 'sent', amount: 200, to: 'Amit', date: '2023-05-13' },
]

export default function PaymentsPage() {
  const [amount, setAmount] = useState('')
  const [recipient, setRecipient] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredTransactions = recentTransactions.filter(transaction =>
    transaction.to?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    transaction.from?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold">Payments</h1>

      <Card>
        <CardHeader>
          <CardTitle>Wallet Balance</CardTitle>
          <CardDescription>Your current balance</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold">₹10,000</p>
        </CardContent>
        <CardFooter>
          <Button className="w-full">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Money
          </Button>
        </CardFooter>
      </Card>

      <Tabs defaultValue="send">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="send">Send Money</TabsTrigger>
          <TabsTrigger value="request">Request Money</TabsTrigger>
          <TabsTrigger value="history">Transaction History</TabsTrigger>
        </TabsList>
        <TabsContent value="send">
          <Card>
            <CardHeader>
              <CardTitle>Send Money</CardTitle>
              <CardDescription>Transfer money to your contacts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                type="number"
              />
              <Input
                placeholder="Enter recipient's name or number"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
              />
            </CardContent>
            <CardFooter>
              <Button className="w-full">
                <Send className="mr-2 h-4 w-4" /> Send Money
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="request">
          <Card>
            <CardHeader>
              <CardTitle>Request Money</CardTitle>
              <CardDescription>Ask for payments from your contacts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                type="number"
              />
              <Input
                placeholder="Enter sender's name or number"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
              />
            </CardContent>
            <CardFooter>
              <Button className="w-full">
                <Repeat className="mr-2 h-4 w-4" /> Request Money
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Your payment activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search transactions..."
                  className="pl-9 pr-4"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <ScrollArea className="h-[300px]">
                <ul className="space-y-4">
                  {filteredTransactions.map(transaction => (
                    <motion.li 
                      key={transaction.id} 
                      className="flex items-center justify-between"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                    >
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarFallback>{transaction.to?.[0] || transaction.from?.[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{transaction.to || transaction.from}</p>
                          <p className="text-sm text-muted-foreground">{transaction.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={transaction.type === 'sent' ? 'destructive' : 'default'}>
                          {transaction.type === 'sent' ? (
                            <ArrowUpRight className="h-4 w-4 mr-1" />
                          ) : (
                            <ArrowDownLeft className="h-4 w-4 mr-1" />
                          )}
                          ₹{transaction.amount}
                        </Badge>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
