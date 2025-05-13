import { config } from 'dotenv';
config({ path: './.env' }); // Load .env from dist/

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { z } from 'zod';
import { AuthService } from './services/auth-service';
import { connectDB } from './services/db-service';
import { registerSchema, loginSchema, refreshSchema, logoutSchema } from './validation';

// Initialize services
const authService = new AuthService();

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    await connectDB();
    const { httpMethod, path, body, headers } = event;
    const parsedBody = body ? JSON.parse(body) : {};
    const accessToken = headers['Cookie']?.match(/token=([^;]+)/)?.[1] || parsedBody.accessToken;

    if (path === '/users/register' && httpMethod === 'POST') {
      const data = registerSchema.parse(parsedBody);
      const { accessToken, refreshToken } = await authService.register(data);
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Set-Cookie': `token=${accessToken}; HttpOnly; Max-Age=${15 * 60}; Secure=${
            process.env.NODE_ENV === 'production'
          }; Path=/`,
        },
        body: JSON.stringify({ accessToken, refreshToken }),
      };
    }

    if (path === '/users/login' && httpMethod === 'POST') {
      const data = loginSchema.parse(parsedBody);
      const { accessToken, refreshToken } = await authService.login(data);
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Set-Cookie': `token=${accessToken}; HttpOnly; Max-Age=${15 * 60}; Secure=${
            process.env.NODE_ENV === 'production'
          }; Path=/`,
        },
        body: JSON.stringify({ accessToken, refreshToken }),
      };
    }

    if (path === '/users/refresh' && httpMethod === 'POST') {
      const data = refreshSchema.parse(parsedBody);
      const accessToken = await authService.refresh(data.refreshToken);
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Set-Cookie': `token=${accessToken}; HttpOnly; Max-Age=${15 * 60}; Secure=${
            process.env.NODE_ENV === 'production'
          }; Path=/`,
        },
        body: JSON.stringify({ accessToken }),
      };
    }

    if (path === '/users/logout' && httpMethod === 'POST') {
      const data = logoutSchema.parse({ refreshToken: parsedBody.refreshToken, accessToken });
      await authService.logout(data.refreshToken, data.accessToken);
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Set-Cookie': 'token=; HttpOnly; Max-Age=0; Path=/',
        },
        body: JSON.stringify({ message: 'Logged out successfully' }),
      };
    }

    return {
      statusCode: 404,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Route not found' }),
    };
  } catch (err) {
    console.error('Error:', err);
    const statusCode = err instanceof z.ZodError ? 400 : 500;
    const message = err instanceof z.ZodError ? { errors: err.errors } : { message: 'Server error' };
    return {
      statusCode,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message),
    };
  }
};