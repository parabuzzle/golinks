const db = require('../../../lib/db').instance

export default async (req, res) => {
  const {
    query: { owner },
    method,
  } = req

  try {
    if (owner) {
      const links = await db.any(
        'SELECT * FROM links WHERE owner=$1 ORDER BY visits DESC',
        owner
      )
      res.status(200).json(links)
    } else {
      const links = await db.any('SELECT * FROM links ORDER BY visits DESC')
      res.status(200).json(links)
    }
  } catch (e) {
    console.error(e)
    res.status(500).end()
  }
}
