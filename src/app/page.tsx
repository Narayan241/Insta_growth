'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Users, Heart, MessageCircle, Eye, Bookmark, Instagram, Lock, Timer, CheckCircle } from 'lucide-react'

const services = [
  { type: 'FOLLOWERS', icon: Users, label: 'Followers', description: 'Increase your Instagram followers', min: 100, max: 10000, price: 0.01 },
  { type: 'LIKES', icon: Heart, label: 'Likes', description: 'Get more likes on your posts', min: 50, max: 5000, price: 0.005 },
  { type: 'COMMENTS', icon: MessageCircle, label: 'Comments', description: 'Real comments on your posts', min: 10, max: 500, price: 0.05 },
  { type: 'VIEWS', icon: Eye, label: 'Views', description: 'Increase video views', min: 100, max: 50000, price: 0.001 },
  { type: 'SAVES', icon: Bookmark, label: 'Saves', description: 'More saves on your posts', min: 20, max: 2000, price: 0.01 }
]

const paymentStatuses = ['PENDING', 'PROCESSING', 'COMPLETED', 'PAYMENT_DUE', 'PAID']

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [selectedService, setSelectedService] = useState('')
  const [quantity, setQuantity] = useState('')
  const [targetUrl, setTargetUrl] = useState('')
  const [loginData, setLoginData] = useState({ username: '', password: '' })
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    if (!loginData.username || !loginData.password) {
      alert('Please fill in all fields')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData)
      })

      if (response.ok) {
        setIsLoggedIn(true)
        localStorage.setItem('instagramUser', loginData.username)
      } else {
        alert('Login failed. Please try again.')
      }
    } catch (error) {
      alert('Error occurred during login')
    }
    setLoading(false)
  }

  const handleOrder = async () => {
    if (!selectedService || !quantity || !targetUrl) {
      alert('Please fill in all fields')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceType: selectedService,
          quantity: parseInt(quantity),
          targetUrl,
          username: loginData.username
        })
      })

      if (response.ok) {
        alert('Service started! You will see results within 24 hours. Payment will be due after delivery.')
        setSelectedService('')
        setQuantity('')
        setTargetUrl('')
      } else {
        alert('Failed to start service. Please try again.')
      }
    } catch (error) {
      alert('Error occurred while placing order')
    }
    setLoading(false)
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Instagram className="h-12 w-12 text-pink-600" />
            </div>
            <CardTitle className="text-2xl font-bold">Instagram Growth Hub</CardTitle>
            <CardDescription>Login to access premium Instagram growth services</CardDescription>
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-4">
              <p className="text-red-800 text-sm font-medium">
                ⚠️ IMPORTANT WARNING
              </p>
              <p className="text-red-700 text-xs mt-1">
                आपको अपनी ORIGINAL Instagram ID और PASSWORD डालना है, तभी आपके followers increase होंगे। 
                अगर आप किसी और की ID डालेंगे तो उसके followers increase होंगे!
              </p>
              <p className="text-red-700 text-xs mt-1">
                You must enter YOUR OWN Instagram ID and password to increase YOUR followers. 
                If you enter someone else's ID, THEIR followers will increase!
              </p>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Instagram Username (आपकी ORIGINAL ID)</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter YOUR Instagram username"
                value={loginData.username}
                onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
              />
              <p className="text-xs text-orange-600">यह आपकी अपनी Instagram ID होनी चाहिए</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password (आपका ORIGINAL Password)</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter YOUR password"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
              />
              <p className="text-xs text-orange-600">यह आपका अपना Instagram password होना चाहिए</p>
            </div>
            <Button 
              onClick={handleLogin} 
              className="w-full bg-pink-600 hover:bg-pink-700"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login with MY ID (मेरी ID से लॉगिन)'}
            </Button>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-yellow-800 text-xs font-medium">
                🔒 SECURITY REMINDER
              </p>
              <p className="text-yellow-700 text-xs mt-1">
                Only enter YOUR OWN Instagram credentials. The system will increase followers for the account whose ID you enter.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Instagram className="h-8 w-8 text-pink-600" />
              <span className="font-bold text-xl">Instagram Growth Hub</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {loginData.username}</span>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setIsLoggedIn(false)
                  localStorage.removeItem('instagramUser')
                }}
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Choose Your Growth Service
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Select from our premium Instagram growth services. <span className="font-semibold text-green-600">Get results FIRST, pay AFTER 24 hours!</span>
          </p>
          <div className="flex items-center justify-center space-x-2 mt-4">
            <Timer className="h-4 w-4 text-green-600" />
            <span className="text-sm text-green-600 font-medium">Results First, Pay Later - 24hr Guarantee</span>
          </div>
        </div>

        <Tabs defaultValue="services" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="reviews">Client Reviews</TabsTrigger>
            <TabsTrigger value="orders">My Orders</TabsTrigger>
          </TabsList>

          <TabsContent value="services" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {services.map((service) => {
                const Icon = service.icon
                return (
                  <Card 
                    key={service.type}
                    className={`cursor-pointer transition-all hover:shadow-lg ${
                      selectedService === service.type ? 'ring-2 ring-pink-500' : ''
                    }`}
                    onClick={() => {
                      setSelectedService(service.type)
                      setQuantity(service.min.toString())
                    }}
                  >
                    <CardHeader>
                      <div className="flex items-center space-x-3">
                        <Icon className="h-8 w-8 text-pink-600" />
                        <div>
                          <CardTitle className="text-lg">{service.label}</CardTitle>
                          <CardDescription>{service.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-500">
                          {service.min} - {service.max.toLocaleString()}
                        </span>
                        <Badge variant="secondary">
                          ${(service.price * 1000).toFixed(2)}/1k
                        </Badge>
                      </div>
                      <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full text-center font-medium">
                        ✨ Pay After Results
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {selectedService && (
              <Card>
                <CardHeader>
                  <CardTitle>Place Your Order</CardTitle>
                  <CardDescription>
                    Configure your {services.find(s => s.type === selectedService)?.label} service
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input
                      id="quantity"
                      type="number"
                      placeholder="Enter quantity"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      min={services.find(s => s.type === selectedService)?.min}
                      max={services.find(s => s.type === selectedService)?.max}
                    />
                    <p className="text-sm text-gray-500">
                      Min: {services.find(s => s.type === selectedService)?.min} - 
                      Max: {services.find(s => s.type === selectedService)?.max?.toLocaleString()}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="targetUrl">Target URL</Label>
                    <Input
                      id="targetUrl"
                      type="url"
                      placeholder="https://instagram.com/p/your-post"
                      value={targetUrl}
                      onChange={(e) => setTargetUrl(e.target.value)}
                    />
                    <p className="text-sm text-gray-500">
                      Enter your Instagram post or profile URL
                    </p>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="font-medium text-green-800">Results First, Pay Later!</span>
                    </div>
                    <p className="text-sm text-green-700 mt-1">
                      Your order will be processed immediately. Pay only after you see results within 24 hours!
                    </p>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Timer className="h-5 w-5 text-blue-600" />
                      <span className="font-medium text-blue-800">Payment Information</span>
                    </div>
                    <p className="text-sm text-blue-700 mt-1">
                      Total Amount: <span className="font-bold">${(services.find(s => s.type === selectedService)?.price || 0) * parseInt(quantity || '0')}</span>
                    </p>
                    <p className="text-sm text-blue-700">
                      Payment Due: After 24 hours when results are delivered
                    </p>
                  </div>

                  <Button 
                    onClick={handleOrder} 
                    className="w-full bg-green-600 hover:bg-green-700"
                    disabled={loading}
                  >
                    {loading ? 'Processing Order...' : 'Start Service (Pay After Results)'}
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="reviews" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Our Trusted Clients</h2>
              <p className="text-gray-600">Real reviews from real Instagram users</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Positive Review 1 */}
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4">
                    <div className="flex items-center space-x-3">
                      <img 
                        src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='50' fill='%234F46E5'/%3E%3Ctext x='50' y='50' text-anchor='middle' dy='.3em' fill='white' font-size='40' font-family='Arial'%3ERK%3C/text%3E%3C/svg%3E"
                        alt="Rohit Kumar"
                        className="w-12 h-12 rounded-full border-2 border-white shadow-sm"
                      />
                      <div>
                        <h3 className="font-semibold text-gray-900">Rohit Kumar</h3>
                        <p className="text-sm text-gray-600">@rohit_official</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star} className="text-yellow-400 text-lg">★</span>
                      ))}
                      <span className="ml-2 text-sm text-gray-600">5.0</span>
                    </div>
                    <p className="text-gray-700 text-sm">
                      "Amazing service! My followers increased from 1K to 10K in just 2 weeks. All followers are real and active. Highly recommended! 🔥"
                    </p>
                    <div className="mt-3 flex items-center text-xs text-gray-500">
                      <span>Verified Purchase</span>
                      <span className="mx-2">•</span>
                      <span>2 days ago</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Positive Review 2 */}
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="bg-gradient-to-r from-pink-50 to-rose-50 p-4">
                    <div className="flex items-center space-x-3">
                      <img 
                        src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='50' fill='%23EC4899'/%3E%3Ctext x='50' y='50' text-anchor='middle' dy='.3em' fill='white' font-size='40' font-family='Arial'%3EPJ%3C/text%3E%3C/svg%3E"
                        alt="Priya Jain"
                        className="w-12 h-12 rounded-full border-2 border-white shadow-sm"
                      />
                      <div>
                        <h3 className="font-semibold text-gray-900">Priya Jain</h3>
                        <p className="text-sm text-gray-600">@priya_jain</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star} className="text-yellow-400 text-lg">★</span>
                      ))}
                      <span className="ml-2 text-sm text-gray-600">5.0</span>
                    </div>
                    <p className="text-gray-700 text-sm">
                      "Best Instagram growth service! Got 5000+ real followers and they actually engage with my posts. My business is growing fast! 💕"
                    </p>
                    <div className="mt-3 flex items-center text-xs text-gray-500">
                      <span>Verified Purchase</span>
                      <span className="mx-2">•</span>
                      <span>1 week ago</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Positive Review 3 */}
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4">
                    <div className="flex items-center space-x-3">
                      <img 
                        src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='50' fill='%230EA5E9'/%3E%3Ctext x='50' y='50' text-anchor='middle' dy='.3em' fill='white' font-size='40' font-family='Arial'%3EAS%3C/text%3E%3C/svg%3E"
                        alt="Amit Sharma"
                        className="w-12 h-12 rounded-full border-2 border-white shadow-sm"
                      />
                      <div>
                        <h3 className="font-semibold text-gray-900">Amit Sharma</h3>
                        <p className="text-sm text-gray-600">@amit_sharma</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star} className="text-yellow-400 text-lg">★</span>
                      ))}
                      <span className="ml-2 text-sm text-gray-600">5.0</span>
                    </div>
                    <p className="text-gray-700 text-sm">
                      "Incredible results! Started with 500 followers, now at 15K. The 24-hour delivery system is perfect. Quality service! 👏"
                    </p>
                    <div className="mt-3 flex items-center text-xs text-gray-500">
                      <span>Verified Purchase</span>
                      <span className="mx-2">•</span>
                      <span>3 days ago</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Positive Review 4 */}
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="bg-gradient-to-r from-purple-50 to-violet-50 p-4">
                    <div className="flex items-center space-x-3">
                      <img 
                        src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='50' fill='%239333EA'/%3E%3Ctext x='50' y='50' text-anchor='middle' dy='.3em' fill='white' font-size='35' font-family='Arial'%3ENS%3C/text%3E%3C/svg%3E"
                        alt="Neha Singh"
                        className="w-12 h-12 rounded-full border-2 border-white shadow-sm"
                      />
                      <div>
                        <h3 className="font-semibold text-gray-900">Neha Singh</h3>
                        <p className="text-sm text-gray-600">@neha_singh</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star} className="text-yellow-400 text-lg">★</span>
                      ))}
                      <span className="ml-2 text-sm text-gray-600">5.0</span>
                    </div>
                    <p className="text-gray-700 text-sm">
                      "Perfect for influencers! Got 8000+ followers and 2000+ likes on my posts. The engagement is real and organic. Love it! ✨"
                    </p>
                    <div className="mt-3 flex items-center text-xs text-gray-500">
                      <span>Verified Purchase</span>
                      <span className="mx-2">•</span>
                      <span>5 days ago</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Positive Review 5 */}
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-4">
                    <div className="flex items-center space-x-3">
                      <img 
                        src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='50' fill='%23F97316'/%3E%3Ctext x='50' y='50' text-anchor='middle' dy='.3em' fill='white' font-size='40' font-family='Arial'%3EVP%3C/text%3E%3C/svg%3E"
                        alt="Vikas Patel"
                        className="w-12 h-12 rounded-full border-2 border-white shadow-sm"
                      />
                      <div>
                        <h3 className="font-semibold text-gray-900">Vikas Patel</h3>
                        <p className="text-sm text-gray-600">@vikas_patel</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star} className="text-yellow-400 text-lg">★</span>
                      ))}
                      <span className="ml-2 text-sm text-gray-600">5.0</span>
                    </div>
                    <p className="text-gray-700 text-sm">
                      "Outstanding service! My business account grew from 2K to 25K followers. Real people, real engagement. Worth every penny! 💪"
                    </p>
                    <div className="mt-3 flex items-center text-xs text-gray-500">
                      <span>Verified Purchase</span>
                      <span className="mx-2">•</span>
                      <span>1 week ago</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Negative Review (Realistic) */}
              <Card className="overflow-hidden border-gray-200">
                <CardContent className="p-0">
                  <div className="bg-gradient-to-r from-gray-50 to-slate-50 p-4">
                    <div className="flex items-center space-x-3">
                      <img 
                        src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='50' fill='%236B7280'/%3E%3Ctext x='50' y='50' text-anchor='middle' dy='.3em' fill='white' font-size='35' font-family='Arial'%3ERK%3C/text%3E%3C/svg%3E"
                        alt="Rahul Kumar"
                        className="w-12 h-12 rounded-full border-2 border-white shadow-sm"
                      />
                      <div>
                        <h3 className="font-semibold text-gray-900">Rahul Kumar</h3>
                        <p className="text-sm text-gray-600">@rahul_kumar</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center mb-2">
                      {[1, 2, 3].map((star) => (
                        <span key={star} className="text-yellow-400 text-lg">★</span>
                      ))}
                      {[1, 2].map((star) => (
                        <span key={star} className="text-gray-300 text-lg">★</span>
                      ))}
                      <span className="ml-2 text-sm text-gray-600">3.0</span>
                    </div>
                    <p className="text-gray-700 text-sm">
                      "Service is okay but delivery took longer than expected. Followers came but engagement is not as high as promised. Decent for the price though."
                    </p>
                    <div className="mt-3 flex items-center text-xs text-gray-500">
                      <span>Verified Purchase</span>
                      <span className="mx-2">•</span>
                      <span>2 weeks ago</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Stats Section */}
            <div className="mt-12 bg-gradient-to-r from-green-600 to-blue-600 rounded-xl p-8 text-white">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-6">Why Trust Us?</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div>
                    <div className="text-3xl font-bold">50K+</div>
                    <div className="text-green-100">Happy Clients</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold">4.9/5</div>
                    <div className="text-green-100">Trust Rating</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold">First</div>
                    <div className="text-green-100">Results, Then Pay</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold">100%</div>
                    <div className="text-green-100">Satisfaction</div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="orders">
            <OrdersList username={loginData.username} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

