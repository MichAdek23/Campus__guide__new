-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE,
  full_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  university TEXT,
  course TEXT,
  graduation_year INTEGER,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'moderator')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add role column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'role') THEN
    ALTER TABLE profiles ADD COLUMN role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'moderator'));
  END IF;
END $$;

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('scholarship', 'event', 'news')),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create scholarships table
CREATE TABLE IF NOT EXISTS scholarships (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT,
  amount DECIMAL,
  currency TEXT DEFAULT 'NGN',
  deadline DATE,
  eligibility TEXT,
  application_url TEXT,
  category_id UUID REFERENCES categories(id),
  is_featured BOOLEAN DEFAULT FALSE,
  is_hot BOOLEAN DEFAULT FALSE,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT,
  event_date TIMESTAMP WITH TIME ZONE,
  location TEXT,
  registration_url TEXT,
  category_id UUID REFERENCES categories(id),
  is_featured BOOLEAN DEFAULT FALSE,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create news table
CREATE TABLE IF NOT EXISTS news (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT,
  author TEXT,
  image_url TEXT,
  category_id UUID REFERENCES categories(id),
  is_featured BOOLEAN DEFAULT FALSE,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create saved_items table
CREATE TABLE IF NOT EXISTS saved_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  item_id UUID NOT NULL,
  item_type TEXT NOT NULL CHECK (item_type IN ('scholarship', 'event', 'news')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, item_id, item_type)
);

-- Create advertisements table
CREATE TABLE IF NOT EXISTS advertisements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT,
  image_url TEXT,
  link_url TEXT,
  position TEXT NOT NULL CHECK (position IN ('top', 'middle', 'bottom', 'sidebar')),
  is_active BOOLEAN DEFAULT TRUE,
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create settings table
CREATE TABLE IF NOT EXISTS settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE scholarships ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE advertisements ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view their own saved items" ON saved_items;
DROP POLICY IF EXISTS "Users can manage their own saved items" ON saved_items;
DROP POLICY IF EXISTS "Scholarships are viewable by everyone" ON scholarships;
DROP POLICY IF EXISTS "Events are viewable by everyone" ON events;
DROP POLICY IF EXISTS "News are viewable by everyone" ON news;
DROP POLICY IF EXISTS "Categories are viewable by everyone" ON categories;
DROP POLICY IF EXISTS "Active ads are viewable by everyone" ON advertisements;
DROP POLICY IF EXISTS "Settings are viewable by everyone" ON settings;
DROP POLICY IF EXISTS "Only admins can manage scholarships" ON scholarships;
DROP POLICY IF EXISTS "Only admins can manage events" ON events;
DROP POLICY IF EXISTS "Only admins can manage news" ON news;
DROP POLICY IF EXISTS "Only admins can manage categories" ON categories;
DROP POLICY IF EXISTS "Only admins can manage advertisements" ON advertisements;
DROP POLICY IF EXISTS "Only admins can manage settings" ON settings;

-- Create RLS policies
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view their own saved items" ON saved_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own saved items" ON saved_items FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Scholarships are viewable by everyone" ON scholarships FOR SELECT USING (true);
CREATE POLICY "Events are viewable by everyone" ON events FOR SELECT USING (true);
CREATE POLICY "News are viewable by everyone" ON news FOR SELECT USING (true);
CREATE POLICY "Categories are viewable by everyone" ON categories FOR SELECT USING (true);
CREATE POLICY "Active ads are viewable by everyone" ON advertisements FOR SELECT USING (is_active = true);
CREATE POLICY "Settings are viewable by everyone" ON settings FOR SELECT USING (true);

-- Admin policies (only users with admin role can manage content)
CREATE POLICY "Only admins can manage scholarships" ON scholarships FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

CREATE POLICY "Only admins can manage events" ON events FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

CREATE POLICY "Only admins can manage news" ON news FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

CREATE POLICY "Only admins can manage categories" ON categories FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

CREATE POLICY "Only admins can manage advertisements" ON advertisements FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

CREATE POLICY "Only admins can manage settings" ON settings FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert default categories
INSERT INTO categories (name, type, description) VALUES
  ('Academic', 'scholarship', 'Academic scholarships and grants'),
  ('Merit-based', 'scholarship', 'Merit-based scholarships'),
  ('Need-based', 'scholarship', 'Need-based financial aid'),
  ('Sports', 'scholarship', 'Sports and athletics scholarships'),
  ('Arts', 'scholarship', 'Arts and creative scholarships'),
  ('Conference', 'event', 'Academic and professional conferences'),
  ('Workshop', 'event', 'Educational workshops and training'),
  ('Seminar', 'event', 'Seminars and lectures'),
  ('Career Fair', 'event', 'Career and job fairs'),
  ('Competition', 'event', 'Academic and skill competitions'),
  ('University News', 'news', 'University announcements and updates'),
  ('Academic News', 'news', 'Academic and research news'),
  ('Student Life', 'news', 'Student activities and campus life'),
  ('Career News', 'news', 'Career and employment news'),
  ('General', 'news', 'General news and updates')
ON CONFLICT (name, type) DO NOTHING;

-- Insert default settings
INSERT INTO settings (key, value, description) VALUES
  ('site_name', 'Campus Guide Nigeria', 'The name of the website'),
  ('site_description', 'Your comprehensive guide to scholarships, events, and news in Nigerian universities', 'Site description for SEO'),
  ('contact_email', 'info@campusguide.ng', 'Contact email address'),
  ('enable_comments', 'true', 'Enable comments on posts'),
  ('enable_newsletter', 'true', 'Enable newsletter subscription'),
  ('maintenance_mode', 'false', 'Enable maintenance mode'),
  ('facebook_url', '', 'Facebook page URL'),
  ('twitter_url', '', 'Twitter profile URL'),
  ('instagram_url', '', 'Instagram profile URL'),
  ('linkedin_url', '', 'LinkedIn profile URL')
ON CONFLICT (key) DO NOTHING;
