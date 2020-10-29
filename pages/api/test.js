const db = require('../../lib/db').instance

export default async (req, res) => {
  const {
    query: {},
    method,
  } = req

  try {
    const links = await db.any('SELECT * FROM links LIMIT 1')
    res.status(200).json({ database: 'ok', status: 'ok' })
  } catch (e) {
    console.error(e)
    res.status(500).end()
  }
}
