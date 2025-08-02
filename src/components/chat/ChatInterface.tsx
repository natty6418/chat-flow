import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Send, Hash, Users, Copy, Check, X  } from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { LoadingSpinner } from "../ui/LoadingSpinner";
import { useAuth } from "../../hooks/useAuth";
import Room from "../../types/room";
import Message from "../../types/message";
import { useQuery, useMutation, gql } from "@apollo/client";
import { UserDetail } from '../../services/api';

// import { print } from "graphql";
import * as queries from "../../graphql/queries";
import * as mutations from "../../graphql/mutations";
import * as subscriptions from "../../graphql/subscriptions";
import { print } from "graphql";

const awsmobile = {
    "aws_project_region": import.meta.env.VITE_AWS_PROJECT_REGION,
    "aws_cognito_region": import.meta.env.VITE_AWS_COGNITO_REGION,
    "aws_user_pools_id": import.meta.env.VITE_AWS_USER_POOLS_ID,
    "aws_user_pools_web_client_id": import.meta.env.VITE_AWS_USER_POOLS_WEB_CLIENT_ID,
    "aws_appsync_graphqlEndpoint": import.meta.env.VITE_AWS_APPSYNC_GRAPHQL_ENDPOINT,
    "aws_appsync_region": import.meta.env.VITE_AWS_APPSYNC_REGION,
    "aws_appsync_authenticationType": import.meta.env.VITE_AWS_APPSYNC_AUTHENTICATION_TYPE,
    "aws_appsync_realtimeEndpoint": import.meta.env.VITE_AWS_APPSYNC_REALTIME_ENDPOINT,
};

// Component to display room members in a WhatsApp-style slide-out panel
function ChatMembersPanel({ roomId, isOpen, onClose }: { roomId: string; isOpen: boolean; onClose: () => void }) {
  const { loading, error, data } = useQuery(gql(queries.getRoomMembersDetails), {
    variables: { roomId },
  });

  const memberDetails: UserDetail[] = data?.getRoomMembersDetails || [];

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
        onClick={onClose}
      />
      
      {/* Slide-out panel */}
      <div className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold">Room Info</h3>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Room details */}
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Hash className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-lg">{roomId}</h4>
              <p className="text-blue-100 text-sm">{memberDetails.length} members</p>
            </div>
          </div>
        </div>

        {/* Members List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <LoadingSpinner size="sm" />
                <span className="text-sm text-gray-500 block mt-2">Loading members...</span>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-12 px-6">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-red-400" />
              </div>
              <p className="text-red-500 text-sm font-medium">Error loading members</p>
              <p className="text-xs text-gray-500 mt-1">{error.message}</p>
            </div>
          ) : memberDetails.length === 0 ? (
            <div className="text-center py-12 px-6">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-gray-300" />
              </div>
              <p className="text-gray-500 text-sm">No members found</p>
            </div>
          ) : (
            <div className="p-6">
              <div className="mb-6">
                <h5 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-4">
                  Members ({memberDetails.length})
                </h5>
              </div>
              
              <div className="space-y-1">
                {memberDetails.map((member, index) => (
                  <div key={member.userId} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="relative">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-sm font-medium">
                          {(member.preferredUsername || member.userId).charAt(0).toUpperCase()}
                        </span>
                      </div>
                      {/* Online indicator */}
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {member.preferredUsername || 'Anonymous User'}
                        </p>
                        {index === 0 && (
                          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full font-medium">
                            Admin
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 truncate">
                        {member.preferredUsername ? `@${member.userId}` : member.userId}
                      </p>
                    </div>
                    
                    <div className="text-xs text-gray-400">
                      Online
                    </div>
                  </div>
                ))}
              </div>
              
              
            </div>
          )}
        </div>
      </div>
    </>
  );
}

interface ChatInterfaceProps {
	room: Room;
	onBackToRooms: () => void;
}

