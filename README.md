# Vibe - API Key Management Platform

This is a [Next.js](https://nextjs.org) project that provides API key management and GitHub repository summarization using Google's Gemini AI model.

## Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn install
```

Then, create a `.env.local` file in the root directory with the following variables:
```
# Supabase connection details
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Google Generative AI API key
GOOGLE_API_KEY=your-google-api-key
```

### Setting up Google Gemini API

1. Get a Google Gemini API key:
   - Go to [Google AI Studio](https://ai.google.dev/)
   - Sign in with your Google account
   - Navigate to "Get API key" in the menu
   - Create a new API key
   - Copy the API key and paste it into your `.env.local` file

### Running the Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Features

### API Key Management
- Create, edit, and delete API keys
- Monitor API key usage
- Set usage quotas and limits
- View usage statistics and analytics

### GitHub Repository Summarizer
The project includes a GitHub repository summarizer that uses Google's Gemini AI model. The summarizer:
- Analyzes repository README files
- Provides concise summaries
- Extracts key features and facts
- Supports multiple Gemini models

#### Available Gemini Models
The default model is `gemini-1.5-pro`, but you can also use:
- `gemini-1.5-pro` - Current stable model (recommended)
- `gemini-1.5-flash` - Faster, more efficient model for basic tasks
- `gemini-1.0-pro` - Legacy model (might be deprecated)
- `gemini-pro-vision` - For tasks requiring image analysis (not used in this app)

Note: Model names change over time. Check the [Google AI documentation](https://ai.google.dev/models/gemini) for the most up-to-date model names.

## Troubleshooting

### API Key Issues
If you encounter errors related to rate limiting or API key issues, verify that:
1. Your Google API key is correctly set in the environment variables
2. You have sufficient quota for Google Gemini API calls
3. The API key has access to the Gemini models you're trying to use
4. You're using the correct model name format (e.g., "gemini-1.5-pro" not "gemini-pro")

## Learn More

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API
- [Google Generative AI documentation](https://ai.google.dev/docs) - learn about Gemini AI models
- [Supabase Documentation](https://supabase.com/docs) - learn about Supabase features

## Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
