import { Route, Routes } from 'react-router-dom';

import { views, AuthViews, ClientViews } from './paths';
import { AuthLayout, DashboardLayout, ClientLayout } from "./layouts";

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
        {getRoutes(AuthViews)}
      </Route>
      <Route element={<DashboardLayout />}>
        {getRoutes(views)}
      </Route>
      <Route element={<ClientLayout />}>
        {getRoutes(ClientViews)}
      </Route>
    </Routes>
  );
};

export default RenderRouters;
