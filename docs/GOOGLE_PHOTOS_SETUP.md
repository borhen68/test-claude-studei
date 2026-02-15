# Google Photos Import Setup Guide

## Overview
The Google Photos Import feature allows users to import photos directly from their Google Photos library into Frametale books.

## Setup Instructions

### 1. Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing project
3. Name it "Frametale" (or your preferred name)

### 2. Enable Google Photos Library API

1. In the Cloud Console, go to **APIs & Services** → **Library**
2. Search for "Google Photos Library API"
3. Click **Enable**

### 3. Configure OAuth Consent Screen

1. Go to **APIs & Services** → **OAuth consent screen**
2. Select **External** user type
3. Fill in required fields:
   - App name: **Frametale**
   - User support email: your email
   - Developer contact email: your email
4. Add scopes:
   - `https://www.googleapis.com/auth/photoslibrary.readonly`
5. Add test users (for development)
6. Save and continue

### 4. Create OAuth 2.0 Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth client ID**
3. Application type: **Web application**
4. Name: **Frametale Web Client**
5. Authorized redirect URIs:
   - Development: `http://localhost:3000/api/import/google-photos/callback`
   - Production: `https://yourdomain.com/api/import/google-photos/callback`
6. Click **Create**
7. Save the **Client ID** and **Client Secret**

### 5. Set Environment Variables

Add to your `.env.local` file:

```env
# Google Photos Integration
GOOGLE_PHOTOS_CLIENT_ID=your_client_id_here
GOOGLE_PHOTOS_CLIENT_SECRET=your_client_secret_here
GOOGLE_PHOTOS_REDIRECT_URI=http://localhost:3000/api/import/google-photos/callback

# For production
# GOOGLE_PHOTOS_REDIRECT_URI=https://yourdomain.com/api/import/google-photos/callback
```

### 6. Test the Integration

1. Restart your development server
2. Navigate to the upload page
3. Click "Import from Google Photos"
4. Authorize the app
5. Select photos to import

## API Endpoints

### `/api/import/google-photos/auth` (GET)
Initiates OAuth flow

### `/api/import/google-photos/callback` (GET)
Handles OAuth callback

### `/api/import/google-photos/albums` (GET)
Fetches user's albums

### `/api/import/google-photos/import` (POST)
Imports photos from selected album

### `/api/import/google-photos/import-all` (POST)
Imports recent photos (max 200)

## Security Considerations

1. **Never commit credentials to git**
   - Add `.env.local` to `.gitignore`
   - Use environment variables in production

2. **Minimal scopes**
   - Only request `photoslibrary.readonly`
   - Don't ask for write permissions

3. **Token handling**
   - Access tokens are never stored server-side
   - Tokens are only sent to client via secure postMessage
   - Consider adding encryption for token transmission

4. **Rate limiting**
   - Implement rate limiting for import endpoints
   - Prevent abuse of API quota

## Rate Limits

Google Photos Library API limits:
- 10,000 requests per day (per project)
- 500 requests per 100 seconds per user

## Troubleshooting

### "Pop-up blocked" error
- Enable pop-ups for your site
- Or use same-window OAuth flow

### "Unauthorized" error
- Verify redirect URI matches exactly
- Check that OAuth credentials are correct
- Ensure Photos Library API is enabled

### "Quota exceeded" error
- Check Google Cloud Console for quota usage
- Request quota increase if needed

## Future Enhancements

1. **Batch imports** - Import multiple albums at once
2. **Smart selection** - AI-powered photo curation
3. **Direct printing** - Skip upload, import and print in one step
4. **Shared albums** - Import from albums shared with you
5. **Favorites filtering** - Only import starred/favorited photos

## Resources

- [Google Photos Library API Documentation](https://developers.google.com/photos/library/guides/get-started)
- [OAuth 2.0 Guide](https://developers.google.com/identity/protocols/oauth2)
- [API Reference](https://developers.google.com/photos/library/reference/rest)
