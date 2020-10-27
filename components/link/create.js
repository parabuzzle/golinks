import React from 'react'
import randomWords from 'random-words'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/core/styles'

const randwords = randomWords(100)
const host = process.env.API_HOST

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  margin: {
    margin: theme.spacing(2),
  },
  withoutLabel: {
    marginTop: theme.spacing(3),
  },
  textField: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(2),
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'left',
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(2),
  },
  p: {
    paddingBottom: 3,
  },
}))

export default function CreateLink(props) {
  const classes = useStyles()
  const [values, setValues] = React.useState({
    name: '',
    destination: '',
    regex_destination: '',
  })

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value })
  }

  function pathParseStrings(values) {
    let map = values.regex_destination.split('$')
    map.shift() // remove the base...
    const words = randwords.slice(0, map.length)
    let r = values.regex_destination
    map.forEach((element, idx) => {
      const i = idx + 1
      const reg = '$' + i
      r = r.replace(reg, words[idx])
    })
    return {
      link: process.env.API_HOST + '/' + values.name + '/' + words.join('/'),
      regex: r,
    }
  }

  return (
    <div>
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <form className={classes.root} noValidate autoComplete="off">
            <div>
              <TextField
                className={classes.textField}
                required
                id="name"
                label="Name"
                onChange={handleChange('name')}
                defaultValue={values.name}
                fullWidth
              />
              <TextField
                className={classes.textField}
                required
                id="destination"
                label="Redirect To"
                onChange={handleChange('destination')}
                defaultValue={values.destination}
                helperText="Where should the link go?"
                fullWidth
              />
              <TextField
                className={classes.textField}
                id="regex_destination"
                label="Path Parse Logic"
                onChange={handleChange('regex_destination')}
                defaultValue={values.regex_destination}
                fullWidth
              />
            </div>
          </form>
          <br />
          <Button
            variant="contained"
            color="primary"
            onClick={props.handleSubmit(values)}
          >
            Create Link
          </Button>
        </Grid>
        <Grid item xs={6}>
          <div>
            <Paper className={classes.paper}>
              <h3>How Your Link Will Work</h3>
              <p className={classes.p}>
                {host}/{values.name} will redirect to {values.destination}
              </p>

              {values.regex_destination && (
                <>
                  <p className={classes.p}>
                    {pathParseStrings(values).link} will redirect to{' '}
                    {pathParseStrings(values).regex}
                  </p>
                </>
              )}
            </Paper>
            <Paper className={classes.paper}>
              <h3>Using Path Parse Logic</h3>
              <p>
                Path Parsing is optional, if the field is empty, all path data
                after the link name is ignored.
              </p>
              <p>
                Usage is simple, any additonal path data past your link name is
                assigned a $ variable value split by the '/'
              </p>
              <p>
                As an Example: http://go/mylink/foo/bar sets $1 as 'foo' and $2
                as 'bar'. You can reference $1 and $2 in your Path Parse Logic
                field
              </p>
              <p>A good example usage of this is for Jira ticket links:</p>
              <p>
                http://go/jira has a PPL of
                https://company.atlassian.net/browse/PLT-$1 which means visiting
                http://go/jira/123 would redirect to
                https://company.atlassian.net/browse/PLT-123
              </p>
            </Paper>
          </div>
        </Grid>
      </Grid>
    </div>
  )
}