export function ChatInterface({ room, onBackToRooms }: ChatInterfaceProps) {
	const [messages, setMessages] = useState<Message[]>([]);
	const [newMessage, setNewMessage] = useState("");
	const [loading, setLoading] = useState(true);
	const [sending, setSending] = useState(false);
	const [copied, setCopied] = useState(false);
	const [showMembersPanel, setShowMembersPanel] = useState(false);
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const socketRef = useRef<WebSocket | null>(null);
	const { user, idToken } = useAuth();
	const navigate = useNavigate();

	// Handle navigation if room or user is missing
	useEffect(() => {
		if (!room || !user) {
			navigate("/", { replace: true });
		}
	}, [room, user, navigate]);

	// Query for room members to get preferred usernames
	const { data: membersData } = useQuery(gql(queries.getRoomMembersDetails), {
		variables: { roomId: room?.id },
		skip: !room,
	});

	// Move these hook declarations up BEFORE any useEffect that references them
  const { loading: queryLoading, data: queryData } = useQuery<{
	messagesByRoomIdAndCreatedAt: { items: Message[] };
  }>(gql(queries.messagesByRoomIdAndCreatedAt), {
	variables: { roomId: room?.id, sortDirection: 'ASC' },
	skip: !room,
  });

	const [
		createMessageMutation,
		{ loading: createMessageLoading, error: createMessageError },
	] = useMutation(gql(mutations.createMessage), {
		// We will provide variables when calling the mutation
		onCompleted: () => {
			// const message: Message = {
			//   id: Date.now().toString(),
			//   body: newMessage.trim(),
			//   from: user.username,
			//   createdAt: new Date().toISOString(),
			//   roomId: room.id,
			// };
			// setMessages((prev) => [...prev, message]);
			setNewMessage("");
			setSending(false);
		},
		onError: (error) => {
			console.error("Error sending message:", error);
			setSending(false);
		},
	});

	// Replace useSubscription with direct WebSocket connection
	useEffect(() => {
		if (!room || !idToken) return;
		const setupWebSocket = async () => {
			try {
				// Close existing socket if any
				if (
					socketRef.current &&
					(socketRef.current.readyState === WebSocket.OPEN ||
						socketRef.current.readyState === WebSocket.CONNECTING)
				) {
					socketRef.current.close();
				}

				const HTTP_DOMAIN = new URL(awsmobile.aws_appsync_graphqlEndpoint).host;
				const REALTIME_DOMAIN = new URL(
					awsmobile.aws_appsync_realtimeEndpoint
				).host;

				// Create auth object with token or API key
				const authorization = { Authorization: `${idToken}`, host: HTTP_DOMAIN }

				// const authorization = {
				//   'x-api-key': awsConfig.API.GraphQL.apiKey,
				//   host: REALTIME_DOMAIN,
				// }

				// Get auth protocol
				const getAuthProtocol = () => {
					const header = btoa(JSON.stringify(authorization))
						.replace(/\+/g, "-")
						.replace(/\//g, "_")
						.replace(/=+$/, "");
					return `header-${header}`;
				};

				// Create subscription message
				const subscriptionMessage = {
					query: print(gql(subscriptions.onCreateMessage)),
					variables: { filter: { roomId: { eq: room.id } } },
				};

				// Connect to WebSocket
				socketRef.current = await new Promise((resolve, reject) => {
					// ...existing code...
					const socket = new WebSocket(`wss://${REALTIME_DOMAIN}/graphql`, [
						"graphql-ws",
						getAuthProtocol(),
					]);

					socket.onopen = () => {
						// ...existing code...
						// Send connection init message
						socket.send(
							JSON.stringify({ type: "connection_init", payload: {} })
						);
						resolve(socket);
					};

					socket.onclose = (event) => {
						console.error("WebSocket closed:", event.reason);
						reject(new Error(event.reason));
					};

					socket.onerror = (error) => {
						console.error("WebSocket error:", error);
						reject(error);
					};

					socket.onmessage = (event) => {
						const data = JSON.parse(event.data);
						if (data.type === "error") {
							data.payload.errors.forEach((err: unknown) => {
								if (err instanceof Error) {
									console.error("WebSocket error:", err.message);
								} else {
									console.error("WebSocket error:", JSON.stringify(err));
								}
							 
							});
						}

						// Handle connection_ack
						if (data.type === "connection_ack") {
							// ...existing code...
							// After connection is acknowledged, send subscription
							// socket.send(JSON.stringify({
							//   id: `sub-${room.id}`,
							//   type: 'subscribe',
							//   payload: subscriptionMessage
							// }));
							const opId = `sub-${room.id}`; // or uuid(), etc.

						 
							socket.send(JSON.stringify({
								id: opId,
								type: 'start',
								payload: {
									data: JSON.stringify(subscriptionMessage),
									extensions: {
										authorization: {
											...authorization,

										}}
								}
							}));
						}

						// ...existing code...

						// Handle subscription data

						if (
							data.type === "data" &&
							data.payload?.data?.onCreateMessage
						) {
							const newMessage = data.payload.data.onCreateMessage;

							// Only add message if it's not from current user or is new
							setMessages((prev) => {
								// Check if message already exists
								if (!prev.some((msg) => msg.id === newMessage.id)) {
									return [...prev, newMessage];
								}
								return prev;
							});
						}
					};
				});
			} catch (error) {
				console.error("Error setting up WebSocket:", error);
			}
		};

		setupWebSocket();

		// Cleanup WebSocket on component unmount
		return () => {
			if (socketRef.current) {
				// ...existing code...
				socketRef.current.close();
			}
		};
	}, [room, idToken]);

	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	useEffect(() => {
		if (createMessageError) {
			console.error("Error sending message:", createMessageError);
			setSending(false);
		}
		if (createMessageLoading) {
			setSending(true);
		}
	}, [createMessageLoading, createMessageError]);

  useEffect(() => {
	setLoading(queryLoading);
	if (queryData && queryData.messagesByRoomIdAndCreatedAt?.items) {
	  setMessages(queryData.messagesByRoomIdAndCreatedAt.items);
	  setLoading(false);
	} else if (!queryLoading) {
	  setMessages([]);
	  setLoading(false);
	}
  }, [queryLoading, queryData]);

	const sendMessage = async () => {
		if (!newMessage.trim() || !user || !room) return;

		setSending(true);
		createMessageMutation({
		variables: {
			
				roomId: room.id,
				body: newMessage.trim(),
			},
	});
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			sendMessage();
		}
	};

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	const formatTime = (timestamp: string) => {
		return new Date(timestamp).toLocaleTimeString([], {
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	const isOwnMessage = (message: Message) => {
		return user && message.owner === user.username;
	};

	// Helper function to get display name for a user
	const getDisplayName = (userId: string) => {
		const memberDetails: UserDetail[] = membersData?.getRoomMembersDetails || [];
		const member = memberDetails.find(m => m.userId === userId);
		
		if (member?.preferredUsername) {
			return member.preferredUsername;
		} else {
			return userId;
		}
	};

	// Function to copy room ID to clipboard
	const copyRoomId = async () => {
		try {
			await navigator.clipboard.writeText(room.id);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
		} catch (err) {
			console.error('Failed to copy room ID:', err);
		}
	};

	// Render null if we are redirecting
	if (!room || !user) {
		return null;
	}

	return (
		<div className="flex-1 flex flex-col w-full max-w-4xl mx-auto relative px-4 md:px-6 lg:px-8">
			{/* Main Chat Area */}
			<div className="flex-1 flex flex-col bg-white rounded-t-2xl md:rounded-2xl shadow-lg overflow-hidden">
				{/* Chat Header */}
				<div className="border-b border-gray-200 p-6 shadow-sm">
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-4">
							<Button
								variant="ghost"
								size="sm"
								onClick={onBackToRooms}
								className="md:hidden hover:bg-gray-100"
							>
								<ArrowLeft className="w-4 h-4" />
							</Button>
							<div className="flex flex-col items-start space-y-2">
								<div className="flex items-center space-x-3">
									<div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
										<Hash className="w-6 h-6 text-white" />
									</div>
									<div>
										<h2 className="text-2xl font-bold text-gray-900">{room.name}</h2>
										<div className="flex items-center space-x-2 mt-1">
											<div className="flex items-center space-x-1">
												<div className="w-2 h-2 bg-green-400 rounded-full"></div>
												<span className="text-sm text-green-600 font-medium">Active</span>
											</div>
											<span className="text-gray-300">•</span>
											<button 
												onClick={() => setShowMembersPanel(true)}
												className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors"
											>
												{membersData?.getRoomMembersDetails?.length || 0} members
											</button>
										</div>
									</div>
								</div>
								<div className="flex items-center space-x-3">
									<button
										onClick={copyRoomId}
										className="flex items-center space-x-2 text-xs text-gray-400 hover:text-gray-600 transition-colors bg-gray-50 hover:bg-gray-100 px-3 py-2 rounded-lg"
										title="Copy room ID"
									>
										{copied ? (
											<>
												<Check className="w-3 h-3" />
												<span className="font-medium">Copied!</span>
											</>
										) : (
											<>
												<Copy className="w-3 h-3" />
												<span className="font-mono">{room.id}</span>
											</>
										)}
									</button>
								</div>
							</div>
						</div>
						<div className="flex items-center space-x-2">
							{/* Members button for desktop */}
							<Button
								variant="ghost"
								size="sm"
								onClick={() => setShowMembersPanel(true)}
								className="hidden md:flex hover:bg-gray-100"
								title="View members"
							>
								<Users className="w-4 h-4 mr-2" />
								Members
							</Button>
							<Button
								variant="ghost"
								size="sm"
								onClick={onBackToRooms}
								className="hidden md:flex hover:bg-gray-100"
							>
								<ArrowLeft className="w-4 h-4 mr-2" />
								Back to Rooms
							</Button>
						</div>
					</div>
				</div>

				{/* Messages Area */}
				<div className="flex-1 overflow-y-auto p-8 space-y-6 bg-gradient-to-br from-gray-50 to-blue-50/30 relative">
					{/* Background pattern */}
					<div className="absolute inset-0 opacity-5">
						<div className="absolute top-10 left-10 w-20 h-20 bg-blue-500 rounded-full"></div>
						<div className="absolute top-32 right-16 w-16 h-16 bg-purple-500 rounded-full"></div>
						<div className="absolute bottom-20 left-20 w-24 h-24 bg-indigo-500 rounded-full"></div>
						<div className="absolute bottom-40 right-10 w-12 h-12 bg-pink-500 rounded-full"></div>
					</div>
					
					<div className="relative z-10">
						{loading ? (
							<div className="flex items-center justify-center h-full min-h-96">
								<div className="text-center">
									<div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
										<div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full"></div>
									</div>
									<p className="text-gray-600 text-lg font-medium">Loading conversation...</p>
									<p className="text-gray-500 text-sm mt-2">Please wait while we fetch your messages</p>
								</div>
							</div>
						) : messages.length === 0 ? (
							<div className="flex items-center justify-center h-full min-h-96">
								<div className="text-center max-w-md mx-auto">
									<div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
										<Hash className="w-12 h-12 text-blue-500" />
									</div>
									<h3 className="text-2xl font-bold text-gray-900 mb-3">
										Welcome to {room.name}! 🎉
									</h3>
									<p className="text-gray-600 text-lg mb-6">
										This is the beginning of your conversation. Start chatting with your team!
									</p>
									<div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
										<p className="text-sm text-gray-500 mb-4">💡 <strong>Tip:</strong> You can:</p>
										<ul className="text-sm text-gray-600 space-y-2 text-left">
											<li>• Send messages instantly</li>
											<li>• Share ideas and collaborate</li>
											<li>• Invite more team members</li>
										</ul>
									</div>
								</div>
							</div>
						) : (
						<>
							{messages.map((message) => (
								<div
									key={message.id}
									className={`flex ${
										isOwnMessage(message) ? "justify-end" : "justify-start"
									} mb-6`}
								>
									<div className={`flex items-end space-x-3 max-w-xs lg:max-w-md ${
										isOwnMessage(message) ? "flex-row-reverse space-x-reverse" : ""
									}`}>
										{/* Avatar */}
										<div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0 ${
											isOwnMessage(message) 
												? "bg-gradient-to-r from-blue-500 to-purple-600" 
												: "bg-gradient-to-r from-green-500 to-teal-600"
										}`}>
											{isOwnMessage(message) 
												? "You".charAt(0)
												: getDisplayName(message.owner).charAt(0).toUpperCase()
											}
										</div>
										
										{/* Message bubble */}
										<div
											className={`px-6 py-4 rounded-3xl shadow-sm relative ${
												isOwnMessage(message)
													? "bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-br-lg"
													: "bg-white text-gray-900 border border-gray-200 rounded-bl-lg"
											}`}
										>
											{/* Sender name */}
											<div className={`text-xs font-semibold mb-2 ${
												isOwnMessage(message) ? "text-blue-100" : "text-gray-500"
											}`}>
												{isOwnMessage(message) ? "You" : getDisplayName(message.owner)}
											</div>
											
											{/* Message content */}
											<div className="text-sm leading-relaxed mb-2">{message.body}</div>
											
											{/* Timestamp */}
											<div
												className={`text-xs ${
													isOwnMessage(message) ? "text-blue-200" : "text-gray-400"
												}`}
											>
												{formatTime(message.createdAt)}
											</div>
											
											{/* Message tail */}
											<div className={`absolute bottom-0 ${
												isOwnMessage(message) 
													? "right-0 translate-x-1 border-l-8 border-l-purple-600 border-t-8 border-t-transparent" 
													: "left-0 -translate-x-1 border-r-8 border-r-white border-t-8 border-t-transparent"
											}`}></div>
										</div>
									</div>
								</div>
							))}
							<div ref={messagesEndRef} />
							</>
						)}
					</div>
				</div>

				{/* Message Input */}
				<div className="border-t border-gray-200 p-6">
					<div className="flex items-end space-x-4">
						<div className="flex-1 relative">
							<Input
								placeholder="Type your message..."
								value={newMessage}
								onChange={(e) => setNewMessage(e.target.value)}
								onKeyPress={handleKeyPress}
								className="border-2 border-gray-200 focus:border-blue-500 rounded-2xl pr-12 py-4 text-base resize-none"
							/>
							{/* Character count or status indicator */}
							<div className="absolute right-3 top-1/2 -translate-y-1/2">
								{newMessage.length > 0 && (
									<div className="text-xs text-gray-400">
										{newMessage.length}
									</div>
								)}
							</div>
						</div>
						<Button
							onClick={sendMessage}
							loading={sending}
							disabled={!newMessage.trim()}
							className="px-6 py-4 rounded-2xl shadow-lg hover:shadow-xl"
							size="lg"
						>
							<Send className="w-5 h-5" />
						</Button>
					</div>
					{/* Typing indicator area */}
					<div className="mt-2 h-4">
						{sending && (
							<div className="flex items-center text-sm text-gray-500">
								<div className="flex space-x-1 mr-2">
									<div className="w-1 h-1 bg-gray-400 rounded-full animate-pulse"></div>
									<div className="w-1 h-1 bg-gray-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
									<div className="w-1 h-1 bg-gray-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
								</div>
								Sending...
							</div>
						)}
					</div>
				</div>
			</div>

			{/* WhatsApp-style Members Panel */}
			<ChatMembersPanel 
				roomId={room.id} 
				isOpen={showMembersPanel} 
				onClose={() => setShowMembersPanel(false)} 
			/>
		</div>
	);
}
