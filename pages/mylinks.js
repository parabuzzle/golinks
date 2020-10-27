import Head from 'next/head'
import { makeStyles } from '@material-ui/core/styles'
import Layout from '../components/layout'
import LinksTable from '../components/tables/links'
import authedFetch from '../lib/authed_fetch'
import jwt from 'next-auth/jwt'

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
}))

export default function MyLinks({ links }) {
  const classes = useStyles()
  return (
    <Layout home>
      <Head>
        <title>My GoLinks</title>
      </Head>
      <div>
        <LinksTable links={links} />
      </div>
    </Layout>
  )
}

export async function getServerSideProps(ctx) {
  const secret = process.env.SECRET
  const req = ctx.req
  const token = await jwt.getToken({ req, secret, raw: false })
  if (!token) {
    ctx.res.writeHead(302, { Location: '/api/auth/signin' })
    ctx.res.end()
  }
  const res = await authedFetch(ctx, '/api/links?owner=' + token.username)

  if (res.res.status === 200) {
    return {
      props: {
        links: res.data,
      },
    }
  } else {
    // handle failed fetch (including 401)...
    return {
      props: {
        links: [],
      },
    }
  }
}
