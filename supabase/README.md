# Supabase Setup

This directory contains SQL migrations and setup instructions for the Supabase backend.

## Email Subscribers Table

The application uses an `email_subscribers` table to store email addresses of users who want to be notified when the application launches.

### Table Structure

```
email_subscribers
├── id (UUID, PRIMARY KEY)
├── email (TEXT, UNIQUE)
└── created_at (TIMESTAMPTZ)
```

### Security Policies

- **Allow anyone to insert emails**: This policy allows both anonymous and authenticated users to add their email to the subscribers list.
- **Only authenticated users can view emails**: This policy allows only authenticated users to view the list of subscribers.

### Permissions

- Anonymous and authenticated users can insert emails
- Only authenticated users can view the list of subscribers

## Additional Setup

For more information on setting up Supabase for this application, refer to the main README.md file in the root directory. 