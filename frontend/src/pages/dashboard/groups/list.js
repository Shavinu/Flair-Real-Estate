import { Add } from '@mui/icons-material'
import { Button, Card, Container } from '@mui/material'
import React, { useCallback, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { CustomBreadcrumbs, RouterLink } from 'src/components'
import { PROJECT_NAME } from 'src/config-global'
import { paths } from 'src/paths'
import { GroupDataTable } from 'src/sections/groups/group-data-table'
import GroupService from 'src/services/group-service'

const GroupList = () => {
  const [groups, setGroups] = useState([]);
  const [groupIds, setGroupIds] = useState([]);
  const [rowCount, setRowCount] = useState(0);

  const getGroupList = useCallback(
    async () => {
      try {
        let groupIds = [];
        let rowCount = 0;
        let groups = await GroupService.getGroupList();
        const groupPromise = groups.map(async group => {
          rowCount++;
          groupIds.push(group._id);
          const children = await GroupService.getSubGroupsByParentGroupId(group._id);
          children.forEach(childGroup => {
            groupIds.push(childGroup._id);
            rowCount++;
          });
          return { ...group, children: children }
        })

        setGroups(await Promise.all(groupPromise));
        setGroupIds(groupIds);
        setRowCount(rowCount);
      } catch (error) {
        console.log(error);
      }
    },
    [],
  )

  useEffect(() => {
    getGroupList()
  }, [getGroupList]);

  return (<>
    <Helmet>
      <title>Group List - {PROJECT_NAME}</title>
    </Helmet>

    <Container maxWidth="lg">
      <CustomBreadcrumbs
        heading="List"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Group', href: paths.dashboard.groups.root },
          { name: 'List' },
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.groups.create}
            variant="contained"
            startIcon={<Add />}
          >
            New Group
          </Button>
        }
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <Card>
        <GroupDataTable groups={groups} groupIds={groupIds} rowCount={rowCount} />
      </Card>
    </Container>
  </>)
}

export default GroupList
