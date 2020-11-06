import Error from 'next/error'
import { makeStyles } from '@material-ui/core/styles'
import authedFetch from '../lib/authed_fetch'

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
}))

export default function PathHandler({ path, link, notFound }) {
  const classes = useStyles()
  if (notFound) {
    return <Error statusCode={404} />
  }
  return <div>redirecting to {link.destination} ...</div>
}

export async function getServerSideProps(ctx) {
  const path = ctx.query.path
  const link = path[0]
  const res = await authedFetch(ctx, '/api/links/' + link)
  // Break out if we're trying to use api as a link...
  if (path[0] === 'api' || path[0] === 'edit' || path[0] === 'create') {
    ctx.res.statusCode = 404
    return {
      props: {
        path: path,
        link: res.data,
        notFound: true,
      },
    }
  }

  if (res.res.status === 200) {
    const _visitTick = await authedFetch(ctx, '/api/links/' + link + '/visit', {
      method: 'POST',
    })
    if (ctx.query.path.length > 1 && res.data.regex_destination) {
      let dest = res.data.regex_destination
      let p = ctx.query.path
      p.shift()
      p.forEach((element, idx) => {
        const i = idx + 1
        const reg = '$' + i
        dest = dest.replace(reg, element)
      })
      ctx.res.writeHead(302, { Location: dest })
      ctx.res.end()
    } else {
      ctx.res.writeHead(302, { Location: res.data.destination })
      ctx.res.end()
    }
    return {
      props: {
        path: path,
        link: res.data,
        notFound: false,
      },
    }
  } else {
    ctx.res.statusCode = res.res.status
    return {
      props: {
        path: path,
        link: null,
        notFound: true,
      },
    }
  }
}
