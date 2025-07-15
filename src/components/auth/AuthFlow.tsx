import React, { useState, useEffect } from 'react';
import { AuthLayout } from './AuthLayout';
import { SignInForm } from './SignInForm';
import { SignUpForm } from './SignUpForm';
import { ConfirmationForm } from './ConfirmationForm';

type AuthMode = 'signin' | 'signup' | 'confirm';

export function AuthFlow() {
  const [mode, setMode] = useState<AuthMode>('signin');
  const [pendingUsername, setPendingUsername] = useState('');

  // Debug state changes
  useEffect(() => {
    console.log('AuthFlow state updated - mode:', mode, 'pendingUsername:', pendingUsername);
  }, [mode, pendingUsername]);

  const getLayoutProps = () => {
    switch (mode) {
      case 'signin':
        return {
          title: 'Welcome Back',
          subtitle: 'Sign in to continue your conversations'
        };
      case 'signup':
        return {
          title: 'Join ChatFlow',
          subtitle: 'Create your account to get started'
        };
      case 'confirm':
        return {
          title: 'Verify Account',
          subtitle: 'Check your email for the confirmation code'
        };
    }
  };

  const handleNeedConfirmation = (username: string) => {
    setPendingUsername(username);
    setMode('confirm');
  };

  const handleSignUpSuccess = (username: string) => {
    console.log('AuthFlow: handleSignUpSuccess called with username:', username);
    console.log('Current mode before update:', mode);
    
    // Use functional updates to ensure we get the latest state
    setPendingUsername(() => {
      console.log('Setting pending username to:', username);
      return username;
    });
    
    setMode((currentMode) => {
      console.log('Changing mode from:', currentMode, 'to: confirm');
      return 'confirm';
    });
    
    console.log('State update functions called');
  };

  const handleConfirmationSuccess = () => {
    alert('Account confirmed successfully! You can now sign in.');
    setMode('signin');
    setPendingUsername('');
  };

  const renderForm = () => {
    console.log('Rendering form for mode:', mode);
    switch (mode) {
      case 'signin':
        return (
          <SignInForm
            onSwitchToSignUp={() => setMode('signup')}
            onNeedConfirmation={handleNeedConfirmation}
          />
        );
      case 'signup':
        return (
          <SignUpForm
            onSwitchToSignIn={() => setMode('signin')}
            onSuccess={handleSignUpSuccess}
          />
        );
      case 'confirm':
        console.log('Rendering ConfirmationForm with username:', pendingUsername);
        return (
          <ConfirmationForm
            username={pendingUsername}
            onSuccess={handleConfirmationSuccess}
            onBackToSignIn={() => setMode('signin')}
          />
        );
    }
  };

  return (
    <AuthLayout {...getLayoutProps()}>
      {renderForm()}
    </AuthLayout>
  );
}
