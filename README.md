# ChatFlow ⚡

> A modern, real-time collaborative messaging platform built with React, TypeScript, and AWS services.

![ChatFlow](https://img.shields.io/badge/ChatFlow-v2.0-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-18+-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178C6?style=for-the-badge&logo=typescript)
![AWS](https://img.shields.io/badge/AWS-Cloud-FF9900?style=for-the-badge&logo=amazon-aws)

[Visit the live demo](https://chat-flow-eta.vercel.app/)

## ✨ Features

### 🚀 **Real-Time Messaging**
- Instant message delivery with WebSocket connections
- Live typing indicators and message status
- Optimistic UI updates for seamless experience

### 🔐 **Secure Authentication**
- AWS Cognito integration with email verification
- JWT token management with automatic refresh
- Protected routes and session persistence

### 🏢 **Workspace Management**
- Create public/private chat rooms
- Join rooms by ID or invitation
- Real-time member management and status

### 🎨 **Modern Interface**
- Beautiful gradient-based design system
- Responsive mobile-first layout
- Smooth animations and micro-interactions
- Dark/light theme support (coming soon)

### ⚡ **Performance & Reliability**
- Real-time data synchronization
- Offline message queuing
- Auto-reconnection on network issues
- Optimized bundle size with code splitting

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Frontend** | React 18, TypeScript, Vite |
| **Styling** | Tailwind CSS, Lucide Icons |
| **State Management** | Apollo Client (GraphQL) |
| **Authentication** | AWS Cognito User Pools |
| **Backend** | AWS AppSync (GraphQL API) |
| **Database** | Amazon DynamoDB |
| **Real-time** | WebSocket via AppSync |
| **Build Tool** | Vite with ESLint |

## � Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn
- AWS Account with AppSync, Cognito, and DynamoDB configured

### Installation

1. **Clone the repository**
	```bash
	git clone https://github.com/natty6418/chat-flow.git
	cd real_time_chat
	```

2. **Install dependencies**
	```bash
	npm install
	```

3. **Configure environment**
	```bash
	# Copy example env file
	cp .env.example .env

	# Edit .env with your AWS configuration
	nano .env
	```

4. **Start development server**
	```bash
	npm run dev
	```

5. **Open your browser**
	```
	http://localhost:5173
	```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the project root:

```env
# AWS Cognito
VITE_AWS_USER_POOL_ID=your_user_pool_id
VITE_AWS_USER_POOL_CLIENT_ID=your_client_id
VITE_AWS_REGION=us-east-1

# AWS AppSync
VITE_AWS_GRAPHQL_ENDPOINT=your_appsync_endpoint
VITE_AWS_GRAPHQL_API_KEY=your_api_key
VITE_AWS_REALTIME_ENDPOINT=your_realtime_endpoint
```

### AWS Services Setup

1. **Cognito User Pool** - Handle user authentication
2. **AppSync GraphQL API** - Manage data operations
3. **DynamoDB Tables** - Store messages and room data
4. **IAM Roles** - Configure proper permissions

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── auth/           # Authentication flows
│   ├── chat/           # Chat interface & rooms
│   └── ui/             # Reusable UI components
├── hooks/              # Custom React hooks
├── services/           # API & external services
├── types/              # TypeScript definitions
├── graphql/            # GraphQL operations
└── utils/              # Helper functions
```

## 🎯 Key Features Walkthrough

### Authentication Flow
1. **Sign Up** → Email verification → **Sign In** → Protected chat access
2. JWT tokens managed automatically with refresh logic
3. Secure route protection with loading states

### Chat Experience
1. **Room Selection** → Browse or create workspaces
2. **Real-time Messaging** → Instant delivery with WebSocket
3. **Member Management** → See who's online and active

### UI/UX Highlights
- **Gradient-based design** with modern aesthetics
- **Responsive layout** that works on all devices
- **Smooth animations** for better user experience
- **Loading states** and error handling throughout

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Preview Build
```bash
npm run preview
```

### Deploy to AWS
- Use AWS Amplify for automatic CI/CD
- Configure environment variables in Amplify Console
- Set up custom domain and SSL certificates

## � Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run type-check` | Run TypeScript checks |

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📧 **Email**: support@chatflow.dev
- 🐛 **Issues**: [GitHub Issues](https://github.com/natty6418/chat-flow/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/natty6418/chat-flow/discussions)

## 🙏 Acknowledgments

- Built with [React](https://react.dev/) and [TypeScript](https://www.typescriptlang.org/)
- Powered by [AWS Services](https://aws.amazon.com/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons by [Lucide](https://lucide.dev/)

---

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


## 🔗 Useful Links

- [AWS AppSync Documentation](https://docs.aws.amazon.com/appsync/)
- [AWS Cognito Documentation](https://docs.aws.amazon.com/cognito/)
- [Amazon DynamoDB Documentation](https://docs.aws.amazon.com/dynamodb/)
- [React Documentation](https://react.dev/)
- [Apollo Client Documentation](https://www.apollographql.com/docs/react/)
- [Vite Documentation](https://vitejs.dev/)
