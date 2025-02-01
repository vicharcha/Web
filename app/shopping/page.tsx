import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ShoppingCart, Heart } from "lucide-react"

function ProductCard({ name, price, image }) {
  return (
    <Card className="w-full">
      <CardContent className="p-0">
        <img src={image || "/placeholder.svg?height=200&width=200"} alt={name} className="w-full h-48 object-cover" />
      </CardContent>
      <CardHeader>
        <CardTitle className="text-lg">{name}</CardTitle>
      </CardHeader>
      <CardFooter className="flex justify-between">
        <span className="text-xl font-bold">₹{price}</span>
        <div className="space-x-2">
          <Button size="icon" variant="outline">
            <Heart className="h-4 w-4" />
          </Button>
          <Button size="icon">
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

export default function ShoppingPage() {
  const products = [
    { name: "Smartphone", price: 15999, image: "/placeholder.svg?height=200&width=200" },
    { name: "Laptop", price: 49999, image: "/placeholder.svg?height=200&width=200" },
    { name: "Headphones", price: 2999, image: "/placeholder.svg?height=200&width=200" },
    { name: "Smartwatch", price: 5999, image: "/placeholder.svg?height=200&width=200" },
    { name: "Camera", price: 29999, image: "/placeholder.svg?height=200&width=200" },
    { name: "Tablet", price: 19999, image: "/placeholder.svg?height=200&width=200" },
  ]

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Vicharcha Shopping</h1>
      <div className="flex justify-between items-center mb-6">
        <Input placeholder="Search products" className="max-w-sm" />
        <Button>
          <ShoppingCart className="mr-2 h-4 w-4" />
          Cart (0)
        </Button>
      </div>
      <Tabs defaultValue="all" className="w-full mb-6">
        <TabsList>
          <TabsTrigger value="all">All Products</TabsTrigger>
          <TabsTrigger value="electronics">Electronics</TabsTrigger>
          <TabsTrigger value="fashion">Fashion</TabsTrigger>
          <TabsTrigger value="home">Home & Living</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product, index) => (
              <ProductCard key={index} {...product} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="electronics">
          <p>Electronics category content goes here.</p>
        </TabsContent>
        <TabsContent value="fashion">
          <p>Fashion category content goes here.</p>
        </TabsContent>
        <TabsContent value="home">
          <p>Home & Living category content goes here.</p>
        </TabsContent>
      </Tabs>
    </div>
  )
}

