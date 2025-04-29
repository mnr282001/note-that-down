# Note That Down

A modern, intelligent standup automation platform that helps software development teams streamline their daily standup process through asynchronous updates and AI-powered summaries.

## Features

- **Authentication System**
  - Email/password based authentication
  - Protected routes with middleware
  - Secure session management

- **Standup Management**
  - Customizable question templates
  - Multiple question types (text, number, select)
  - Progress tracking
  - Rich text formatting

- **Team Collaboration**
  - Individual updates collection
  - Team-wide status visibility
  - Blockers identification
  - Actionable next steps

- **User Experience**
  - Modern, responsive UI
  - Intuitive onboarding process
  - Feedback collection system
  - Email notifications

## Tech Stack

- **Frontend**: Next.js 15.2.4, React 19, TypeScript
- **Styling**: Tailwind CSS, Radix UI
- **Backend**: Supabase (Auth, Database, Functions)
- **Authentication**: Supabase Auth
- **Database**: PostgreSQL
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/your-username/note-that-down.git
   cd note-that-down
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up environment variables
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` with your Supabase credentials

4. Run the development server
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
note-that-down/
├── app/                 # Next.js app router pages
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   └── forms/          # Form components
├── lib/                # Utility functions and services
├── public/             # Static assets
├── supabase/          # Supabase configuration
└── types/             # TypeScript type definitions
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run generate-preview` - Generate preview images

### Database Schema

The project uses Supabase with the following main tables:

- `auth.users` - User authentication (managed by Supabase)
- `standup_entries` - Daily standup submissions
- `suggestions` - User feedback and suggestions

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.