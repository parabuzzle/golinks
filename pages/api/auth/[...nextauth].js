import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'

const options = {
  providers: [
    Providers.Okta({
      clientId: process.env.OKTA_CLIENT_ID,
      clientSecret: process.env.OKTA_CLIENT_SECRET,
      domain: process.env.OKTA_DOMAIN,
    }),
  ],

  secret: process.env.SECRET,

  session: {
    jwt: true,
  },

  jwt: {
    secret: process.env.SECRET,
  },

  callbacks: {
    session: async (session, user, sessionToken) => {
      session.user.username = user.username
      session.user.token = user.raw
      return Promise.resolve(session)
    },

    jwt: async (token, user, account, profile, isNewUser) => {
      const isSignIn = user ? true : false
      // Add auth_time to token on signin in
      if (isSignIn) {
        token.auth_time = Math.floor(Date.now() / 1000)
        token.username = profile.preferred_username
        token.raw = account.accessToken
      }
      return Promise.resolve(token)
    },
  },
}

export default (req, res) => NextAuth(req, res, options)
