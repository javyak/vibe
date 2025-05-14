# Google Gemini Integration

This project now uses Google's Gemini AI model instead of OpenAI for the GitHub repository summarizer.

## Setup

1. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

2. Create a `.env.local` file in the root directory with the following variables:
   ```
   # Supabase connection details
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

   # Google Generative AI API key
   GOOGLE_API_KEY=your-google-api-key
   ```

3. Get a Google Gemini API key:
   - Go to [Google AI Studio](https://ai.google.dev/)
   - Sign in with your Google account
   - Navigate to "Get API key" in the menu
   - Create a new API key
   - Copy the API key and paste it into your `.env.local` file

## Usage

The GitHub summarizer API endpoint at `/api/github-summarizer` now uses Google's Gemini model. The interface and functionality remain the same, but the underlying AI provider has changed.

## Models Available

The default model is `gemini-1.5-pro`, but you can also use other available models:
- `gemini-1.5-pro` - Current stable model (recommended)
- `gemini-1.5-flash` - Faster, more efficient model for basic tasks
- `gemini-1.0-pro` - Legacy model (might be deprecated)
- `gemini-pro-vision` - For tasks requiring image analysis (not used in this app)

Note: Model names change over time. Check the [Google AI documentation](https://ai.google.dev/models/gemini) for the most up-to-date model names.

## Error Handling

If you encounter an error related to rate limiting or API key issues, verify that:
1. Your Google API key is correctly set in the environment variables
2. You have sufficient quota for Google Gemini API calls
3. The API key has access to the Gemini models you're trying to use
4. You're using the correct model name format (e.g., "gemini-1.5-pro" not "gemini-pro")

For more information, see the [Google Generative AI documentation](https://ai.google.dev/docs). 