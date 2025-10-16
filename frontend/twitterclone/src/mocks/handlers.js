import * as msw from 'msw';

// Extract `rest` from msw; use the runtime `ctx` parameter inside handlers
const { rest } = msw;

export const handlers = [
  // Allow static asset requests to fall through to the dev server
  // (serves /logo192.png from public/) to avoid intercepting binary responses.
  rest.get('/logo192.png', (req, res) => {
    return req.passthrough();
  }),
  // Allow external Google Identity script passthrough (avoid MSW warnings)
  rest.get('https://accounts.google.com/gsi/client', (req, res) => {
    return req.passthrough();
  }),

  // Mock user profile fetch so the UI can render when backend is offline.
  rest.get('http://localhost:8081/api/v1/user/otheruser/:id', (req, res, ctx) => {
    const { id } = req.params;
    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        user: {
          _id: id,
          name: 'Mock User',
          username: 'mockuser',
          avatar: '/logo192.png',
          bio: 'This is a mocked profile.'
        }
      })
    );
  }),

  // Mock following tweets endpoint
  rest.get('http://localhost:8081/api/v1/tweet/followingtweets/:id', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        tweets: [
          {
            _id: 'mocktweet1',
            user: {
              _id: 'u1',
              name: 'Mock User',
              username: 'mockuser',
              avatar: '/logo192.png'
            },
            description: 'This is a mocked tweet',
            image: null,
            likes: 0,
            createdAt: new Date().toISOString()
          }
        ]
      })
    );
  }),
  // allow the twitter logo asset to pass through to the dev server
  rest.get('/twitter-logo.png', (req, res) => {
    return req.passthrough();
  }),
  // Let login requests pass through to the real backend to avoid MSW response-shape issues
  rest.post('http://localhost:8081/api/v1/user/login', (req, res) => {
    return req.passthrough();
  }),
  // Let Google auth pass through
  rest.post('http://localhost:8081/api/v1/user/google', (req, res) => {
    return req.passthrough();
  }),
  rest.get('http://localhost:8081/api/v1/user/google/start', (req, res) => {
    return req.passthrough();
  }),
  rest.get('http://localhost:8081/api/v1/user/google/callback', (req, res) => {
    return req.passthrough();
  }),
  // Let avatar upload pass through to backend
  rest.post('http://localhost:8081/api/v1/user/avatar', (req, res) => {
    return req.passthrough();
  }),
  // Let banner upload pass through to backend
  rest.post('http://localhost:8081/api/v1/user/banner', (req, res) => {
    return req.passthrough();
  }),
  // Let bio update pass through
  rest.post('http://localhost:8081/api/v1/user/bio', (req, res) => {
    return req.passthrough();
  }),
  // Let location update pass through
  rest.post('http://localhost:8081/api/v1/user/location', (req, res) => {
    return req.passthrough();
  }),
  // Let create tweet requests go to the backend to avoid MSW response-shape issues
  rest.post('http://localhost:8081/api/v1/tweet/create', (req, res) => {
    return req.passthrough();
  }),
  rest.get('http://localhost:8081/api/v1/user/logout', async (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ message: 'Mock logged out' }));
  })
];
