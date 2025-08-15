# Supabase Setup Guide

This guide will help you set up Supabase for the AI Dashboard project with user authentication and weather data storage.

## 1. Create a Supabase Project

1. Go to [Supabase](https://supabase.com/) and sign up/login
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - Name: `ai-dashboard` (or your preferred name)
   - Database Password: Generate a strong password
   - Region: Choose closest to your users
5. Click "Create new project"

## 2. Get API Keys

1. Go to Settings → API in your Supabase dashboard
2. Copy the following values:
   - Project URL
   - Anon (public) key

## 3. Set Environment Variables

Create a `.env.local` file in your project root and add:

```env
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
VITE_TOMORROW_API_KEY=your_tomorrow_api_key_here
```

## 4. Set Up Authentication

### Enable Google OAuth

1. Go to Authentication → Providers in your Supabase dashboard
2. Enable Google provider
3. Get OAuth credentials from [Google Cloud Console](https://console.cloud.google.com/):
   - Create a new project or select existing
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URI: `https://your-project-ref.supabase.co/auth/v1/callback`
4. Add the Client ID and Client Secret to Supabase Google provider settings

### Configure Email Auth

1. In Authentication → Settings:
   - Enable "Enable email confirmations" (optional)
   - Set custom redirect URLs if needed
   - Configure email templates

## 5. Create Database Tables

Run the following SQL in the Supabase SQL Editor:

### Tasks Table

```sql
-- Create tasks table
CREATE TABLE tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT FALSE,
  priority TEXT CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
  category TEXT DEFAULT 'general',
  due_date TIMESTAMP WITH TIME ZONE,
  start_date TIMESTAMP WITH TIME ZONE,
  time_estimate INTEGER, -- in minutes
  tags TEXT[],
  project_id UUID,
  parent_task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  recurring_pattern TEXT,
  recurring_interval INTEGER,
  recurring_end_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to only see their own tasks
CREATE POLICY "Users can view own tasks" ON tasks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tasks" ON tasks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tasks" ON tasks
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own tasks" ON tasks
  FOR DELETE USING (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_completed ON tasks(completed);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
```

### Calendar Events Table

```sql
-- Create calendar_events table (if it doesn't exist)
CREATE TABLE IF NOT EXISTS calendar_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  end_date DATE,
  time TIME,
  end_time TIME,
  location TEXT,
  color TEXT DEFAULT 'bg-blue-100 border-blue-200',
  category TEXT DEFAULT 'Personal',
  recurrence_type TEXT CHECK (recurrence_type IN ('none', 'daily', 'weekly', 'monthly', 'yearly')) DEFAULT 'none',
  recurrence_interval INTEGER DEFAULT 1,
  recurrence_end_date DATE,
  recurrence_count INTEGER,
  all_day BOOLEAN DEFAULT FALSE,
  reminder_minutes INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add end_date column if it doesn't exist (for existing tables)
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='calendar_events' AND column_name='end_date') THEN
        ALTER TABLE calendar_events ADD COLUMN end_date DATE;
    END IF;
END $$;

-- Enable Row Level Security (safe to run multiple times)
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;

-- Create policies only if they don't exist
DO $$ 
BEGIN
    -- Users can view own events
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'calendar_events' AND policyname = 'Users can view own events') THEN
        CREATE POLICY "Users can view own events" ON calendar_events
          FOR SELECT USING (auth.uid() = user_id);
    END IF;

    -- Users can insert own events
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'calendar_events' AND policyname = 'Users can insert own events') THEN
        CREATE POLICY "Users can insert own events" ON calendar_events
          FOR INSERT WITH CHECK (auth.uid() = user_id);
    END IF;

    -- Users can update own events
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'calendar_events' AND policyname = 'Users can update own events') THEN
        CREATE POLICY "Users can update own events" ON calendar_events
          FOR UPDATE USING (auth.uid() = user_id);
    END IF;

    -- Users can delete own events
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'calendar_events' AND policyname = 'Users can delete own events') THEN
        CREATE POLICY "Users can delete own events" ON calendar_events
          FOR DELETE USING (auth.uid() = user_id);
    END IF;
END $$;

-- Create indexes for better performance (only if they don't exist)
CREATE INDEX IF NOT EXISTS idx_calendar_events_user_id ON calendar_events(user_id);
CREATE INDEX IF NOT EXISTS idx_calendar_events_date ON calendar_events(date);
CREATE INDEX IF NOT EXISTS idx_calendar_events_category ON calendar_events(category);
```

### User Preferences Table

```sql
-- Create user_preferences table
CREATE TABLE user_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  weather_location JSONB,
  news_categories TEXT[],
  theme TEXT CHECK (theme IN ('light', 'dark', 'system')) DEFAULT 'system',
  notifications_enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to only see their own preferences
CREATE POLICY "Users can view own preferences" ON user_preferences
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences" ON user_preferences
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences" ON user_preferences
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own preferences" ON user_preferences
  FOR DELETE USING (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX idx_user_preferences_user_id ON user_preferences(user_id);
```

### Weather Cache Table

```sql
-- Create weather_cache table for 6-hour caching
CREATE TABLE weather_cache (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  location_key TEXT NOT NULL, -- lat,lng key for location
  cache_data JSONB NOT NULL, -- Complete weather data
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, location_key)
);

-- Enable Row Level Security
ALTER TABLE weather_cache ENABLE ROW LEVEL SECURITY;

-- Create policies for weather cache
CREATE POLICY "Users can view own weather cache" ON weather_cache
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own weather cache" ON weather_cache
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own weather cache" ON weather_cache
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own weather cache" ON weather_cache
  FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_weather_cache_user_id ON weather_cache(user_id);
CREATE INDEX idx_weather_cache_location_key ON weather_cache(location_key);
CREATE INDEX idx_weather_cache_expires_at ON weather_cache(expires_at);

-- Function to cleanup expired weather cache entries
CREATE OR REPLACE FUNCTION cleanup_expired_weather_cache()
RETURNS void 
SET search_path = ''
AS $$
BEGIN
  DELETE FROM weather_cache WHERE expires_at < NOW();
END;
$$ language 'plpgsql';
```

### Update Trigger Function

```sql
-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER 
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON user_preferences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_weather_cache_updated_at BEFORE UPDATE ON weather_cache
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## 6. Get Tomorrow.io API Key

1. Go to [Tomorrow.io](https://www.tomorrow.io/) and sign up
2. Navigate to your account settings
3. Copy your API key
4. Add it to your `.env.local` file as `VITE_TOMORROW_API_KEY`

## 7. Test the Setup

1. Start your development server: `npm run dev`
2. Navigate to the application
3. Try signing up with email or Google
4. Set a location in the Weather page
5. Verify that weather data loads correctly

## 8. Production Deployment

### Environment Variables

Make sure to set the same environment variables in your production environment:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_TOMORROW_API_KEY`

### Google OAuth Redirect URLs

For production, update your Google OAuth redirect URI to include your production domain:

```
https://your-project-ref.supabase.co/auth/v1/callback
https://your-production-domain.com/auth/callback
```

## 9. Security Considerations

- Never expose your Supabase service role key in the frontend
- Use Row Level Security (RLS) policies (already configured above)
- Regularly rotate API keys
- Monitor API usage to stay within free tier limits

## 10. Troubleshooting

### Common Issues

1. **CORS Errors**: Make sure your Supabase project URL is correct
2. **Authentication Errors**: Verify Google OAuth credentials and redirect URIs
3. **Weather API Errors**: Check Tomorrow.io API key and usage limits
4. **Database Errors**: Ensure all tables and policies are created correctly

### Debug Mode

Enable debug logging in your Supabase client:

```typescript
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'X-Client-Info': 'ai-dashboard'
    }
  }
});
```

## Support

If you encounter issues:

1. Check the [Supabase Documentation](https://supabase.com/docs)
2. Check the [Tomorrow.io Documentation](https://docs.tomorrow.io/)
3. Review the application logs for error messages
4. Verify all environment variables are set correctly
