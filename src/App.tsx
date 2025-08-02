import React, { useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { AuthFlow } from './components/auth/AuthFlow';
import { ChatApp } from './components/chat/ChatApp';
import { LoadingSpinner } from './components/ui/LoadingSpinner';
import { setContext } from '@apollo/client/link/context';
import { ApolloClient, InMemoryCache, HttpLink, ApolloProvider } from '@apollo/client';



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


function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <LoadingSpinner size="lg" />
      </div>
    );
  }
  return user ? <>{children}</> : <Navigate to="/auth" replace />;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <LoadingSpinner size="lg" />
      </div>
    );
  }
  return user ? <Navigate to="/chat" replace /> : <>{children}</>;
}


function AppContent() {
  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<PublicRoute><AuthFlow /></PublicRoute>} />
        <Route path="/chat" element={<ProtectedRoute><ChatApp /></ProtectedRoute>} />
        <Route path="/" element={<Navigate to="/chat" replace />} />
      </Routes>
    </Router>
  );
}

function ApolloClientProvider({ children }: { children: React.ReactNode }) {
  const { idToken } = useAuth();

  const client = useMemo(() => {
    const httpLink = new HttpLink({
      uri: awsmobile.aws_appsync_graphqlEndpoint,
    });

    const authLink = setContext((_, { headers }) => ({
      headers: {
        ...headers,
        ...(idToken && { Authorization: `Bearer ${idToken}` }),
      }
    }));

    const httpAuthLink = authLink.concat(httpLink);
    return new ApolloClient({
      link: httpAuthLink,
      cache: new InMemoryCache()
    });
  }, [idToken]);

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}



function App() {
  return (
    <AuthProvider>
      <ApolloClientProvider>
        <AppContent />
      </ApolloClientProvider>
    </AuthProvider>
  );
}

export default App;