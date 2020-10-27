import React from 'react'
import Button from '@material-ui/core/Button'
import AddCircle from '@material-ui/icons/AddCircle'
import EditIcon from '@material-ui/icons/Edit'
import Link from 'next/link'
import { makeStyles } from '@material-ui/core/styles'
import {
  DataGrid,
  RowsProp,
  ColDef,
  ValueFormatterParams,
} from '@material-ui/data-grid'

const columns: ColDef[] = [
  {
    field: 'name',
    headerName: 'Name',
    width: 200,
    disableClickEventBubbling: true,
  },
  {
    field: 'destination',
    headerName: 'Redirect To',
    width: 300,
    disableClickEventBubbling: true,
    renderCell: (params: ValueFormatterParams) => (
      <Link href={params.value as string}>{params.value}</Link>
    ),
  },
  {
    field: 'visits',
    headerName: 'Visits',
    width: 100,
    disableClickEventBubbling: true,
  },
  {
    field: 'actions',
    headerName: 'Actions',
    width: 200,
    renderCell: (params: ValueFormatterParams) => (
      <strong>
        <Link href={'/edit/' + params.value}>
          <Button
            color="inherit"
            size="small"
            style={{ marginLeft: 16 }}
            startIcon={<EditIcon />}
          >
            Edit
          </Button>
        </Link>
      </strong>
    ),
    disableClickEventBubbling: true,
  },
]

const useStyles = makeStyles((theme) => ({
  button: {
    marginBottom: theme.spacing(2),
  },
}))

function processRows(links) {
  const l = links.map((link) => ({
    id: link.id,
    name: link.name,
    destination: link.destination,
    visits: link.visits,
    actions: link.name,
  }))
  const rows: RowsProp = l
  return rows
}

export default function LinksTable({ links }) {
  const classes = useStyles()
  const r = processRows(links)
  return (
    <div style={{ height: 500, width: '100%' }}>
      <Button
        variant="contained"
        color="primary"
        href="/create"
        className={classes.button}
        startIcon={<AddCircle />}
      >
        Add Link
      </Button>
      <DataGrid rowHeight={25} rows={r} columns={columns} />
    </div>
  )
}
