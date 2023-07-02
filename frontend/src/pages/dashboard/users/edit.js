import { Helmet } from "react-helmet-async";
import { PROJECT_NAME } from "../../../config-global";
import { useParams } from "../../../hooks/routes";
import { useCallback, useEffect, useState } from "react";
import UserService from "../../../services/user-service";
import { Container } from "@mui/material";
import { CustomBreadcrumbs } from "../../../components";
import { paths } from "../../../paths";
import UserForm from "./user-form";

const Edit = () => {
  const { id } = useParams();
  const [currentUser, setCurrentUser] = useState();

  const getUserDetailById = useCallback(
    async () => {
      setCurrentUser(await UserService.getUserDetailById(id));
    },
    [id],
  )

  useEffect(() => {
    getUserDetailById();
  }, [getUserDetailById])

  return <>
    <Helmet>
      <title>User Edit - {PROJECT_NAME}</title>
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
            name: 'Users',
            href: paths.dashboard.users.list,
          },
          { name: currentUser?.firstName + " " + currentUser?.lastName },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      <UserForm currentUser={currentUser} />
    </Container>

  </>
}

export default Edit;
