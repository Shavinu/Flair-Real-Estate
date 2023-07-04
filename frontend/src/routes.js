import { Route, Routes } from 'react-router-dom';
import Admin from './Layouts/Admin';
import Auth from './Layouts/Auth';
import Client from './Layouts/Client';
import { views, AuthViews, ClientViews } from './paths';


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
      <Route element={<Client />}>
        {getRoutes(ClientViews)}
      </Route>
      <Route element={<Auth />}>
        {getRoutes(AuthViews)}
      </Route>
      {/* <Route
        path={`${process.env.REACT_APP_API_URL}/api/auth/verify/:userId/:token`}
        element={<Verified />}
      >
        {getRoutes(AuthViews)}
      </Route> */}
      <Route element={<Admin />}>
        {getRoutes(views)}
      </Route>
    
      {getRoutes(views)}
    </Routes>
  );
};

export default RenderRouters;
