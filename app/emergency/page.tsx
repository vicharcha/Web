"use client"

import { useState } from "react"
import styles from "./emergency.module.css"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Phone, Plus, AlertTriangle, MapPin } from "lucide-react"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"

// Fix for default marker icon in Leaflet with Next.js
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/leaflet/marker-icon-2x.png",
  iconUrl: "/leaflet/marker-icon.png",
  shadowUrl: "/leaflet/marker-shadow.png",
})

export default function EmergencyPage() {
  const [showMap, setShowMap] = useState(false)
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)

  const emergencyServices = [
    { name: "City Hospital", lat: 17.385, lng: 78.4867, type: "Hospital" },
    { name: "Central Police Station", lat: 17.3891, lng: 78.4818, type: "Police" },
    { name: "Fire Station No. 1", lat: 17.3774, lng: 78.4908, type: "Fire" },
  ]

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude])
          setShowMap(true)
        },
        (error) => {
          console.error("Error getting user location:", error)
          setShowMap(true) // Show map even if we can't get user location
        },
      )
    } else {
      console.error("Geolocation is not supported by this browser.")
      setShowMap(true) // Show map even if geolocation is not supported
    }
  }

  return (
    <div className="emergency-container">
      <h1 className="emergency-header">
        <AlertTriangle className="alert-icon" />
        Emergency Services
      </h1>

      <Card className="emergency-card">
        <CardHeader className="emergency-card-header">
          <CardTitle>Emergency Contacts</CardTitle>
        </CardHeader>
        <CardContent className="emergency-card-content">
          <div>
            <div className="contact-item">
              <span>Police</span>
              <Button variant="outline" className="contact-item">
                <Phone className="phone-icon" />
                100
              </Button>
            </div>
            <div className={styles["contact-item"]}>
              <span>Ambulance</span>
              <Button variant="outline" className={styles["contact-item"]}>
                <Phone className={styles["phone-icon"]} />
                102
              </Button>
            </div>
            <div className={styles["contact-item"]}>
              <span>Fire Department</span>
              <Button variant="outline" className={styles["contact-item"]}>
                <Phone className={styles["phone-icon"]} />
                101
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className={styles["emergency-card"]}>
        <CardHeader className={styles["emergency-card-header"]}>
          <CardTitle>Add Personal Emergency Contact</CardTitle>
        </CardHeader>
        <CardContent className={styles["emergency-card-content"]}>
          <form className="space-y-4">
            <Input placeholder="Contact Name" />
            <Input placeholder="Phone Number" type="tel" />
            <Button className="emergency-button">
              <Plus className="mr-2 h-4 w-4" />
              Add Contact
            </Button>
          </form>
        </CardContent>
      </Card>

      <Button className={styles["emergency-button"]}>Call Emergency Services</Button>

      <Button className="emergency-map-button" onClick={getUserLocation}>
        <MapPin className="mr-2 h-4 w-4" />
        {showMap ? "Hide" : "Show"} Nearby Emergency Services
      </Button>

      {showMap && (
        <Card className="emergency-card">
          <CardContent className="emergency-card-content">
            <div className="emergency-map-container">
              <div className="emergency-map">
                <MapContainer
                  center={userLocation || [17.385, 78.4867]}
                  zoom={13}
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  {userLocation && (
                    <Marker position={userLocation}>
                      <Popup>Your Location</Popup>
                    </Marker>
                  )}
                  {emergencyServices.map((service, index) => (
                    <Marker key={index} position={[service.lat, service.lng]}>
                      <Popup>
                        {service.name} ({service.type})
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
