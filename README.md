# HeavyHunt Chatbot

A beautiful Next.js chatbot application for a Heavy Machinery marketplace. This application helps clients find the perfect heavy machinery by collecting their requirements through an intelligent conversational interface.

## Features

- 🤖 **AI-Powered Conversations**: Uses Google's Gemini 2.0 Flash model for intelligent responses
- 💬 **Beautiful Chat Interface**: Modern, responsive design with smooth animations
- 📱 **Mobile Responsive**: Works perfectly on all device sizes
- 🎯 **Requirement Collection**: Systematically collects all necessary information:
  - Type of heavy machinery needed
  - Condition preference (new/used)
  - Source preference (imported/local)
  - Expected delivery timeline
  - Budget range
  - Contact details
- 💾 **Session Management**: Maintains conversation history per session
- ⚡ **Real-time Responses**: Fast API responses with loading indicators
- 🎨 **Modern UI**: Built with Tailwind CSS and shadcn/ui components

## Tech Stack

- **Frontend**: Next.js 15, React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **AI**: Google Generative AI (Gemini 2.0 Flash)
- **Icons**: Lucide React
- **Backend**: Next.js API Routes

## Prerequisites

- Node.js 18+ installed
- Google AI API key (from Google AI Studio)

## Setup Instructions

### 1. Install Dependencies

```bash
# Install dependencies
npm install
```

### 2. Environment Configuration

1. Update `.env.local` with your Google AI API key:
   ```env
   GOOGLE_API_KEY=your_actual_google_api_key_here
   ```

2. Get your Google AI API key:
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Copy the key and replace `your_actual_google_api_key_here` in `.env.local`

### 3. Run the Application

```bash
# Start the development server
npm run dev
```

The application will be available at `http://localhost:3000`

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts          # Chat API endpoint
│   ├── globals.css               # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Main page
├── components/
│   ├── ui/                      # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   └── scroll-area.tsx
│   └── ChatInterface.tsx        # Main chat component
└── lib/
    └── utils.ts                 # Utility functions
```

## API Endpoints

### POST `/api/chat`

Handles chat messages and returns AI responses.

**Request Body:**
```json
{
  "message": "I need a bulldozer",
  "sessionId": "optional_session_id"
}
```

**Response:**
```json
{
  "response": "Got it 👍 You're looking for a bulldozer...",
  "isQueryCompleted": false,
  "summary": null,
  "unServicable": false
}
```

## Conversation Flow

The chatbot follows a structured approach to collect information:

1. **Machinery Type**: Identifies what heavy machinery the client needs
2. **Condition**: Determines if they want new or used equipment
3. **Source**: Asks about imported vs local sourcing preference
4. **Timeline**: Collects expected delivery timeframe
5. **Budget**: Gathers budget information
6. **Contact**: Collects email and phone number
7. **Summary**: Provides a complete summary when all info is collected

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your `GOOGLE_API_KEY` environment variable in Vercel dashboard
4. Deploy

## Troubleshooting

### Common Issues

1. **API Key Error**: Make sure your Google AI API key is correctly set in `.env.local`
2. **Build Errors**: Ensure all dependencies are installed with `npm install`
3. **Styling Issues**: Check if Tailwind CSS is properly configured

## License

This project is for demonstration purposes. Please ensure you comply with Google's AI usage policies when using their API.
