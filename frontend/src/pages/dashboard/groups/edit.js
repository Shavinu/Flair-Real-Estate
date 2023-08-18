import { Container } from '@mui/material'
import React, { useCallback, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { CustomBreadcrumbs } from 'src/components'
import { PROJECT_NAME } from 'src/config-global'
import { useParams } from 'src/hooks/routes'
import { paths } from 'src/paths'
import { GroupForm } from 'src/sections/groups/group-form'
import GroupService from 'src/services/group-service'

const GroupEdit = () => {
  const { id } = useParams();

  const [group, setGroup] = useState();

  const getGroupDetail = useCallback(
    async () => {
      const group = await GroupService.getGroupDetailById(id);
      setGroup(group);
    },
    [id],
  )

  useEffect(() => {
    getGroupDetail()
  }, [getGroupDetail]);

  return (
    <div>
      <Helmet>
        <title>Group Create - {PROJECT_NAME}</title>
      </Helmet>

      <Container maxWidth="lg">
        <CustomBreadcrumbs
          heading="Edit"
          links={[
            {
              name: 'Dashboard',
              href: paths.dashboard.root,
            },
            {
              name: 'Groups',
              href: paths.dashboard.groups.root,
            },
            { name: group?.groupName },
          ]}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

        <GroupForm currentGroup={group} />
      </Container>
    </div>
  )
}

export default GroupEdit
