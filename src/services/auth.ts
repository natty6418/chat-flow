import AWS from 'aws-sdk';
import { awsConfig } from '../config/aws-config';
import { generateSecretHash } from '../utils/crypto';

// Configure AWS
AWS.config.update({ region: awsConfig.Auth.Cognito.region });

// Initialize Cognito Identity Service Provider
const cognito = new AWS.CognitoIdentityServiceProvider();

export interface User {
  username: string;
  email: string;
  attributes: Record<string, string>;
}

export interface AuthResult {
  accessToken: string;
  idToken: string;
  refreshToken: string;
  user: User;
}

class AuthService {
  async signIn(email: string, password: string): Promise<AuthResult> {
    const signInParams: AWS.CognitoIdentityServiceProvider.InitiateAuthRequest = {
      ClientId: awsConfig.Auth.Cognito.userPoolClientId,
      AuthFlow: 'USER_PASSWORD_AUTH',
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password
      }
    };

    // Add secret hash if client secret is configured
    if (awsConfig.Auth.Cognito.userPoolClientSecret) {
      signInParams.AuthParameters!.SECRET_HASH = await generateSecretHash(
        email, awsConfig.Auth.Cognito.userPoolClientId,
        awsConfig.Auth.Cognito.userPoolClientSecret
      );
    }
    console.log(signInParams);
    const result = await cognito.initiateAuth(signInParams).promise();
    console.log(result);
    if (!result.AuthenticationResult) {
      throw new Error('Authentication failed');
    }

    // Get user details
    const user = await this.getCurrentUser(result.AuthenticationResult.AccessToken!);

    // Store tokens
    localStorage.setItem('accessToken', result.AuthenticationResult.AccessToken!);
    localStorage.setItem('idToken', result.AuthenticationResult.IdToken!);
    localStorage.setItem('refreshToken', result.AuthenticationResult.RefreshToken!);

    return {
      accessToken: result.AuthenticationResult.AccessToken!,
      idToken: result.AuthenticationResult.IdToken!,
      refreshToken: result.AuthenticationResult.RefreshToken!,
      user
    };
  }

  async signUp(email: string, password: string, username?: string): Promise<void> {
    const actualUsername = username || email;

    const signUpOptions: AWS.CognitoIdentityServiceProvider.SignUpRequest = {
      ClientId: awsConfig.Auth.Cognito.userPoolClientId,
      Username: actualUsername,
      Password: password,
      UserAttributes: [
        { Name: 'email', Value: email },
      ]
    };

    if (awsConfig.Auth.Cognito.userPoolClientSecret) {
      signUpOptions.SecretHash = await generateSecretHash(
        actualUsername, awsConfig.Auth.Cognito.userPoolClientId,
        awsConfig.Auth.Cognito.userPoolClientSecret
      );
    }

    await cognito.signUp(signUpOptions).promise();
  }

  async confirmSignUp(username: string, confirmationCode: string): Promise<void> {
    const confirmParams: AWS.CognitoIdentityServiceProvider.ConfirmSignUpRequest = {
      ClientId: awsConfig.Auth.Cognito.userPoolClientId,
      Username: username,
      ConfirmationCode: confirmationCode
    };

    if (awsConfig.Auth.Cognito.userPoolClientSecret) {
      confirmParams.SecretHash = await generateSecretHash(
        username, awsConfig.Auth.Cognito.userPoolClientId,
        awsConfig.Auth.Cognito.userPoolClientSecret
      );
    }

    await cognito.confirmSignUp(confirmParams).promise();
  }

  async resendConfirmationCode(username: string): Promise<void> {
    const resendParams: AWS.CognitoIdentityServiceProvider.ResendConfirmationCodeRequest = {
      ClientId: awsConfig.Auth.Cognito.userPoolClientId,
      Username: username
    };

    if (awsConfig.Auth.Cognito.userPoolClientSecret) {
      resendParams.SecretHash = await generateSecretHash(
        username, awsConfig.Auth.Cognito.userPoolClientId,
        awsConfig.Auth.Cognito.userPoolClientSecret
      );
    }

    await cognito.resendConfirmationCode(resendParams).promise();
  }

  async getCurrentUser(accessToken?: string): Promise<User> {
    const token = accessToken || localStorage.getItem('accessToken');
    if (!token) {
      throw new Error('No access token found');
    }

    const getUserParams: AWS.CognitoIdentityServiceProvider.GetUserRequest = {
      AccessToken: token,
    };

    const userResult = await cognito.getUser(getUserParams).promise();

    const attributes = userResult.UserAttributes?.reduce((acc, attr) => {
      acc[attr.Name!] = attr.Value!;
      return acc;
    }, {} as Record<string, string>) || {};

    return {
      username: userResult.Username!,
      email: attributes.email || '',
      attributes,
    };
  }

  async signOut(): Promise<void> {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('idToken');
    localStorage.removeItem('refreshToken');
  }

  isAuthenticated(): string | null {
    const accessToken = localStorage.getItem('accessToken');
    const idToken = localStorage.getItem('idToken');
    if (idToken && accessToken) {
      return idToken;
    }
    return null;
  }
}

export const authService = new AuthService();
