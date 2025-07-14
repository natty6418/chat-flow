import React, { useState } from 'react';
import { AuthLayout } from './AuthLayout';
import { SignInForm } from './SignInForm';
import { SignUpForm } from './SignUpForm';
import { ConfirmationForm } from './ConfirmationForm';

type AuthMode = 'signin' | 'signup' | 'confirm';

export function AuthFlow() {
  const [mode, setMode] = useState<AuthMode>('signin');
  const [pendingUsername, setPendingUsername] = useState('');

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
    setPendingUsername(username);
    setMode('confirm');
  };

  const handleConfirmationSuccess = () => {
    alert('Account confirmed successfully! You can now sign in.');
    setMode('signin');
    setPendingUsername('');
  };

  const renderForm = () => {
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
