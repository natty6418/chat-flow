import React, { useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { AuthFlow } from './components/auth/AuthFlow';
import { ChatApp } from './components/chat/ChatApp';
import { LoadingSpinner } from './components/ui/LoadingSpinner';
import { setContext } from '@apollo/client/link/context';
import { ApolloClient, InMemoryCache, HttpLink, ApolloProvider } from '@apollo/client';
import awsConfig from './config/aws-config';


// --- Helper Components for Routing (No changes needed here) ---

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

// --- App Content and Routing (No changes needed here) ---

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
      uri: awsConfig.API.GraphQL.endpoint,
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

// --- NEW: Component to Create Apollo Client Reactively ---
// --- Main App Component (Updated Structure) ---

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