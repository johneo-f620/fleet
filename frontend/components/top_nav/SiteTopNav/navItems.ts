import PATHS from "router/paths";
import URL_PREFIX from "router/url_prefix";
import { IUser } from "interfaces/user";

export interface INavItem {
  name: string;
  icon?: string;
  iconName?: string;
  location: {
    regex: RegExp;
    pathname: string;
  };
  exclude?: boolean;
  withParams?: { type: "query"; names: string[] };
}

export default (
  user: IUser | null,
  isGlobalAdmin = false,
  isAnyTeamAdmin = false,
  isAnyTeamMaintainer = false,
  isGlobalMaintainer = false,
  isNoAccess = false,
  isSandboxMode = false
): INavItem[] => {
  if (!user) {
    return [];
  }

  const isMaintainerOrAdmin =
    isGlobalMaintainer ||
    isAnyTeamMaintainer ||
    isGlobalAdmin ||
    isAnyTeamAdmin;

  const logo = [
    {
      icon: "logo",
      name: "Home",
      iconName: "logo",
      location: {
        regex: new RegExp(`^${URL_PREFIX}/dashboard`),
        pathname: PATHS.DASHBOARD,
      },
    },
  ];

  const navItems: INavItem[] = [
    {
      name: "Hosts",
      location: {
        regex: new RegExp(`^${URL_PREFIX}/hosts/`),
        pathname: PATHS.MANAGE_HOSTS,
      },
      withParams: { type: "query", names: ["team_id"] },
    },
    {
      name: "Controls",
      location: {
        regex: new RegExp(`^${URL_PREFIX}/controls/`),
        pathname: PATHS.CONTROLS,
      },
      exclude: isSandboxMode || !isMaintainerOrAdmin,
      withParams: { type: "query", names: ["team_id"] },
    },
    {
      name: "Software",
      location: {
        regex: new RegExp(`^${URL_PREFIX}/software/`),
        pathname: PATHS.MANAGE_SOFTWARE,
      },
      withParams: { type: "query", names: ["team_id"] },
    },
    {
      name: "Queries",
      location: {
        regex: new RegExp(`^${URL_PREFIX}/queries/`),
        pathname: PATHS.MANAGE_QUERIES,
      },
      withParams: { type: "query", names: ["team_id"] },
    },
    {
      name: "Policies",
      location: {
        regex: new RegExp(`^${URL_PREFIX}/(policies)/`),
        pathname: PATHS.MANAGE_POLICIES,
      },
      withParams: { type: "query", names: ["team_id"] },
    },
  ];

  if (isNoAccess) {
    return [...logo];
  }

  return [
    ...logo,
    ...navItems.filter((item) => {
      return !item.exclude;
    }),
  ];
};
