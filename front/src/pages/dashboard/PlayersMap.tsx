import React from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

import "../../css/initialpages/dashboard/playersmap.css"

import { useEffect, useState } from 'react'
import { useSocket } from '../../utils/SocketContext'

// Removed unnecessary line as _getIconUrl is not a valid property
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  
})

const PlayersMap: React.FC = () => {
    const [locations, setLocations] = useState<any>(null)
    const socket = useSocket();

    useEffect(() => {
        socket?.on("players_locations", (data: any) => {
            setLocations(data)
        })

        return () => {
            socket?.off("players_locations")
        }

    }, [socket]);

    useEffect(() => {
        socket?.emit("get_players_locations");
        return () => {
            socket?.off("get_players_locations");
        }
    }, [])


    return (
        <div id="dashboard_players_map">
            <MapContainer 
            center={
                locations?.length
                  ? [locations[0].latitude, locations[0].longitude] as [number, number]
                  : [0, 0] as [number, number]
            }
            zoom={2} 
            style={{ height: "100%", width: "100%" }}
            id="dashboard_map"
            >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {locations?.map((local: any, i: number) => (
                <Marker 
                    key={`${local.latitude}-${local.longitude}-${i}`}
                    position={[local.latitude, local.longitude]}
                >
                    <Popup>{local.city} ({local.count} players)</Popup>
                </Marker>
            ))}
            </MapContainer>
        </div>
    )
}

export default PlayersMap;