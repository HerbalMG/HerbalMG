CREATE TABLE blog (
    id SERIAL PRIMARY KEY,
    image_url TEXT,  -- Cover or thumbnail image
    title TEXT NOT NULL,
    short_description TEXT,
    content JSONB,  -- Rich structured content: headings, images, lists, etc.
    tags TEXT[],     -- Array of tags (e.g., ['health', 'ayurveda'])
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
