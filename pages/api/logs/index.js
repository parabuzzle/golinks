const db = require('../../../lib/db').instance

export default async (req, res) => {
  try {
    const posts = await db.any('SELECT * FROM logs ORDER BY created_at DESC')
    res.status(200).json(posts)
  } catch (e) {
    console.error(e)
    res.status(500).end()
  }
}
