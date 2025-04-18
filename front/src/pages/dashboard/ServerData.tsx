import React from 'react'
import { useState, useEffect } from 'react'
import './../../css/initialpages/dashboard/serverdata.css'

const ServerData: React.FC = () => {
    const [activeRooms, setActiveRooms] = useState<String>("0");
    const [activePlayers, setActivePlayers] =  useState<String>("0");
    const [connectedSockets, setConnectedSockets] =  useState<String>("0");
    const [playersMeanPerRoom, setPlayersMeanPerRoom] = useState<String>("0");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const backendUrl = import.meta.env.VITE_BACKEND_URL;
                const response = await fetch(`${backendUrl}/dashboard/server-data`);

                const data = await response.json();
                setActiveRooms(data.activeRoomCount);
                setActivePlayers(data.activePlayerCount);
                setConnectedSockets(data.connectedWebSocketClientCount);
                setPlayersMeanPerRoom(data.averageClients);
            } catch (error) {
                console.error('Error fetching server data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className='server_data_box'>
            <div className="box_item">
                <div className="info_number">{activeRooms}</div>
                <div className="info_text">Active rooms</div>
            </div>
            <div className="box_item">
                <div className="info_number">{activePlayers}</div>
                <div className="info_text">Active players</div>
            </div>
            <div className="box_item">
                <div className="info_number">{connectedSockets}</div>
                <div className="info_text">Connected sockets</div>
            </div>
            <div className="box_item">
                <div className="info_number">{playersMeanPerRoom}</div>
                <div className="info_text">Players mean per room</div>
            </div>
        </div>
    )
}

export default ServerData;