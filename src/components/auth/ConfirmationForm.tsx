import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useAuth } from '../../hooks/useAuth';

interface ConfirmationFormProps {
  email: string;
  onSuccess: () => void;
  onBackToSignIn: () => void;
}

export function ConfirmationForm({ email, onSuccess, onBackToSignIn }: ConfirmationFormProps) {
  const [confirmationCode, setConfirmationCode] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const { confirmSignUp, resendCode, loading, error, clearError } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!confirmationCode.trim()) {
      return;
    }

    try {
      await confirmSignUp(email, confirmationCode.trim());
      onSuccess();
    } catch (error) {
      console.log('Confirmation error:', error);
    }
  };

  const handleResendCode = async () => {
    try {
      setResendLoading(true);
      setResendSuccess(false);
      clearError();
      await resendCode(email);
      setResendSuccess(true);
      setTimeout(() => setResendSuccess(false), 3000);
    } catch (error: unknown) {
      console.log('Resend code error:', error);
      if (error instanceof Error) {
        console.error('Error resending code:', error.message);
      } else {
        console.error('An unknown error occurred while resending the code');
      }
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-6">
        <p className="text-gray-600 mb-2">
          We've sent a confirmation code to the email address for:
        </p>
        <p className="font-semibold text-gray-800">{email}</p>
      </div>

      <Input
        type="text"
        label="Confirmation Code"
        placeholder="Enter the 6-digit code"
        value={confirmationCode}
        onChange={(e) => setConfirmationCode(e.target.value)}
        error={error || undefined}
        maxLength={6}
        required
      />

      {resendSuccess && (
        <div className="text-green-600 text-sm font-medium text-center">
          Confirmation code resent successfully!
        </div>
      )}

      <Button
        type="submit"
        loading={loading}
        className="w-full"
        size="lg"
      >
        Confirm Account
      </Button>

      <div className="flex flex-col items-center space-y-3">
        <Button
          type="button"
          variant="outline"
          onClick={handleResendCode}
          loading={resendLoading}
          className="w-full"
        >
          Resend Code
        </Button>

        <button
          type="button"
          onClick={onBackToSignIn}
          className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors text-sm"
        >
          Back to Sign In
        </button>
      </div>
    </form>
  );
}