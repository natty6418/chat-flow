import React, { useState } from 'react';
import { useQuery,  useMutation, gql } from '@apollo/client';

import { Plus, Link, Hash, Calendar, Lock, Globe, Sparkles, Users, MessageSquare, Trash2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { Room } from '../../services/api';
import * as queries from '../../graphql/queries';
import * as mutations from '../../graphql/mutations';

// New modal for joining public rooms by ID
function JoinRoomByIdModal({ onJoinRoom, onClose }: { onJoinRoom: (room: Room) => void; onClose: () => void }) {
  const [roomId, setRoomId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [joinRoomMutation, { loading }] = useMutation(gql(mutations.joinRoom), {
    onCompleted: (data) => {
      const updatedRoom = data.joinRoom;
      if (updatedRoom) {
        onJoinRoom(updatedRoom);
        onClose();
      } else {
        setErrorMessage("Failed to join the room. It may not exist or is not public.");
      }
    },
    onError: (error) => {
      console.error("Error joining room:", error);
      setErrorMessage(error.message);
    },
  });

  const handleJoin = () => {
    if (!roomId.trim()) {
      setErrorMessage("Please enter a Room ID.");
      return;
    }
    setErrorMessage('');
    joinRoomMutation({
      variables: {
        roomId: roomId.trim(),
      },
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Join Public Rooms</h3>
        <Input
          label="Room ID"
          placeholder="Enter the public room ID"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleJoin()}
          autoFocus
        />
        {errorMessage && <p className="text-red-500 text-sm mt-2">{errorMessage}</p>}
        <div className="flex space-x-3 mt-6">
          <Button variant="secondary" onClick={onClose} className="flex-1" disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleJoin} loading={loading} className="flex-1">
            Join Room
          </Button>
        </div>
      </div>
    </div>
  );
}

interface RoomSelectionProps {
  onJoinRoom: (room: Room) => void;
}

export function RoomSelection({ onJoinRoom }: RoomSelectionProps) {
  // --- State for UI interactions ---
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinByIdModal, setShowJoinByIdModal] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomType, setNewRoomType] = useState<'public' | 'private'>('public');

  const { loading: queryLoading, error: queryError, data: queryData } = useQuery(gql(queries.listRooms));
  
  // Add query for user room count to check the 5-room limit
  const GET_USER_ROOM_COUNT = gql`
    query GetUserRoomCount {
      getUserRoomCount
    }
  `;
  
  const { data: roomCountData, refetch: refetchRoomCount } = useQuery(GET_USER_ROOM_COUNT);
  const userRoomCount = roomCountData?.getUserRoomCount || 0;
  const maxRooms = 5;
  const canCreateRoom = userRoomCount < maxRooms;
  
  const [createRoomMutation, { loading: createRoomLoading, error: createRoomError }] = useMutation(gql(mutations.createRoom), {
    onCompleted: (data) => {
      const newRoom = data.createRoom;
      setNewRoomName('');
      setShowCreateModal(false);
      // Refetch room count after creating a room
      refetchRoomCount();
      onJoinRoom(newRoom);
    },
    update: (cache, { data: { createRoom } }) => {
      const existingData = cache.readQuery<{ listRooms?: { items: Room[] } }>({ query: gql(queries.listRooms) }) || { listRooms: { items: [] } };
      const items = existingData.listRooms?.items ?? [];
      if (createRoom) {
        cache.writeQuery({
          query: gql(queries.listRooms),
          data: {
            listRooms: {
              ...existingData.listRooms,
              items: [...items, createRoom],
            },
          },
        });
      }
    },
    onError: (error) => {
      console.error('Error creating room:', error);
    }
  });

  // Add delete room mutation
  const [deleteRoomMutation, { loading: deleteRoomLoading }] = useMutation(gql(mutations.deleteRoom), {
    onCompleted: () => {
      // Refetch room count after deleting a room
      refetchRoomCount();
    },
    update: (cache, { data: { deleteRoom } }) => {
      if (deleteRoom) {
        const existingData = cache.readQuery<{ listRooms?: { items: Room[] } }>({ query: gql(queries.listRooms) }) || { listRooms: { items: [] } };
        const items = existingData.listRooms?.items ?? [];
        const updatedItems = items.filter((room: Room) => room.id !== deleteRoom.id);
        
        cache.writeQuery({
          query: gql(queries.listRooms),
          data: {
            listRooms: {
              ...existingData.listRooms,
              items: updatedItems,
            },
          },
        });
      }
    },
    onError: (error) => {
      console.error('Error deleting room:', error);
      alert('Failed to delete room: ' + error.message);
    }
  });

  const createRoom = () => {
    if (!newRoomName.trim()) return;
    if (!canCreateRoom) {
      alert(`You've reached the maximum of ${maxRooms} rooms. Please delete an existing room before creating a new one.`);
      return;
    }
    createRoomMutation({
      variables: { name: newRoomName.trim(), roomType: newRoomType },
    });
  };

  const deleteRoom = (roomId: string, roomName: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent triggering the room join
    
    if (confirm(`Are you sure you want to delete "${roomName}"? This action cannot be undone.`)) {
      deleteRoomMutation({
        variables: {
            id: roomId 
        },
      });
    }
  };



  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      createRoom();
    }
  };

  if (queryLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mb-4" />
          <p className="text-gray-600">Loading rooms...</p>
        </div>
      </div>
    );
  }

  if (queryError) {
    return (
      <div className="flex-1 flex items-center justify-center text-center p-4">
        <div>
          <h3 className="text-xl font-semibold text-red-600 mb-2">Error loading rooms</h3>
          <p className="text-gray-600 bg-red-50 p-3 rounded-md">{queryError.message}</p>
        </div>
      </div>
    );
  }

  const rooms = queryData?.listRooms?.items || [];

  return (
    <div className="flex-1 bg-gradient-to-br from-gray-50 to-blue-50/30 min-h-screen">
      <div className="max-w-6xl mx-auto p-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl mb-6 shadow-lg">
            <MessageSquare className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Choose Your Workspace
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Select a room you own or are a member of, or create a new workspace to collaborate with your team.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4 mb-12">
          <Button
            variant="outline"
            size="lg"
            onClick={() => setShowJoinByIdModal(true)}
            className="bg-white/80 backdrop-blur-sm border-2 border-blue-200 hover:border-blue-300 shadow-lg"
          >
            <Link className="w-5 h-5 mr-2" />
            Join by ID
          </Button>
          <Button
            size="lg"
            onClick={() => setShowCreateModal(true)}
            disabled={!canCreateRoom}
            className={`shadow-xl hover:shadow-2xl ${!canCreateRoom ? 'opacity-50 cursor-not-allowed' : ''}`}
            title={!canCreateRoom ? `You've reached the maximum of ${maxRooms} rooms` : ''}
          >
            <Plus className="w-5 h-5 mr-2" />
            {canCreateRoom ? 'Create New Room' : `Max Rooms Reached (${userRoomCount}/${maxRooms})`}
          </Button>
        </div>

        {rooms.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Sparkles className="w-12 h-12 text-blue-500" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">Ready to get started?</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto text-lg">
              Create your first room or join an existing one to start collaborating with your team.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Plus className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Create Room</h4>
                <p className="text-gray-600 text-sm">Start a new workspace for your team</p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Join Team</h4>
                <p className="text-gray-600 text-sm">Connect with existing workspaces</p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Start Chatting</h4>
                <p className="text-gray-600 text-sm">Begin real-time conversations</p>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Your Workspaces</h3>
              <p className="text-gray-600">Select a room to continue your conversations</p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {rooms.map((room: Room) => (
                <div
                  key={room.id}
                  onClick={() => onJoinRoom(room)}
                  className="bg-white rounded-3xl p-8 border-2 border-gray-100 hover:border-blue-300 hover:shadow-2xl transition-all duration-300 cursor-pointer group transform hover:-translate-y-2 relative overflow-hidden"
                >
                  {/* Background decoration */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-50 to-purple-50 rounded-full -translate-y-1/2 translate-x-1/2 transition-transform group-hover:scale-110"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <Hash className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        {/* Delete button - only show for room owners */}
                        <button
                          onClick={(e) => deleteRoom(room.id, room.name, e)}
                          disabled={deleteRoomLoading}
                          className="w-8 h-8 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center shadow-lg transition-colors"
                          title="Delete room"
                        >
                          <Trash2 className="w-4 h-4 text-white" />
                        </button>
                        {/* Join button */}
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                          <span className="text-white text-lg font-bold">→</span>
                        </div>
                      </div>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                      {room.name}
                    </h3>
                    
                    <div className="flex items-center justify-between mb-4">
                      <span className={`text-xs font-bold px-3 py-2 rounded-full flex items-center shadow-sm ${
                        room.roomType === 'public' 
                          ? 'bg-gradient-to-r from-green-400 to-green-500 text-white' 
                          : 'bg-gradient-to-r from-orange-400 to-orange-500 text-white'
                      }`}>
                        {room.roomType === 'public' ? (
                          <Globe className="w-3 h-3 mr-1" />
                        ) : (
                          <Lock className="w-3 h-3 mr-1" />
                        )}
                        {room.roomType.toUpperCase()}
                      </span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-2" />
                      Created {new Date(room.createdAt).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </div>
                    
                    <div className="mt-6 pt-4 border-t border-gray-100">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Click to join</span>
                        <div className="flex items-center space-x-1">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span className="text-green-600 font-medium">Active</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Join Room By ID Modal */}
        {showJoinByIdModal && (
          <JoinRoomByIdModal
            onJoinRoom={onJoinRoom}
            onClose={() => setShowJoinByIdModal(false)}
          />
        )}

        {/* Create Room Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl relative">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Create New Room</h3>
              
              {/* Room count indicator */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-blue-700 font-medium">Your Rooms</span>
                  <span className={`text-sm font-bold ${userRoomCount >= maxRooms ? 'text-red-600' : 'text-blue-600'}`}>
                    {userRoomCount}/{maxRooms}
                  </span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
                  <div 
                    className={`h-2 rounded-full ${userRoomCount >= maxRooms ? 'bg-red-500' : 'bg-blue-500'}`}
                    style={{ width: `${(userRoomCount / maxRooms) * 100}%` }}
                  ></div>
                </div>
                {userRoomCount >= maxRooms && (
                  <p className="text-xs text-red-600 mt-2">
                    You've reached the maximum number of rooms. Delete an existing room to create a new one.
                  </p>
                )}
              </div>

              <Input
                label="Room Name"
                placeholder="Enter room name"
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
                onKeyPress={handleKeyPress}
                maxLength={50}
                autoFocus
              />
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Room Type</label>
                <select
                  value={newRoomType}
                  onChange={e => setNewRoomType(e.target.value as 'public' | 'private')}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                </select>
              </div>
              
              {createRoomError && <p className="text-red-500 text-sm mt-2">{createRoomError.message}</p>}

              <div className="flex space-x-3 mt-6">
                <Button variant="secondary" onClick={() => setShowCreateModal(false)} className="flex-1">
                  Cancel
                </Button>
                <Button 
                  onClick={createRoom} 
                  loading={createRoomLoading} 
                  disabled={!canCreateRoom || !newRoomName.trim()}
                  className="flex-1"
                >
                  Create Room
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}