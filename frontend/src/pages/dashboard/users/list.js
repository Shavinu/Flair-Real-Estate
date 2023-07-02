import { Helmet } from "react-helmet-async";
import { PROJECT_NAME } from "../../../config-global";
import UserDataTable from "../../../sections/user-data-table";

const List = () => {
  return <>
    <Helmet>
      <title>User List - {PROJECT_NAME}</title>
    </Helmet>

    <UserDataTable />
  </>
}

export default List;
