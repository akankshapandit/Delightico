import express from 'express';
import axios from 'axios';

const router = express.Router();

// Store Instagram access tokens (in production, use database)
const userTokens = new Map();

// Step 1: Redirect to Instagram authorization
router.get('/auth', (req, res) => {
  const { userId } = req.query;
  
  const instagramAuthUrl = `https://api.instagram.com/oauth/authorize?client_id=${process.env.INSTAGRAM_APP_ID}&redirect_uri=${process.env.INSTAGRAM_REDIRECT_URI}&scope=user_profile,user_media&response_type=code&state=${userId}`;
  
  res.redirect(instagramAuthUrl);
});

// Step 2: Handle Instagram callback and get access token
router.get('/auth/callback', async (req, res) => {
  try {
    const { code, state } = req.query;
    const userId = state;

    // Exchange code for access token
    const tokenResponse = await axios.post('https://api.instagram.com/oauth/access_token', 
      new URLSearchParams({
        client_id: process.env.INSTAGRAM_APP_ID,
        client_secret: process.env.INSTAGRAM_APP_SECRET,
        grant_type: 'authorization_code',
        redirect_uri: process.env.INSTAGRAM_REDIRECT_URI,
        code: code
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    const { access_token, user_id } = tokenResponse.data;

    // Store the access token
    userTokens.set(userId, {
      accessToken: access_token,
      instagramUserId: user_id
    });

    res.redirect(`${process.env.FRONTEND_URL}/admin/ai?instagram_connected=true`);
    
  } catch (error) {
    console.error('Instagram auth error:', error.response?.data || error.message);
    res.redirect(`${process.env.FRONTEND_URL}/admin/ai?instagram_error=true`);
  }
});

// Step 3: Post to Instagram
router.post('/post', async (req, res) => {
  try {
    const { userId, caption, imageUrl } = req.body;

    // Get user's access token
    const userToken = userTokens.get(userId);
    if (!userToken) {
      return res.status(400).json({ 
        success: false, 
        error: 'Instagram not connected. Please connect your Instagram account first.' 
      });
    }

    // Step 3.1: Create media container
    const createMediaResponse = await axios.post(
      `https://graph.instagram.com/me/media`,
      {
        image_url: imageUrl,
        caption: caption,
        access_token: userToken.accessToken
      }
    );

    const creationId = createMediaResponse.data.id;

    // Step 3.2: Publish the media
    const publishResponse = await axios.post(
      `https://graph.instagram.com/me/media_publish`,
      {
        creation_id: creationId,
        access_token: userToken.accessToken
      }
    );

    res.json({
      success: true,
      message: 'Post published to Instagram successfully!',
      postId: publishResponse.data.id
    });

  } catch (error) {
    console.error('Instagram post error:', error.response?.data || error.message);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to post to Instagram. Please try again.' 
    });
  }
});

// Check if user has connected Instagram
router.get('/status/:userId', (req, res) => {
  const { userId } = req.params;
  const userToken = userTokens.get(userId);
  
  res.json({
    connected: !!userToken,
    instagramUserId: userToken?.instagramUserId
  });
});

// Disconnect Instagram
router.delete('/disconnect/:userId', (req, res) => {
  const { userId } = req.params;
  userTokens.delete(userId);
  
  res.json({ success: true, message: 'Instagram disconnected successfully' });
});

export default router;