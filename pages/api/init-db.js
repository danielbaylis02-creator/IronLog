const { Client } = require("pg");

module.exports = async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ ok: false, error: "Use POST" });
    }

    if (!process.env.DATABASE_URL) {
      return res.status(500).json({ ok: false, error: "Missing DATABASE_URL" });
    }

    const client = new Client({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    });

    await client.connect();

    await client.query(`
      CREATE TABLE IF NOT EXISTS workouts (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        exercise TEXT NOT NULL,
        sets INT NOT NULL,
        reps INT NOT NULL,
        weight NUMERIC NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    await client.end();

    return res.status(200).json({ ok: true, message: "DB initialized" });
  } catch (err) {
    return res
      .status(500)
      .json({ ok: false, error: String(err.message || err) });
  }
};
