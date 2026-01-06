module.exports = async (req, res) => {
  const hasDbUrl = !!process.env.DATABASE_URL;
  res.status(200).json({ ok: true, hasDbUrl });
};
