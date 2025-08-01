import { useState, useEffect, createContext, useContext, ReactNode } from 'react';

import { Amplify } from 'aws-amplify';
import awsExports from '../aws-exports';
import {signUp as SignUp, signIn as SignIn, confirmSignUp as ConfirmSignUp, resendSignUpCode, fetchAuthSession, getCurrentUser, signOut as SignOut, fetchUserAttributes} from '@aws-amplify/auth';

interface User {
	username: string;
	email: string;
	userId: string;
	preferredUsername?: string;
}

interface AuthContextType {
	user: User | null;
	loading: boolean; // For initial auth check
	actionLoading: boolean; // For sign-in/sign-up actions
	signIn: (email: string, password: string) => Promise<void>;
	signUp: (email: string, password: string, username?: string) => Promise<void>;
	confirmSignUp: (username: string, code: string) => Promise<void>;
	resendCode: (username: string) => Promise<void>;
	signOut: () => Promise<void>;
	error: string | null;
	clearError: () => void;
	idToken?: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true); // Initial auth check loading
	const [actionLoading, setActionLoading] = useState(false); // For UI actions
	const [error, setError] = useState<string | null>(null);
	const [idToken, setIdToken] = useState<string | null>(null);

 

	useEffect(() =>{
		Amplify.configure(awsExports);
		const checkUser = async () => {
			try {
				const session = await fetchAuthSession();
				if (session.tokens?.idToken) {
					const currentUser = await getCurrentUser();
					const userAttributes = await fetchUserAttributes();
					setUser({
						username: currentUser.username,
						email: userAttributes.email || '',
						userId: currentUser.userId,
						preferredUsername: userAttributes.preferred_username || '',
					});
					setIdToken(session.tokens?.idToken?.toString() || null);
					console.log('User is signed in:', currentUser);		
				}
			} catch (error) {
				console.error('Error fetching auth session:', error);
			} finally {
				setLoading(false);
			} 
		 setLoading(false);
		}
		checkUser();
	}, []);

	const signIn = async (username: string, password: string) => {
		try {
			setError(null);
			setActionLoading(true);
			const { isSignedIn } = await SignIn({username, password});
			if (!isSignedIn) {
				throw new Error('Sign-in failed');
			}
			const session = await fetchAuthSession();
			setIdToken(session.tokens?.idToken?.toString() || null);
			const currentUser = await getCurrentUser();
			const userAttributes = await fetchUserAttributes();
			setUser({
				username: currentUser.username,
				email: userAttributes.email || '',
				userId: currentUser.userId,
				preferredUsername: userAttributes.preferred_username || '',
			});
		 
		} catch (error: unknown) {
			if (error instanceof Error) {
				setError(error.message);
			} else {
				setError('An unknown sign-in error occurred');
			}
			throw error;
		} finally {
			setActionLoading(false);
		}
	};

	const signUp = async (email: string, password: string, username?: string) => {
		try {
			setError(null);
			setActionLoading(true);
			
			// Uncomment this line when you want to use real API again:
			const { nextStep } = await SignUp({
				username: email,
				password: password,
				options: {
					userAttributes: {
						email, 
						...(username ? { preferred_username: username } : {}),
				},
			},
		});

		console.log('Next step is:', nextStep.signUpStep);
		} catch (error: unknown) {
			if (error instanceof Error) {
				setError(error.message);
			} else {
				setError('An unknown sign-up error occurred');
			}
			throw error;
		} finally {
			setActionLoading(false);
		}
	};

	const confirmSignUp = async (email: string, code: string) => {
		try {
			setError(null);
			setActionLoading(true);
			
			// Accept any 6-digit code for testing
			if (code.length !== 6) {
				throw new Error('Please enter a 6-digit confirmation code');
			}
			
			// Uncomment this line when you want to use real API again:
			const { isSignUpComplete } = await ConfirmSignUp({
			username: email,
			confirmationCode: code,
		});

		if (isSignUpComplete) {
			console.log('Sign up complete! The user can now sign in.');
		}
		} catch (error: unknown) {
			if (error instanceof Error) {
				setError(error.message);
			} else {
				setError('An unknown confirmation error occurred');
			}
			throw error;
		} finally {
			setActionLoading(false);
		}
	};

	const resendCode = async (email: string) => {
		try {
			setError(null);
			setActionLoading(true);
			await resendSignUpCode({
			username: email,
		});
			console.log('Confirmation code resent successfully'); 
		} catch (error: unknown) {
			if (error instanceof Error) {
				setError(error.message);
			} else {
				setError('An unknown error occurred while resending the code');
			}
			throw error;
		}
	};

	const signOut = async () => {
		try {
			setActionLoading(true);
			await SignOut();
			console.log('User signed out successfully');
			setUser(null);
			setIdToken(null);
		} catch (error: unknown) {
			if (error instanceof Error) {
				setError(error.message);
			} else {
				setError('An unknown sign-out error occurred');
			}
		} finally {
			setActionLoading(false);
		}
	};

	const clearError = () => setError(null);

	const value = {
		user,
		loading,
		actionLoading,
		signIn,
		signUp,
		confirmSignUp,
		resendCode,
		signOut,
		error,
		clearError,
		idToken
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
}
