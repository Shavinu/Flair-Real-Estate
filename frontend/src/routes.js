import { Route, Routes } from 'react-router-dom';

import { AuthLayout, ClientLayout, DashboardLayout } from "./layouts";
import { views } from './paths';

//get all paths which are defined in paths.js file
export const getPaths = (r, parentIndex = 0) => {
  let rs = [];

  r.map((item, index) => {
    let key = parentIndex.toString() + index;

    if (item.action && item.element) {
      rs.push({ path: item.action });
    }

    item.children?.length && (rs = rs.concat(getPaths(item.children, key)));
    return item;
  });

  return rs;
};

//get all routes which are defined in paths.js file
export const getRoutes = (r, parentIndex = 0) => {
  let rs = [];

  r.map((item, index) => {
    let key = parentIndex.toString() + index;

    if (item.action && item.element) {
      rs.push(
        <Route
          key={key}
          path={item.action}
          element={item.element}
        />
      );
    }

    item.children?.length && (rs = rs.concat(getRoutes(item.children, key)));
    return item;
  });

  return rs;
};

const RenderRouters = () => {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        {getRoutes(views.auth)}
      </Route>
      <Route element={<DashboardLayout />}>
        {getRoutes(views.dashboard)}
      </Route>
      <Route element={<ClientLayout />}>
        {getRoutes(views.client)}
      </Route>
    </Routes>
  );
};

export default RenderRouters;
