import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useAuth } from '../../hooks/useAuth';

interface SignInFormProps {
  onSwitchToSignUp: () => void;
  onNeedConfirmation: (username: string) => void;
}

export function SignInForm({ onSwitchToSignUp, onNeedConfirmation }: SignInFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn, loading, error, clearError } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!email.trim() || !password) {
      return;
    }

    try {
      await signIn(email.trim(), password);
    } catch (error: unknown) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        (error as { code: string }).code === 'UserNotConfirmedException'
      ) {
        onNeedConfirmation(email.trim());
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        type="email"
        label="Email Address"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={error && !password ? error : undefined}
        required
      />

      <Input
        type="password"
        label="Password"
        placeholder="Enter your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={error && password ? error : undefined}
        required
      />

      {error && (
        <div className="text-red-600 text-sm font-medium text-center">
          {error}
        </div>
      )}

      <Button
        type="submit"
        loading={loading}
        className="w-full"
        size="lg"
      >
        Sign In
      </Button>

      <div className="text-center text-sm text-gray-600">
        Don't have an account?{' '}
        <button
          type="button"
          onClick={onSwitchToSignUp}
          className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors"
        >
          Sign Up
        </button>
      </div>
    </form>
  );
}