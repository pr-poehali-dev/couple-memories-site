CREATE TABLE IF NOT EXISTS moments (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    description TEXT NOT NULL,
    image TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_moments_date ON moments(date DESC);

INSERT INTO moments (title, date, description, image) VALUES
('Первая встреча', '2023-02-14', 'День, когда наши сердца встретились...', 'https://cdn.poehali.dev/projects/e40605ee-62aa-45c2-8830-c9a2a736e37a/files/101a60e7-03ec-4926-ac6e-b5ae9fb1bdaf.jpg'),
('Наше первое путешествие', '2023-06-15', 'Незабываемые моменты вместе в новом городе', 'https://cdn.poehali.dev/projects/e40605ee-62aa-45c2-8830-c9a2a736e37a/files/75318097-aeb7-4126-9eeb-5083de9a3635.jpg'),
('Уютный вечер вдвоем', '2023-08-22', 'Простые моменты, которые создают большие воспоминания', 'https://cdn.poehali.dev/projects/e40605ee-62aa-45c2-8830-c9a2a736e37a/files/d007a8e8-6639-4221-a3f6-aeaa942f2867.jpg');