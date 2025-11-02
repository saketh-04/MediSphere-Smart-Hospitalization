import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const Map = ({ center, markers = [], zoom = 14 }) => {
    const mapStyles = {
        height: '400px',
        width: '100%',
    };

    return (
        <LoadScript googleMapsApiKey="AIzaSyAQvdLkf783wLcKSwuEww">
            <GoogleMap
                mapContainerStyle={mapStyles}
                zoom={zoom}
                center={center}
            >
                {markers.map((marker, index) => (
                    <Marker
                        key={index}
                        position={marker.position}
                        title={marker.title}
                    />
                ))}
            </GoogleMap>
        </LoadScript>
    );
};

export default Map;
