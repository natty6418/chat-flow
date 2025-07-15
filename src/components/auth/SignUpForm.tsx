import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useAuth } from '../../hooks/useAuth';
import { validatePassword, validateUsername } from '../../utils/crypto';

interface SignUpFormProps {
  onSwitchToSignIn: () => void;
  onSuccess: (username: string) => void;
}

export function SignUpForm({ onSwitchToSignIn, onSuccess }: SignUpFormProps) {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { signUp, actionLoading, error, clearError } = useAuth();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    }

    if (!username.trim()) {
      newErrors.username = 'Username is required';
    } else {
      const usernameError = validateUsername(username);
      if (usernameError) {
        newErrors.username = usernameError;
      }
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else {
      const passwordErrors = validatePassword(password);
      if (passwordErrors.length > 0) {
        newErrors.password = passwordErrors[0];
      }
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!validateForm()) {
      return;
    }

    try {
      console.log('Starting signup process...');
      await signUp(email.trim(), password, username.trim());
      console.log('Signup successful, calling onSuccess...');
      onSuccess(username.trim());
    } catch (error) {
      console.error('Signup error:', error);
      // Error handled by useAuth
    }
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase().replace(/[^a-z]/g, '');
    setUsername(value);
    
    if (errors.username) {
      const usernameError = validateUsername(value);
      if (!usernameError) {
        setErrors(prev => ({ ...prev, username: '' }));
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
        error={errors.email}
        required
      />

      <Input
        type="text"
        label="Username"
        placeholder="Choose a username (lowercase letters only)"
        value={username}
        onChange={handleUsernameChange}
        error={errors.username}
        helperText="Only lowercase letters (a-z), minimum 2 characters"
        required
      />

      <Input
        type="password"
        label="Password"
        placeholder="Create a strong password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={errors.password}
        helperText="At least 8 characters with uppercase, lowercase, number, and special character"
        required
      />

      <Input
        type="password"
        label="Confirm Password"
        placeholder="Confirm your password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        error={errors.confirmPassword}
        required
      />

      {error && (
        <div className="text-red-600 text-sm font-medium text-center">
          {error}
        </div>
      )}

      <Button
        type="submit"
        loading={actionLoading}
        className="w-full"
        size="lg"
      >
        Create Account
      </Button>

      <div className="text-center text-sm text-gray-600">
        Already have an account?{' '}
        <button
          type="button"
          onClick={onSwitchToSignIn}
          className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors"
        >
          Sign In
        </button>
      </div>
    </form>
  );
}