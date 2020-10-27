import jwt from 'next-auth/jwt'

const secret = process.env.SECRET

export default async (req, res) => {
  const raw = await jwt.getToken({ req, secret, raw: true })
  const token = await jwt.getToken({ req, secret })
  res.status(200).json({ token: raw, decoded: token })
}
