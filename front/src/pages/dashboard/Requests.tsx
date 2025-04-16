import React from 'react'

import { useSocket } from '../../utils/SocketContext';


const Requests: React.FC = () => {
    const socket = useSocket();
    const [requests, setRequests] = React.useState<any>(null);

    React.useEffect(() => {
        socket?.on("requests", (data: any) => {
            setRequests((prev: any) => {
                if (!prev) return [data];
    
                const updated = [...prev, data];
                if (updated.length > 60) {
                    updated.shift();
                }
                return updated;
            });
        });

        return () => {
            socket?.off("requests");
        }
    }, [socket]);

    return (
        <div id="requests_box">
            {   
                requests &&
                requests?.map((request: any, index: number) => {
                    return (
                        <div key={index} className="request_message_box">
                            <div className="request_type">
                                {request.type}
                            </div>

                            <div className="request_message">
                                {request.text}
                            </div>
                        </div>
                    )
                }) 
            }
        </div>
    )
}

export default Requests;