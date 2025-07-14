import React, { useState } from 'react';
import { ChatHeader } from './ChatHeader';
import { RoomSelection } from './RoomSelection';
import { ChatInterface } from './ChatInterface';
import Room from '../../types/room';



export function ChatApp() {
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);

  const handleJoinRoom = (room: Room) => {
    setCurrentRoom(room);
  };

  const handleBackToRooms = () => {
    setCurrentRoom(null);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <ChatHeader />
      
      {currentRoom ? (
        <ChatInterface room={currentRoom} onBackToRooms={handleBackToRooms} />
      ) : (
        <RoomSelection onJoinRoom={handleJoinRoom} />
      )}
    </div>
  );
}