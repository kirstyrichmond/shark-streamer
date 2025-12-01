import { HomeScreen } from "../Components/HomeScreen";
import { AccountScreen } from "../Components/AccountScreen";
import { ChangePlanScreen } from "../Components/ChangePlanScreen";
import { Profiles } from "../Components/Profiles";
import { ManageProfile } from "../Components/ManageProfile";
import { RoutePaths } from "./types";
import { RouteObject } from "react-router-dom";

export const routes: RouteObject[] = [
  {
    path: RoutePaths.Home,
    element: <HomeScreen />,
    index: true,
  },
  {
    path: RoutePaths.Account,
    element: <AccountScreen />,
  },
  {
    path: RoutePaths.ChangePlan,
    element: <ChangePlanScreen />,
  },
  {
    path: RoutePaths.Profiles,
    element: <Profiles />,
  },
  {
    path: RoutePaths.ManageProfile,
    element: <ManageProfile setEditProfilePage={ () => {} } />,
  },
];
