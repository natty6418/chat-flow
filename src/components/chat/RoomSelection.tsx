import React, { useState, useEffect } from 'react';
import { Plus, Hash, Calendar } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import Room from '../../types/room';
import { useQuery, useMutation } from '@apollo/client';
import { queries } from '../../services/graphql'
import { mutations } from '../../services/graphql'


interface RoomSelectionProps {
  onJoinRoom: (room: Room) => void;
}

export function RoomSelection({ onJoinRoom }: RoomSelectionProps) {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState<string[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [createLoading, setCreateLoading] = useState(false);

  const { loading: queryLoading, error: queryError, data: queryData } = useQuery<{ listRooms: Room[] }>(queries.listRooms);
  const [createRoomMutation, { loading: createRoomLoading, error: createRoomError, data: createRoomData }] = useMutation(mutations.createRoom);

  useEffect(() => {
    setIsLoading(queryLoading);
    setErrors([]);
    if (queryError) {
      setIsLoading(false);
      setErrors([queryError.message]);
    } else if (queryData && queryData.listRooms) {
      setRooms(queryData.listRooms);
      setIsLoading(false);
    }
  }, [queryLoading, queryError, queryData])

  useEffect(() => {
    setCreateLoading(createRoomLoading);
    if (createRoomError) {
      setCreateLoading(false);
      setErrors(prev => [...prev, createRoomError.message]);
    } else if (createRoomData && createRoomData.createRoom) {
      console.log('New room created:', createRoomData.createRoom);
      const newRoom = createRoomData.createRoom;
      setRooms(prev => [...prev, newRoom]);
      setNewRoomName('');
      setShowCreateModal(false);
      setCreateLoading(false);
      onJoinRoom(newRoom);
    }
  }, [createRoomData, createRoomError, createRoomLoading]);



  const createRoom = async () => {
    if (!newRoomName.trim()) return;

    setCreateLoading(true);
    createRoomMutation({
      variables: { name: newRoomName.trim() }
    })


  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      createRoom();
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mb-4" />
          <p className="text-gray-600">Loading workspaces...</p>
        </div>
      </div>
    );
  }

  if (errors.length > 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-red-600 mb-2">Error loading workspaces</h3>
          <p className="text-gray-600">{errors.join(', ')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Choose Your Workspace</h2>
            <p className="text-gray-600">Select a workspace to start collaborating with your team</p>
          </div>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Create Workspace
          </Button>
        </div>

        {rooms.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Hash className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No workspaces yet</h3>
            <p className="text-gray-600 mb-6">Create your first workspace to get started!</p>
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="w-5 h-5" />
              Create Your First Workspace
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {rooms.map((room) => (
              <div
                key={room.id}
                onClick={() => onJoinRoom(room)}
                className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 cursor-pointer group transform hover:-translate-y-1"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <Hash className="w-6 h-6 text-white" />
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 text-sm">→</span>
                    </div>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{room.name}</h3>
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="w-4 h-4 mr-2" />
                  Created {new Date(room.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create Room Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Create New Workspace</h3>

              <Input
                label="Workspace Name"
                placeholder="Enter workspace name"
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
                onKeyPress={handleKeyPress}
                maxLength={50}
                autoFocus
              />

              <div className="flex space-x-3 mt-6">
                <Button
                  variant="secondary"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={createRoom}
                  loading={createLoading}
                  className="flex-1"
                >
                  Create Workspace
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
