import { Card, Grid } from '@mantine/core';
import React, { useState, useEffect } from 'react';
import Clock from 'react-clock'; // Install this with `npm install react-clock`
import 'react-clock/dist/Clock.css'; // Import default Clock CSS

function AnalogClock() {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
       
           
                <div
                    style={{
                        position: "relative",
                        
                        
                        background: "radial-gradient(circle at center, #f5f7fa, #dce3ec)",
                        borderRadius: "50%",
                        boxShadow:
                            "inset 5px 5px 10px rgba(0, 0, 0, 0.1), inset -5px -5px 10px rgba(255, 255, 255, 0.7), 8px 8px 16px rgba(0, 0, 0, 0.2)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Clock
                        value={currentTime}
                        renderNumbers={true}
                        size={180}
                        hourHandWidth={6}
                        minuteHandWidth={4}
                        secondHandWidth={2}
                        className="custom-clock"
                    />
                    <div
                        style={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            width: "16px",
                            height: "16px",
                            background: "linear-gradient(145deg, #e0e5ec, #ffffff)",
                            borderRadius: "50%",
                            boxShadow:
                                "2px 2px 4px rgba(0, 0, 0, 0.2), -2px -2px 4px rgba(255, 255, 255, 0.7)",
                            transform: "translate(-50%, -50%)",
                            zIndex: 10,
                        }}
                    />
                </div>
           
       
    );
}

export default AnalogClock;
