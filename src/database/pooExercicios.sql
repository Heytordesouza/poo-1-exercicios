-- Active: 1675095298905@@127.0.0.1@3306

CREATE TABLE videos (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    title TEXT NOT NULL,
    seconds INTEGER UNIQUE NOT NULL,
    date TEXT DEFAULT (DATETIME()) NOT NULL
);

INSERT INTO videos (id, title, seconds)
VALUES
	("u001", "Chega de Bananinha", 20 ),
	("u002", "Chega de Pokemóns", 15 );

DROP Table videos
