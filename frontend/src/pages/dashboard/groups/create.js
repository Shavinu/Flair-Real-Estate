import { Container } from '@mui/material'
import React from 'react'
import { Helmet } from 'react-helmet-async'
import { CustomBreadcrumbs } from 'src/components'
import { PROJECT_NAME } from 'src/config-global'
import { paths } from 'src/paths'
import { GroupForm } from 'src/sections/groups/group-form'

const GroupCreate = () => {
  return (
    <>
      <Helmet>
        <title>Group Create - {PROJECT_NAME}</title>
      </Helmet>

      <Container maxWidth="lg">
        <CustomBreadcrumbs
          heading="Create"
          links={[
            {
              name: 'Dashboard',
              href: paths.dashboard.root,
            },
            {
              name: 'Groups',
              href: paths.dashboard.groups.root,
            },
            { name: 'Create New Group' },
          ]}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />
        <GroupForm />
      </Container>
    </>
  )
}

export default GroupCreate
