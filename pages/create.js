import Head from 'next/head'
import Error from 'next/error'
import jwt from 'next-auth/jwt'
import { useRouter } from 'next/router'
import { signIn, useSession } from 'next-auth/client'
import { makeStyles } from '@material-ui/core/styles'
import Alert from '@material-ui/lab/Alert'
import Layout from '../components/layout'
import authedFetch from '../lib/authed_fetch'
import CreateLink from '../components/link/create'

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
}))

export default function Create({ link, notFound, token }) {
  const api_host = process.env.API_HOST
  const router = useRouter()
  const handleSubmit = (values) => (event) => {
    const bearer = 'Bearer ' + token
    const url = api_host + '/api/links/' + values.name
    const res = fetch(url, {
      headers: { Authorization: bearer, 'Content-Type': 'application/json' },
      method: 'POST',
      body: JSON.stringify(values),
    }).then((response) => {
      if (response.status === 409) {
        setState({ ...state, error: 409 })
      } else if (response.status === 422) {
        setState({ ...state, error: 422 })
      } else {
        router.replace('/edit/' + values.name)
      }
    })
  }

  const [state, setState] = React.useState({
    error: null,
  })

  const classes = useStyles()
  const [session, loading] = useSession()
  if (notFound) {
    return <Error statusCode={404} />
  }
  if (!session && !loading) {
    signIn('okta')
    return <div>signing you in...</div>
  }
  return (
    <Layout home>
      <Head>
        <title>Create New GoLink</title>
      </Head>
      <div>
        {state.error === 409 && (
          <>
            <Alert severity="error">That Link Already Exists</Alert>
          </>
        )}
        {state.error === 422 && (
          <>
            <Alert severity="error">Required Fields are Missing</Alert>
          </>
        )}
        <h1>Create New GoLink</h1>
        <CreateLink handleSubmit={handleSubmit}></CreateLink>
      </div>
    </Layout>
  )
}

export async function getServerSideProps(ctx) {
  const secret = process.env.SECRET
  const req = ctx.req
  const token = await jwt.getToken({ req, secret, raw: false })
  const res = await authedFetch(ctx, '/api/links')
  if (res.res.status === 200) {
    return {
      props: {
        link: res.data,
        notFound: false,
        token,
      },
    }
  } else {
    ctx.res.statusCode = 404
    return {
      props: {
        link: [],
        notFound: true,
      },
    }
  }
}
