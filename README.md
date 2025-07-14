# Real-Time Chat Application

A modern, real-time chat application built with React, TypeScript, and AWS services. This application features secure authentication, real-time messaging through WebSocket connections, and a beautiful, responsive user interface.

## 🚀 Features

- **Real-time Messaging**: Instant message delivery using AWS AppSync WebSocket subscriptions
- **Secure Authentication**: User authentication powered by AWS Cognito
- **Multiple Chat Rooms**: Create and join different chat rooms/workspaces
- **Responsive Design**: Beautiful UI that works seamlessly on desktop and mobile devices
- **Message History**: Persistent message storage with GraphQL queries
- **User Management**: Sign up, sign in, and user session management
- **Type Safety**: Built with TypeScript for enhanced developer experience

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS
- **State Management**: Apollo Client for GraphQL state management
- **Authentication**: AWS Cognito User Pools
- **Backend**: AWS AppSync (GraphQL API)
- **Database**: Amazon DynamoDB for persistent data storage
- **Real-time**: WebSocket connections via AWS AppSync subscriptions
- **Icons**: Lucide React
- **Routing**: React Router v6

## 📋 Prerequisites

Before running this application, make sure you have:

- Node.js (v18 or later)
- npm or yarn
- AWS Account with configured AppSync, Cognito, and DynamoDB services
- Environment variables configured (see setup section)

## 🔧 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/natty6418/chat-flow.git
   cd real_time_chat
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   
   Create a `.env` file in the root directory and configure the following environment variables:

   ```env
   # AWS Cognito Configuration
   VITE_AWS_USER_POOL_ID=your_user_pool_id
   VITE_AWS_USER_POOL_CLIENT_ID=your_client_id
   VITE_AWS_USER_POOL_CLIENT_SECRET=your_client_secret
   VITE_AWS_REGION=your_aws_region

   # AWS AppSync Configuration
   VITE_AWS_GRAPHQL_ENDPOINT=your_appsync_graphql_endpoint
   VITE_AWS_GRAPHQL_API_KEY=your_api_key
   VITE_AWS_REALTIME_ENDPOINT=your_appsync_realtime_endpoint
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:5173` to view the application.

## 🏗️ Project Structure

```
src/
├── components/
│   ├── auth/           # Authentication components
│   │   ├── AuthFlow.tsx
│   │   ├── AuthLayout.tsx
│   │   ├── SignInForm.tsx
│   │   └── SignUpForm.tsx
│   ├── chat/           # Chat-related components
│   │   ├── ChatApp.tsx
│   │   ├── ChatHeader.tsx
│   │   ├── ChatInterface.tsx
│   │   └── RoomSelection.tsx
│   └── ui/             # Reusable UI components
│       ├── Button.tsx
│       ├── Input.tsx
│       └── LoadingSpinner.tsx
├── config/
│   └── aws-config.ts   # AWS service configuration
├── graphql/
│   ├── mutations.ts    # GraphQL mutations
│   ├── queries.ts      # GraphQL queries
│   └── subscriptions.ts # GraphQL subscriptions
├── hooks/
│   └── useAuth.tsx     # Authentication hook
├── services/
│   ├── auth.ts         # Authentication service
│   └── graphql.ts      # GraphQL client setup
├── types/
│   ├── message.ts      # Message type definitions
│   └── room.ts         # Room type definitions
├── utils/
│   └── crypto.ts       # Utility functions
├── App.tsx             # Main app component
└── main.tsx           # Application entry point
```

## 🔐 Authentication Flow

1. **Sign Up**: New users can create accounts with username and password
2. **Email Verification**: Users receive confirmation codes via email
3. **Sign In**: Existing users authenticate with username/password
4. **Session Management**: JWT tokens are managed automatically
5. **Protected Routes**: Chat features require authentication

## 💬 Chat Features

### Room Management
- Browse available chat rooms
- Join different workspaces/rooms
- Real-time room switching

### Messaging
- Send and receive messages instantly
- Message history persistence with DynamoDB storage
- Real-time message synchronization across all connected clients
- Message timestamps and sender identification
- Scalable data storage with automatic scaling and backup

### Real-time Updates
- WebSocket connections for instant message delivery
- Automatic reconnection on connection loss
- Optimistic UI updates for better user experience

## 🔌 WebSocket Implementation

The application uses a custom WebSocket implementation for AWS AppSync:

- **Direct WebSocket Connection**: Custom WebSocket client bypassing Apollo's subscription limitations
- **Authentication**: Header-based authentication for secure connections
- **Protocol Compliance**: Follows GraphQL-WS protocol standards
- **Error Handling**: Comprehensive error handling and reconnection logic

## 🎨 UI/UX Features

- **Modern Design**: Clean, gradient-based design with Tailwind CSS
- **Responsive Layout**: Mobile-first design approach
- **Loading States**: Smooth loading indicators throughout the app
- **Message Bubbles**: Distinct styling for sent vs received messages
- **Smooth Animations**: CSS transitions for better user experience

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Environment Setup for Different Stages
- Create separate `.env.development`, `.env.staging`, and `.env.production` files
- Configure different AWS resources (AppSync, Cognito, DynamoDB) for each environment
- Ensure proper CORS settings in AppSync for your domain
- Set up DynamoDB tables with appropriate read/write capacity for each environment

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build locally

## 🔒 Security Considerations

- Environment variables are used for all sensitive configuration
- JWT tokens are stored securely and refreshed automatically
- WebSocket connections use authentication headers
- Input validation on both client and server sides

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request



## 🆘 Troubleshooting

### Common Issues

1. **WebSocket Connection Fails**
   - Verify your AppSync real-time endpoint URL
   - Check authentication token validity
   - Ensure proper CORS configuration in AppSync

2. **Authentication Errors**
   - Verify Cognito User Pool configuration
   - Check client ID and secret values
   - Ensure proper redirect URLs are configured

3. **Database Connection Issues**
   - Verify DynamoDB table configurations
   - Check IAM permissions for AppSync to access DynamoDB
   - Ensure proper table names and schema match your GraphQL schema

4. **Build Errors**
   - Verify all environment variables are set
   - Check TypeScript type definitions
   - Ensure all dependencies are installed

### Getting Help

- Check the browser console for error messages
- Verify AWS service configurations in the AWS Console
- Ensure all environment variables are properly set with `VITE_` prefix

## 🔗 Useful Links

- [AWS AppSync Documentation](https://docs.aws.amazon.com/appsync/)
- [AWS Cognito Documentation](https://docs.aws.amazon.com/cognito/)
- [Amazon DynamoDB Documentation](https://docs.aws.amazon.com/dynamodb/)
- [React Documentation](https://react.dev/)
- [Apollo Client Documentation](https://www.apollographql.com/docs/react/)
- [Vite Documentation](https://vitejs.dev/)
