import { useRoutes } from "react-router-dom";
import { Nav } from "./Nav";
import { routes } from "../router/routes";
import AuthGuard from "./AuthGuard";

const Layout = () => {
  const element = useRoutes(routes);

  return (
    <>
      <Nav />
      <AuthGuard>{ element }</AuthGuard>
    </>
  );
};

export default Layout;
