CREATE TABLE Schedule (
    id INTEGER PRIMARY KEY,
    startTime TEXT NOT NULL,
    endTime TEXT NOT NULL,
    total REAL NOT NULL,
    energy REAL NOT NULL,
    tax REAL NOT NULL,
    level TEXT NOT NULL,
    heatingCartridge INTEGER NOT NULL
);

MAYBE ADD DAY TO SCHEMA???


INSERT INTO Schedule (id, startTime, endTime, total, energy, tax, level, heatingCartridge)
VALUES( 22102721, '2022-10-27 21:00:00','2022-10-27 22:00:00', 0.000, 0.000, 0.000, 'VERY_CHEAP', 1);

ALTER TABLE Schedule DROP startsAt;

NULL. The value is a NULL value.
INTEGER. The value is a signed integer, stored in 0, 1, 2, 3, 4, 6, or 8 bytes depending on the magnitude of the value.
REAL. The value is a floating point value, stored as an 8-byte IEEE floating point number.
TEXT. The value is a text string, stored using the database encoding (UTF-8, UTF-16BE or UTF-16LE).
BLOB. The value is a blob of data, stored exactly as it was input.
