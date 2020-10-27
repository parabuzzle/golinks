import Head from 'next/head'
import { makeStyles } from '@material-ui/core/styles'
import Layout, { siteTitle } from '../components/layout'
import LinksTable from '../components/tables/links'
import authedFetch from '../lib/authed_fetch'

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
}))

export default function Home(props) {
  const classes = useStyles()
  const links = props.links
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <div>
        <LinksTable links={links} />
      </div>
    </Layout>
  )
}

export async function getServerSideProps(ctx) {
  const res = await authedFetch(ctx, '/api/links')

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
