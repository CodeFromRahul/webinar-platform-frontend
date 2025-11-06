import { StreamClient } from '@stream-io/node-sdk';
import { SignJWT } from 'jose';

const API_KEY = process.env.NEXT_PUBLIC_GETSTREAM_API_KEY!;
const API_SECRET = process.env.GETSTREAM_API_SECRET!;

// Initialize Stream client
let client: StreamClient | null = null;

function getStreamClient(): StreamClient {
  if (!client) {
    if (!API_KEY || !API_SECRET) {
      throw new Error('GetStream credentials not configured. Please set NEXT_PUBLIC_GETSTREAM_API_KEY and GETSTREAM_API_SECRET in your .env file.');
    }
    
    // Correct initialization: StreamClient takes two separate parameters
    client = new StreamClient(API_KEY, API_SECRET);
  }
  return client;
}

export interface WebinarCreatePayload {
  id: string;
  title?: string;
  description?: string;
  created_by_user_id: string;
  starts_at?: string;
}

export interface WebinarResponse {
  call: {
    id: string;
    type: string;
    created_at: string;
    updated_at: string;
    created_by: {
      id: string;
      name?: string;
    };
  };
}

// Generate JWT token for user using jose library
export async function generateUserToken(userId: string, expiresIn: number = 3600): Promise<string> {
  try {
    if (!API_SECRET) {
      throw new Error('GETSTREAM_API_SECRET is not configured');
    }

    const secret = new TextEncoder().encode(API_SECRET);
    const issuedAt = Math.floor(Date.now() / 1000);
    const expirationTime = issuedAt + expiresIn;

    const token = await new SignJWT({
      user_id: userId,
      iss: 'https://getstream.io',
      sub: userId,
      aud: API_KEY,
    })
      .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
      .setIssuedAt(issuedAt)
      .setExpirationTime(expirationTime)
      .sign(secret);

    return token;
  } catch (error) {
    console.error('Failed to generate user token:', error);
    throw error;
  }
}

// Create webinar/livestream call using REST API
export async function createWebinar(
  payload: WebinarCreatePayload
): Promise<WebinarResponse> {
  try {
    const streamClient = getStreamClient();
    
    const callType = 'livestream';
    const callId = payload.id;

    // Create call using REST API
    const response = await streamClient.post(
      `/video/call/${callType}/${callId}`,
      {
        data: {
          created_by_id: payload.created_by_user_id,
          settings_override: {
            backstage: {
              enabled: true,
            },
            broadcasting: {
              enabled: true,
            },
          },
          custom: {
            title: payload.title || 'Untitled Webinar',
            description: payload.description || '',
          },
          starts_at: payload.starts_at,
        },
      }
    );

    return {
      call: {
        id: response.call.id,
        type: response.call.type,
        created_at: response.call.created_at,
        updated_at: response.call.updated_at,
        created_by: response.call.created_by,
      },
    };
  } catch (error: any) {
    // If call already exists, try to get it
    if (error?.code === 16 || error?.statusCode === 409) {
      console.log('Call already exists, fetching existing call...');
      return await getWebinar(payload.id);
    }
    console.error('Failed to create webinar:', error);
    throw error;
  }
}

// Get existing webinar call
export async function getWebinar(callId: string): Promise<WebinarResponse> {
  try {
    const streamClient = getStreamClient();
    const callType = 'livestream';

    const response = await streamClient.get(`/video/call/${callType}/${callId}`);

    return {
      call: {
        id: response.call.id,
        type: response.call.type,
        created_at: response.call.created_at,
        updated_at: response.call.updated_at,
        created_by: response.call.created_by,
      },
    };
  } catch (error) {
    console.error('Failed to get webinar:', error);
    throw error;
  }
}

// Start webinar (go live from backstage)
export async function startWebinar(
  callId: string,
  userId: string
): Promise<void> {
  try {
    const streamClient = getStreamClient();
    const callType = 'livestream';

    await streamClient.post(`/video/call/${callType}/${callId}/go_live`, {});
  } catch (error) {
    console.error('Failed to start webinar:', error);
    throw error;
  }
}

// Stop webinar
export async function stopWebinar(
  callId: string,
  userId: string
): Promise<void> {
  try {
    const streamClient = getStreamClient();
    const callType = 'livestream';

    await streamClient.post(`/video/call/${callType}/${callId}/stop_live`, {});
  } catch (error) {
    console.error('Failed to stop webinar:', error);
    throw error;
  }
}