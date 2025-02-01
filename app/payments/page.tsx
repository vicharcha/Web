"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CreditCard, Smartphone, DollarSign } from "lucide-react"
import QRCode from "react-qr-code"

export default function Payments() {
  const [upiId, setUpiId] = useState("")
  const [amount, setAmount] = useState("")

  const handleUPIPayment = () => {
    // Implement UPI payment logic here
    console.log(`Initiating UPI payment to ${upiId} for amount ${amount}`)
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <Card className="bg-background">
        <CardHeader>
          <CardTitle>Wallet Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold mb-4">₹10,000</p>
          <Button className="w-full mb-4">Add Money</Button>

          <Tabs defaultValue="upi" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="upi">
                <Smartphone className="mr-2 h-4 w-4" />
                UPI
              </TabsTrigger>
              <TabsTrigger value="card">
                <CreditCard className="mr-2 h-4 w-4" />
                Card
              </TabsTrigger>
              <TabsTrigger value="bank">
                <DollarSign className="mr-2 h-4 w-4" />
                Bank
              </TabsTrigger>
            </TabsList>
            <TabsContent value="upi">
              <div className="space-y-4 mt-4">
                <Input placeholder="Enter UPI ID" value={upiId} onChange={(e) => setUpiId(e.target.value)} />
                <Input
                  placeholder="Enter amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
                <Button className="w-full" onClick={handleUPIPayment}>
                  Pay with UPI
                </Button>
                <div className="mt-4 flex justify-center">
                  <QRCode value={`upi://pay?pa=${upiId}&am=${amount}&cu=INR`} size={128} />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="card">
              <div className="space-y-4 mt-4">
                <Input placeholder="Card Number" />
                <div className="flex space-x-2">
                  <Input placeholder="MM/YY" />
                  <Input placeholder="CVV" />
                </div>
                <Button className="w-full">Pay with Card</Button>
              </div>
            </TabsContent>
            <TabsContent value="bank">
              <div className="space-y-4 mt-4">
                <Input placeholder="Account Number" />
                <Input placeholder="IFSC Code" />
                <Button className="w-full">Pay via Bank Transfer</Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

