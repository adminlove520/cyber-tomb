-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tombs Table
CREATE TABLE IF NOT EXISTS tombs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_gh_user TEXT NOT NULL,
  lobster_name TEXT NOT NULL,
  avatar_url TEXT,
  born_at DATE DEFAULT CURRENT_DATE,
  died_at DATE DEFAULT CURRENT_DATE,
  cause_of_death TEXT,
  personality_tags TEXT[] DEFAULT '{}',
  epitaph TEXT,
  incense_count INTEGER DEFAULT 0,
  gift_total DECIMAL(10, 2) DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Incense Logs (Veneration)
CREATE TABLE IF NOT EXISTS incense_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tomb_id UUID REFERENCES tombs(id) ON DELETE CASCADE,
  visitor_gh_user TEXT,
  message TEXT,
  count INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Gift Logs (x402 protocol)
CREATE TABLE IF NOT EXISTS gift_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tomb_id UUID REFERENCES tombs(id) ON DELETE CASCADE,
  from_gh_user TEXT,
  amount DECIMAL(10, 2) NOT NULL,
  gift_type TEXT, -- 'incense', 'wreath', 'coffin', etc.
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Global Merit Tracking
CREATE TABLE IF NOT EXISTS global_stats (
  key TEXT PRIMARY KEY,
  value BIGINT DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

INSERT INTO global_stats (key, value) VALUES ('total_merits', 0) ON CONFLICT (key) DO NOTHING;
INSERT INTO global_stats (key, value) VALUES ('total_tombs', 0) ON CONFLICT (key) DO NOTHING;

-- Stored procedures for incrementing stats
CREATE OR REPLACE FUNCTION increment_merit(increment BIGINT DEFAULT 1)
RETURNS VOID AS $$
BEGIN
  UPDATE global_stats 
  SET value = value + increment, 
      updated_at = NOW() 
  WHERE key = 'total_merits';
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION increment_tomb_count()
RETURNS VOID AS $$
BEGIN
  UPDATE global_stats 
  SET value = value + 1, 
      updated_at = NOW() 
  WHERE key = 'total_tombs';
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION increment_tomb_incense(tomb_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE tombs 
  SET incense_count = incense_count + 1, 
      updated_at = NOW() 
  WHERE id = tomb_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION increment_tomb_gift(tomb_id UUID, gift_amount DECIMAL)
RETURNS VOID AS $$
BEGIN
  UPDATE tombs 
  SET gift_total = gift_total + gift_amount, 
      updated_at = NOW() 
  WHERE id = tomb_id;
END;
$$ LANGUAGE plpgsql;

-- RLS Policies (Allow all read, authenticated write)
ALTER TABLE tombs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Access" ON tombs FOR SELECT USING (true);
CREATE POLICY "Authenticated Insert Access" ON tombs FOR INSERT WITH CHECK (true); -- Simplified for dev
CREATE POLICY "Public Update Access" ON tombs FOR UPDATE USING (true); -- Simplified for dev

ALTER TABLE incense_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Access" ON incense_logs FOR SELECT USING (true);
CREATE POLICY "Public Insert Access" ON incense_logs FOR INSERT WITH CHECK (true);

ALTER TABLE gift_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Access" ON gift_logs FOR SELECT USING (true);
CREATE POLICY "Public Insert Access" ON gift_logs FOR INSERT WITH CHECK (true);
