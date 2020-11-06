import Head from 'next/head'
import jwt from 'next-auth/jwt'
import Error from 'next/error'
import { signIn, useSession } from 'next-auth/client'
import { useRouter } from 'next/router'
import { makeStyles } from '@material-ui/core/styles'
import Alert from '@material-ui/lab/Alert'
import Layout from '../../components/layout'
import authedFetch from '../../lib/authed_fetch'
import EditLink from '../../components/link/edit'
import LogsTable from '../../components/tables/logs'

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
}))

export default function Edit({ link, notFound, token, name, logs }) {
  const router = useRouter()

  const handleSubmit = (values) => (event) => {
    const bearer = 'Bearer ' + token
    const url = '/api/links/' + values.name
    const res = fetch(url, {
      headers: { Authorization: bearer, 'Content-Type': 'application/json' },
      method: 'PUT',
      body: JSON.stringify(values),
    }).then((response) => {
      if (response.status === 409) {
        setState({ ...state, error: 409 })
      } else if (response.status === 422) {
        setState({ ...state, error: 422 })
      } else {
        setState({ ...state, success: true })
        router.replace('/edit/' + name)
      }
    })
  }

  const handleDelete = (name) => (event) => {
    const bearer = 'Bearer ' + token
    const url = '/api/links/' + name
    const res = fetch(url, {
      headers: { Authorization: bearer, 'Content-Type': 'application/json' },
      method: 'DELETE',
    }).then((response) => {
      if (response.status === 409) {
        setState({ ...state, error: 409 })
      } else if (response.status === 422) {
        setState({ ...state, error: 422 })
      } else {
        setState({ ...state, success: false })
        router.replace('/')
      }
    })
  }

  const [state, setState] = React.useState({
    error: null,
    success: null,
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

  const enableDelete = () => {
    if (session && session.user.username === link.owner) {
      return true
    }
  }

  return (
    <Layout home>
      <Head>
        <title>Edit {name}</title>
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
        {state.success && (
          <>
            <Alert severity="success">Link Updated</Alert>
          </>
        )}
        <h1>Edit {name}</h1>
        <EditLink
          link={link}
          handleDelete={handleDelete}
          enableDelete={enableDelete()}
          handleSubmit={handleSubmit}
        ></EditLink>
      </div>
      <br />

      <h2>Logs</h2>
      <LogsTable logs={logs} />
    </Layout>
  )
}

export async function getServerSideProps(ctx) {
  const secret = process.env.SECRET
  const req = ctx.req
  const name = ctx.query.name
  const token = await jwt.getToken({ req, secret, raw: false })
  const res = await authedFetch(ctx, '/api/links/' + name)
  if (res.res.status === 200) {
    const logs = await authedFetch(ctx, '/api/logs/link/' + name)
    return {
      props: {
        link: res.data,
        notFound: false,
        token,
        name,
        logs: logs.data,
      },
    }
  } else {
    ctx.res.statusCode = 404
    return {
      props: {
        link: [],
        notFound: true,
        name,
      },
    }
  }
}
