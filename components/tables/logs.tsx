import React from 'react'
import Paper from '@material-ui/core/Paper'
import { makeStyles } from '@material-ui/core/styles'

const actionMap = {
  UPDATE: 'Updated',
  DELETE: 'Deleted',
  CREATE: 'Created',
}

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
    marginBottom: theme.spacing(3),
  },
  p: {
    padding: 3,
  },
  buttons: {
    padding: 2,
  },
  buttonSpan: {
    margin: 6,
  },
}))

function logString(username, action, date) {
  return actionMap[action] + ' on ' + date + ' by ' + username
}

function processLogs(logs) {
  const dateFormat = require('dateformat')
  const format = 'mmmm dS, yyyy, h:MM:ss TT'
  const l = logs.map((logs) => ({
    id: logs.id,
    username: logs.user_id,
    action: logs.action,
    date: logs.created_at,
    str: logString(
      logs.user_id,
      logs.action,
      dateFormat(logs.created_at, format)
    ),
    key: logs.id,
  }))
  return l
}

export default function LogsTable({ logs }) {
  const classes = useStyles()
  return (
    <div>
      <Paper className={classes.paper}>
        {processLogs(logs).map((log) => (
          <div key={log.key}>{log.str}</div>
        ))}
      </Paper>
    </div>
  )
}
