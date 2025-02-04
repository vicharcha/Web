"use client"

import { useState, useEffect } from "react";
import { useAuth } from "@/app/components/auth-provider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ProfilePage() {
  const { user, setUserName } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || "");

  useEffect(() => {
    if (user) {
      setName(user.name);
      setPhoneNumber(user.phoneNumber);
    }
  }, [user]);

  const handleSave = () => {
    setUserName(name);
  };

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={`/placeholder.svg?text=${name[0] || "U"}`} alt={name || "User"} />
              <AvatarFallback>{name[0] || "U"}</AvatarFallback>
            </Avatar>
          </div>
          <div className="grid w-full items-center gap-1.5">
            <label htmlFor="name">Name</label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="grid w-full items-center gap-1.5">
            <label htmlFor="phone">Phone Number</label>
            <Input id="phone" value={phoneNumber} disabled />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSave}>Save Changes</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
