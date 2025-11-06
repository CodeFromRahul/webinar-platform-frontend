import crypto from 'crypto';

const API_KEY = process.env.NEXT_PUBLIC_GETSTREAM_API_KEY!;
const API_SECRET = process.env.GETSTREAM_API_SECRET!;
const API_URL = 'https://video.stream-io-api.com/api/v1';

export interface WebinarCreatePayload {
  call_type: 'livestream';
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
    created_by_user_id: string;
    backstage: boolean;
  };
}

// Generate JWT token for client (user-specific)
export function generateUserToken(userId: string, expiresIn: number = 3600): string {
  if (!API_SECRET) {
    throw new Error('GETSTREAM_API_SECRET is not configured');
  }

  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + expiresIn;

  const header = {
    alg: 'HS256',
    typ: 'JWT',
  };

  const payload = {
    user_id: userId,
    iss: 'stream',
    sub: `user/${userId}`,
    iat,
    exp,
  };

  const headerEncoded = Buffer.from(JSON.stringify(header)).toString('base64url');
  const payloadEncoded = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', API_SECRET)
    .update(`${headerEncoded}.${payloadEncoded}`)
    .digest('base64url');

  return `${headerEncoded}.${payloadEncoded}.${signature}`;
}

// Create webinar server-side
export async function createWebinar(
  payload: WebinarCreatePayload
): Promise<WebinarResponse> {
  if (!API_KEY || !API_SECRET) {
    throw new Error('GetStream credentials not configured');
  }

  const url = `${API_URL}/calls/${payload.call_type}/${payload.id}`;
  
  // Generate server-side auth token
  const token = generateUserToken(payload.created_by_user_id);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Stream-Auth-Type': 'jwt',
      },
      body: JSON.stringify({
        data: {
          created_by: {
            id: payload.created_by_user_id,
            name: `User ${payload.created_by_user_id}`,
          },
          members: [
            {
              user_id: payload.created_by_user_id,
              role: 'host',
            }
          ],
          custom: {
            title: payload.title,
            description: payload.description,
          },
          starts_at: payload.starts_at,
          settings_override: {
            backstage: {
              enabled: true,
            },
          },
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`GetStream API error: ${response.statusText} - ${errorText}`);
    }

    return response.json();
  } catch (error) {
    console.error('Failed to create webinar:', error);
    throw error;
  }
}

// Start webinar (go live from backstage)
export async function startWebinar(
  callType: string,
  callId: string,
  userId: string
): Promise<void> {
  if (!API_KEY || !API_SECRET) {
    throw new Error('GetStream credentials not configured');
  }

  const url = `${API_URL}/calls/${callType}/${callId}/go_live`;
  const token = generateUserToken(userId);

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'Stream-Auth-Type': 'jwt',
    },
    body: JSON.stringify({}),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to start webinar: ${response.statusText} - ${errorText}`);
  }
}
