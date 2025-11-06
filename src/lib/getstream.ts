import { StreamClient } from '@stream-io/node-sdk';

const API_KEY = process.env.NEXT_PUBLIC_GETSTREAM_API_KEY!;
const API_SECRET = process.env.GETSTREAM_API_SECRET!;

// Initialize Stream client
let client: StreamClient | null = null;

function getStreamClient(): StreamClient {
  if (!client) {
    if (!API_KEY || !API_SECRET) {
      throw new Error('GetStream credentials not configured. Please set NEXT_PUBLIC_GETSTREAM_API_KEY and GETSTREAM_API_SECRET in your .env file.');
    }
    
    // Correct initialization with object containing apiKey and secret
    client = new StreamClient({
      apiKey: API_KEY,
      secret: API_SECRET,
    });
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
    backstage: {
      enabled: boolean;
    };
  };
}

// Generate JWT token for user
export function generateUserToken(userId: string, expiresIn?: number): string {
  try {
    const streamClient = getStreamClient();
    
    // If expiresIn is provided, use it (in seconds)
    if (expiresIn) {
      const expiresAt = Math.floor(Date.now() / 1000) + expiresIn;
      return streamClient.createToken(userId, expiresAt);
    }
    
    // Otherwise, create token without expiration
    return streamClient.createToken(userId);
  } catch (error) {
    console.error('Failed to generate user token:', error);
    throw error;
  }
}

// Create webinar/livestream call
export async function createWebinar(
  payload: WebinarCreatePayload
): Promise<WebinarResponse> {
  try {
    const streamClient = getStreamClient();
    
    // Create a livestream call using correct API
    const call = streamClient.video.call('livestream', payload.id);
    
    await call.getOrCreate({
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
    });

    // Get the call details
    const callResponse = await call.get();

    return {
      call: {
        id: callResponse.call.id,
        type: callResponse.call.type,
        created_at: callResponse.call.created_at,
        updated_at: callResponse.call.updated_at,
        created_by: callResponse.call.created_by,
        backstage: callResponse.call.settings.backstage,
      },
    };
  } catch (error) {
    console.error('Failed to create webinar:', error);
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
    const call = streamClient.video.call('livestream', callId);

    // Go live
    await call.goLive();
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
    const call = streamClient.video.call('livestream', callId);

    // Stop live
    await call.stopLive();
  } catch (error) {
    console.error('Failed to stop webinar:', error);
    throw error;
  }
}