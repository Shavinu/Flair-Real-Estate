import { Add } from "@mui/icons-material";
import { Button, Card, Container } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { CustomBreadcrumbs, RouterLink } from "src/components";
import { PROJECT_NAME } from "src/config-global";
import { paths } from "src/paths";
import UserDataTable from "src/sections/users/user-data-table/user-data-table";
import UserService from "src/services/user-service";

const UserList = () => {
  const [users, setUsers] = useState([]);

  const getUserList = useCallback(
    async () => {
      try {
        setUsers(await UserService.getUserList());
      } catch (error) {
        console.log(error);
      }
    },
    [],
  )

  useEffect(() => {
    getUserList();
  }, [getUserList]);

  return <>
    <Helmet>
      <title>User List - {PROJECT_NAME}</title>
    </Helmet>

    <Container maxWidth="lg">
      <CustomBreadcrumbs
        heading="List"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'User', href: paths.dashboard.users.list },
          { name: 'List' },
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.users.create}
            variant="contained"
            startIcon={<Add />}
          >
            New User
          </Button>
        }
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <Card>
        <UserDataTable
          users={users}
          getUserList={getUserList} />
      </Card>
    </Container >
  </>
}

export default UserList;
