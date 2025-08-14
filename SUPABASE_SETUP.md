# Supabase Setup Instructions

## 1. Create Supabase Project

1. Go to [Supabase](https://supabase.com) and create a new account
2. Create a new project
3. Copy your project URL and anon key from the API settings

## 2. Environment Variables

Create a `.env` file in your project root:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 3. Database Schema

Run the following SQL in your Supabase SQL editor:

### Create Enhanced Tasks Table

```sql
-- Create enhanced tasks table with advanced features
CREATE TABLE IF NOT EXISTS public.tasks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT FALSE,
    priority VARCHAR(10) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    category VARCHAR(50) NOT NULL DEFAULT 'Personal',
    due_date DATE,
    start_date DATE,
    time_estimate INTEGER, -- in minutes
    tags TEXT[], -- array of tags
    project_id VARCHAR(100),
    parent_task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE,
    recurring_pattern VARCHAR(20) CHECK (recurring_pattern IN ('daily', 'weekly', 'monthly', 'yearly')),
    recurring_interval INTEGER DEFAULT 1,
    recurring_end_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create updated_at trigger (only if it doesn't exist)
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if it exists, then create it
DROP TRIGGER IF EXISTS handle_tasks_updated_at ON public.tasks;
CREATE TRIGGER handle_tasks_updated_at
    BEFORE UPDATE ON public.tasks
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Enable Row Level Security
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist, then create them
DROP POLICY IF EXISTS "Users can view their own tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can insert their own tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can update their own tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can delete their own tasks" ON public.tasks;

-- Create policies
CREATE POLICY "Users can view their own tasks" ON public.tasks
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tasks" ON public.tasks
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tasks" ON public.tasks
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tasks" ON public.tasks
    FOR DELETE USING (auth.uid() = user_id);
```

### Add Missing Columns to Existing Tasks Table

If you're upgrading from a previous version, run this migration first:

```sql
-- Add missing columns to existing tasks table
ALTER TABLE public.tasks 
ADD COLUMN IF NOT EXISTS start_date DATE,
ADD COLUMN IF NOT EXISTS time_estimate INTEGER,
ADD COLUMN IF NOT EXISTS tags TEXT[],
ADD COLUMN IF NOT EXISTS project_id VARCHAR(100),
ADD COLUMN IF NOT EXISTS parent_task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS recurring_pattern VARCHAR(20) CHECK (recurring_pattern IN ('daily', 'weekly', 'monthly', 'yearly')),
ADD COLUMN IF NOT EXISTS recurring_interval INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS recurring_end_date DATE;

-- Update existing rows to have default values where needed
UPDATE public.tasks 
SET 
    time_estimate = 0,
    tags = '{}',
    recurring_interval = 1
WHERE time_estimate IS NULL OR tags IS NULL OR recurring_interval IS NULL;
```

### Create Indexes for Performance

```sql
-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS tasks_user_id_idx ON public.tasks(user_id);
CREATE INDEX IF NOT EXISTS tasks_completed_idx ON public.tasks(completed);
CREATE INDEX IF NOT EXISTS tasks_due_date_idx ON public.tasks(due_date);
CREATE INDEX IF NOT EXISTS tasks_created_at_idx ON public.tasks(created_at);
CREATE INDEX IF NOT EXISTS tasks_project_id_idx ON public.tasks(project_id);
CREATE INDEX IF NOT EXISTS tasks_parent_task_id_idx ON public.tasks(parent_task_id);
CREATE INDEX IF NOT EXISTS tasks_tags_idx ON public.tasks USING GIN(tags);
CREATE INDEX IF NOT EXISTS tasks_priority_idx ON public.tasks(priority);
```

### Create Projects Table (Optional)

```sql
-- Create projects table for better organization
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    color VARCHAR(7) DEFAULT '#3B82F6', -- hex color
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for projects
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist, then create them
DROP POLICY IF EXISTS "Users can view their own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can insert their own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can update their own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can delete their own projects" ON public.projects;

-- Create policies for projects
CREATE POLICY "Users can view their own projects" ON public.projects
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own projects" ON public.projects
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects" ON public.projects
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects" ON public.projects
    FOR DELETE USING (auth.uid() = user_id);
```

## 4. Authentication Setup

### Enable Email Authentication

1. Go to Authentication > Providers in your Supabase dashboard
2. Enable the Email provider
3. Configure email templates if needed

### Enable Google OAuth (Optional)

1. Go to Authentication > Providers in your Supabase dashboard
2. Enable the Google provider
3. Follow the [Supabase Google OAuth guide](https://supabase.com/docs/guides/auth/social-login/auth-google) to:
   - Create a Google Cloud Project
   - Configure OAuth consent screen
   - Create OAuth 2.0 credentials
   - Add your domain to authorized domains
   - Copy the client ID and secret to Supabase

### Configure Site URL

1. Go to Authentication > URL Configuration
2. Set your Site URL to: `http://localhost:5173` (for development)
3. Add redirect URLs:
   - `http://localhost:5173/dashboard`
   - `http://localhost:5173` (for production, use your actual domain)

## 5. Test the Setup

1. Start your development server: `npm run dev`
2. Navigate to `http://localhost:5173`
3. Try signing up with a new account
4. Check your email for verification (if email confirmation is enabled)
5. Try signing in and creating tasks with natural language parsing

## 6. Production Setup

For production deployment:

1. Update your Site URL and redirect URLs in Supabase
2. Update your environment variables with production values
3. Consider enabling email confirmation
4. Set up proper SMTP settings for email delivery

## Troubleshooting

### Common Issues

1. **CORS Errors**: Make sure your site URL is correctly configured in Supabase
2. **Auth Errors**: Check that your environment variables are correctly set
3. **Database Errors**: Verify that RLS policies are correctly configured
4. **Email Issues**: Check SMTP settings and email templates

### Useful Commands

```sql
-- Check if a user exists
SELECT * FROM auth.users;

-- Check tasks table
SELECT * FROM public.tasks;

-- Check projects table
SELECT * FROM public.projects;

-- Reset tasks table (careful!)
TRUNCATE public.tasks;

-- Get all unique tags
SELECT DISTINCT unnest(tags) as tag FROM public.tasks WHERE tags IS NOT NULL;

-- Get tasks by project
SELECT * FROM public.tasks WHERE project_id = 'your-project-id';

-- Get overdue tasks
SELECT * FROM public.tasks 
WHERE completed = false 
AND due_date < CURRENT_DATE;
```
