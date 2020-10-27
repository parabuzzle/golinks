import { makeStyles } from '@material-ui/core/styles'
import Head from 'next/head'
import Link from 'next/link'
import CssBaseline from '@material-ui/core/CssBaseline'
import Typography from '@material-ui/core/Typography'
import Container from '@material-ui/core/Container'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Button from '@material-ui/core/Button'
import { useRouter } from 'next/router'

export const siteTitle = 'GoLinks'
import { signIn, signOut, useSession } from 'next-auth/client'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}))

function Layout(props) {
  const classes = useStyles()
  const [session, loading] = useSession()
  const router = useRouter()
  return (
    <div>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />
      </Head>
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" className={classes.title}>
              GoLinks
            </Typography>
            {!session && (
              <>
                Not signed in <br />
                <Button onClick={() => signIn('okta')}>Sign in</Button>
              </>
            )}
            {session && (
              <>
                {session.user.name}
                <Button onClick={signOut}>Sign Out</Button>
              </>
            )}
          </Toolbar>
        </AppBar>

        <Link href="/" passHref>
          <Button
            color="inherit"
            component="a"
            disabled={router.pathname === '/'}
          >
            Home
          </Button>
        </Link>
        {session && (
          <>
            <Link href="/mylinks" passHref>
              <Button
                color="inherit"
                component="a"
                disabled={router.pathname === '/mylinks'}
              >
                My Links
              </Button>
            </Link>
            <Link href="/create" passHref>
              <Button
                color="inherit"
                component="a"
                disabled={router.pathname === '/create'}
              >
                Add Link
              </Button>
            </Link>
          </>
        )}
      </div>
      <br />
      <React.Fragment>
        <CssBaseline />
        <Container fixed>{props.children}</Container>
      </React.Fragment>
    </div>
  )
}

export default Layout
