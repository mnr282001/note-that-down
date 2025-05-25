# Note That Down

Note That Down is a productivity tool designed to streamline your daily work reflections and standup meetings. It automates end-of-day and pre-standup check-ins, helping you track your progress, surface blockers, and continuously improve your workflow with personalized feedback.

## Features

- **Authentication**: Secure login and user management.
- **Dashboard**: Overview of your recent activity, responses, and suggestions.
- **Questions Form**: At the end of each workday (4pm), you receive an email with a set of questions about your day and work. Your responses are stored for future reference and analysis.
- **Personalized Standup Email**: The next morning at 9am (30 minutes before your standup, customizable), you receive a personalized email summarizing your answers to the classic standup questions:
  - What did you do yesterday?
  - What are you doing today?
  - Do you have any blockers?
  - Plus, additional notes and insights based on your previous responses.
- **Suggestions Form**: Each standup email includes a link to a suggestions form, where you can provide feedback on the email, the process, or anything else you'd like to see improved.
- **Continuous Improvement**: The service uses your suggestions and previous responses to improve future personalized emails and questions.
- **User Info & Activity**: View your profile, responsibilities, and activity history.

## How It Works

1. **End of Day (4pm)**: You receive an email with a questions form about your workday.
2. **Morning of Standup (9am, customizable)**: You receive a personalized standup email with your previous answers and notes, plus a link to the suggestions form.
3. **Feedback Loop**: Your suggestions and feedback are incorporated into future emails and questions, making the experience more tailored to you over time.

## Database Schema

The app uses Supabase (PostgreSQL) with the following main tables:

- **user_profiles**: Stores user job titles, departments, responsibilities, and other profile info.

- **user_responsibilities**: Tracks specific responsibilities for each user.

- **magic_links**: Handles secure, time-limited links for forms and authentication.

- **standup_entries**: Stores daily answers to the questions form, linked to each user.

- **suggestions**: Stores user feedback and suggestions, linked to each user.

- **email_subscribers**: Manages the list of users receiving emails.



## Roadmap

**Priority #1: Get the email service working** (automated 4pm and 9am emails)
- Custom questions based on user responsibilities, roles, and other metrics
- More personalization in standup emails and feedback
- Improved suggestions and feedback loop

**Custom Questions:**
-  In the future, the questions form will be dynamically generated based on your responsibilities, role, and other metrics.

**More Personalization:**
- Standup emails and feedback will become increasingly tailored as the system learns from your input.

## Tech Stack

- **Frontend**: Next.js, React, TypeScript
- **Styling**: Tailwind CSS, Radix UI
- **Backend**: Supabase (Auth, Database, Functions)
- **Authentication**: Supabase Auth
- **Database**: PostgreSQL
- **Deployment**: Vercel

## Getting Started

1. Sign up and complete your profile.
2. Check your email at 4pm for the daily questions form.
3. Review your personalized standup email the next morning.
4. Use the suggestions form to help us improve your experience!

## Project Structure

```
note-that-down/
├── app/                 # Next.js app router pages
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   └── forms/          # Form components
├── lib/                # Utility functions and services
├── public/             # Static assets
├── supabase/           # Supabase configuration
└── types/              # TypeScript type definitions
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run generate-preview` - Generate preview images

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.