# StudyAI - AI-Powered Revision Question Generator

An intelligent revision app that helps students generate personalized practice questions using AI, tailored to their specific education board and curriculum requirements.

## Features

- **AI-Powered Question Generation**: Uses OpenAI GPT-4 to generate contextual questions based on syllabus topics
- **Multiple Education Boards**: Support for Cambridge IGCSE, Edexcel, AQA, OCR, IB, AP, and general curricula
- **Comprehensive Subject Coverage**: Mathematics, Physics, Chemistry, Biology, History, Geography, English Literature, Computer Science, Economics, and Psychology
- **Adaptive Difficulty**: Questions generated at easy, medium, and hard levels
- **Multiple Question Types**: Multiple choice, short answer, essay, true/false, and fill-in-the-blank
- **Real-time Practice**: Interactive sessions with immediate feedback and explanations
- **Progress Tracking**: Monitor performance and improvement over time

## Getting Started

### Prerequisites

1. Node.js 18+ installed
2. OpenRouter API key (for question generation)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd revision-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory and add:
```
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Usage

1. **Generate Questions**: Navigate to the Questions page and select your education board, subject, topic, and subtopic
2. **Customize Session**: Choose question count, difficulty level, and question types
3. **Practice**: Answer the generated questions in an interactive session
4. **Review**: Get detailed feedback and explanations for each answer
5. **Track Progress**: Monitor your performance over time

## Project Structure

```
src/
├── app/
│   ├── api/generate-questions/  # OpenAI API integration
│   ├── globals.css              # Global styles and theme
│   └── page.tsx                 # Main application page
├── components/
│   ├── ui/                      # Reusable UI components
│   ├── dashboard.tsx           # Dashboard view
│   ├── enhanced-question-generator.tsx  # AI question generator
│   ├── layout.tsx              # Main app layout
│   └── syllabus-manager.tsx    # Syllabus management
├── lib/
│   ├── api.ts                  # API utilities
│   └── utils.ts                # Helper functions
└── types/
    └── index.ts                # TypeScript type definitions
```

## Technology Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React
- **AI**: OpenRouter API with DeepSeek models (R1T Chimera, R1 0528)

## Environment Variables

Create a `.env.local` file with the following variables:

```
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

## Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Tailwind CSS](https://tailwindcss.com) - utility-first CSS framework
- [Radix UI](https://www.radix-ui.com/) - low-level UI primitives
- [OpenRouter API](https://openrouter.ai/docs) - AI integration with free models

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploy) for more details.