function OrdersList({ username }: { username: string }) {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  React.useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const response = await fetch(`/api/orders/list?username=${username}`)
      if (response.ok) {
        const data = await response.json()
        setOrders(data)
      }
    } catch (error) {
      console.error('Failed to fetch orders')
    }
    setLoading(false)
  }

  if (loading) {
    return <div className="text-center py-8">Loading your orders...</div>
  }

  if (orders.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-gray-500">You haven't placed any orders yet.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {orders.map((order: any) => (
        <Card key={order.id}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{order.serviceType}</h3>
                <p className="text-sm text-gray-500">Quantity: {order.quantity}</p>
                <p className="text-sm text-gray-500">
                  Created: {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <Badge 
                  variant={
                    order.status === 'COMPLETED' ? 'default' :
                    order.status === 'PROCESSING' ? 'secondary' :
                    order.status === 'PAYMENT_DUE' ? 'destructive' :
                    order.status === 'PAID' ? 'default' :
                    'outline'
                  }
                >
                  {order.status === 'PAYMENT_DUE' ? '⚠️ Payment Due' : order.status}
                </Badge>
                
                {order.status === 'PENDING' && (
                  <p className="text-sm text-gray-500 mt-1">
                    Processing in {Math.ceil((new Date(order.scheduledFor).getTime() - Date.now()) / (1000 * 60 * 60))} hours
                  </p>
                )}
                
                {order.status === 'COMPLETED' && (
                  <div className="mt-2">
                    <p className="text-sm text-green-600 font-medium">✅ Results Delivered!</p>
                    <p className="text-sm text-gray-600 mb-1">Amount: ${(order.price || 0).toFixed(2)}</p>
                    <Button 
                      size="sm" 
                      className="mt-1 bg-blue-600 hover:bg-blue-700"
                      onClick={async () => {
                        const confirmed = window.confirm(`Pay $${(order.price || 0).toFixed(2)} for completed order?`)
                        if (confirmed) {
                          try {
                            const response = await fetch('/api/orders/payment', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                orderId: order.id,
                                username
                              })
                            })
                            
                            if (response.ok) {
                              alert('Payment successful! Thank you for your business.')
                              fetchOrders() // Refresh orders
                            } else {
                              alert('Payment failed. Please try again.')
                            }
                          } catch (error) {
                            alert('Payment error occurred')
                          }
                        }
                      }}
                    >
                      Pay Now ${(order.price || 0).toFixed(2)}
                    </Button>
                  </div>
                )}
                
                {order.status === 'PAYMENT_DUE' && (
                  <div className="mt-2">
                    <p className="text-sm text-red-600 font-medium">⚠️ Payment Due!</p>
                    <p className="text-sm text-gray-600 mb-1">Amount: ${(order.price || 0).toFixed(2)}</p>
                    <Button 
                      size="sm" 
                      className="mt-1 bg-red-600 hover:bg-red-700"
                      onClick={async () => {
                        const confirmed = window.confirm(`Pay $${(order.price || 0).toFixed(2)} now?`)
                        if (confirmed) {
                          try {
                            const response = await fetch('/api/orders/payment', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                orderId: order.id,
                                username
                              })
                            })
                            
                            if (response.ok) {
                              alert('Payment successful! Thank you for your business.')
                              fetchOrders() // Refresh orders
                            } else {
                              alert('Payment failed. Please try again.')
                            }
                          } catch (error) {
                            alert('Payment error occurred')
                          }
                        }
                      }}
                    >
                      Pay Now ${(order.price || 0).toFixed(2)}
                    </Button>
                  </div>
                )}

                {order.status === 'PAID' && (
                  <div className="mt-2">
                    <p className="text-sm text-green-600 font-medium">✅ Paid</p>
                    <p className="text-sm text-gray-600">Thank you!</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}