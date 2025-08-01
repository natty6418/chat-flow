import { useState, useEffect } from 'react';
import { AuthLayout } from './AuthLayout';
import { SignInForm } from './SignInForm';
import { SignUpForm } from './SignUpForm';
import { ConfirmationForm } from './ConfirmationForm';

type AuthMode = 'signin' | 'signup' | 'confirm';

export function AuthFlow() {
	const [mode, setMode] = useState<AuthMode>('signin');
	const [pendingEmail, setPendingEmail] = useState('');

	// Debug state changes
	useEffect(() => {
		console.log('AuthFlow state updated - mode:', mode, 'pendingEmail:', pendingEmail);
	}, [mode, pendingEmail]);

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

	const handleNeedConfirmation = (email: string) => {
		setPendingEmail(email);
		setMode('confirm');
	};

const handleSignUpSuccess = (email: string) => {
		console.log('AuthFlow: handleSignUpSuccess called with email:', email);
		console.log('Current mode before update:', mode);
		
		// Use functional updates to ensure we get the latest state
		setPendingEmail(() => {
			console.log('Setting pending email to:', email);
			return email;
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
		setPendingEmail('');
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
				console.log('Rendering ConfirmationForm with username:', pendingEmail);
				return (
					<ConfirmationForm
						email={pendingEmail}
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
