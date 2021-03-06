const db = require('../../../../lib/db').instance

export default async (req, res) => {
  const {
    query: { username },
  } = req
  try {
    const logs = await db.any(
      'SELECT * FROM logs WHERE user_id = $1 ORDER BY created_at DESC',
      username
    )
    res.status(200).json(logs)
  } catch (e) {
    console.error(e)
    res.status(500).end()
  }
}
