import {
  DesktopOutlined,
  HomeFilled,
  HomeOutlined,
  LoginOutlined,
  LogoutOutlined,
  MoonOutlined,
  PlusSquareOutlined,
  SunOutlined,
} from "@ant-design/icons";
import { Button, Dropdown, type MenuProps } from "antd";
import { Link, NavLink } from "react-router-dom";

import { useColorScheme, type SchemePreference } from "../../app/colorScheme";
import { useAppSelector } from "../../app/hooks";
import { useSignOut } from "../../features/auth/useSignOut";
import { useComposer } from "../../features/stories/composer/composerContext";
import KapsuleMark from "../ui/KapsuleMark";
import UserAvatar from "../ui/UserAvatar";
import Wordmark from "../ui/Wordmark";
import styles from "./AppBar.module.css";

const cx = (...classes: (string | false | undefined)[]) =>
  classes.filter(Boolean).join(" ");

const SCHEME_PREFIX = "scheme:";

const schemeItems: NonNullable<MenuProps["items"]> = [
  { key: `${SCHEME_PREFIX}light`, label: "Light", icon: <SunOutlined /> },
  { key: `${SCHEME_PREFIX}dark`, label: "Dark", icon: <MoonOutlined /> },
  { key: `${SCHEME_PREFIX}system`, label: "System", icon: <DesktopOutlined /> },
];

const AppBar = () => {
  const { openCreate } = useComposer();
  const { status, user } = useAppSelector((state) => state.auth);

  const handleSignOut = useSignOut();
  const { preference, resolved, setPreference } = useColorScheme();
  const schemeIcon = resolved === "dark" ? <MoonOutlined /> : <SunOutlined />;

  const onMenuClick: MenuProps["onClick"] = ({ key }) => {
    if (key.startsWith(SCHEME_PREFIX)) {
      setPreference(key.slice(SCHEME_PREFIX.length) as SchemePreference);
    } else if (key === "logout") {
      void handleSignOut();
    }
  };

  const schemeMenu: MenuProps = {
    items: schemeItems,
    selectable: true,
    selectedKeys: [`${SCHEME_PREFIX}${preference}`],
    onClick: onMenuClick,
  };

  const homeLink = (
    <NavLink
      to="/"
      end
      className={({ isActive }) =>
        cx(styles.navItem, isActive && styles.navItemActive)
      }
    >
      {({ isActive }) => (
        <>
          <span className={styles.navIcon}>
            {isActive ? <HomeFilled /> : <HomeOutlined />}
          </span>
          <span className={styles.navLabel}>Home</span>
        </>
      )}
    </NavLink>
  );

  return (
    <>
      <nav className={styles.sidebar} aria-label="Primary">
        <Link to="/" className={styles.brand} aria-label="Kapsule home">
          <KapsuleMark className={styles.brandIcon} size={30} />
          <Wordmark className={styles.wordmark} />
        </Link>

        <ul className={styles.navList}>
          <li>{homeLink}</li>
          {user ? (
            <>
              <li>
                <button type="button" className={styles.navItem} onClick={openCreate}>
                  <span className={styles.navIcon}>
                    <PlusSquareOutlined />
                  </span>
                  <span className={styles.navLabel}>Create</span>
                </button>
              </li>
              <li>
                <div className={styles.navItem} title={user.username}>
                  <span className={styles.navIcon}>
                    <UserAvatar username={user.username} size={24} />
                  </span>
                  <span className={styles.navLabel}>{user.username}</span>
                </div>
              </li>
            </>
          ) : (
            <li>
              <Link
                to="/authForm"
                state={{ mode: "signIn" }}
                className={styles.navItem}
              >
                <span className={styles.navIcon}>
                  <LoginOutlined />
                </span>
                <span className={styles.navLabel}>Log in</span>
              </Link>
            </li>
          )}
        </ul>

        <div className={styles.navFooter}>
          <Dropdown trigger={["click"]} placement="topLeft" menu={schemeMenu}>
            <button type="button" className={styles.navItem} aria-label="Appearance">
              <span className={styles.navIcon}>{schemeIcon}</span>
              <span className={styles.navLabel}>Appearance</span>
            </button>
          </Dropdown>
          {user ? (
            <button
              type="button"
              className={styles.navItem}
              disabled={status === "loading"}
              onClick={() => void handleSignOut()}
            >
              <span className={styles.navIcon}>
                <LogoutOutlined />
              </span>
              <span className={styles.navLabel}>Log out</span>
            </button>
          ) : (
            <div className={styles.authButtons}>
              <Link to="/authForm" state={{ mode: "signUp" }}>
                <Button type="primary" block>
                  Sign up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </nav>

      <header className={styles.topbar}>
        <Link to="/" className={styles.brand} aria-label="Kapsule home">
          <KapsuleMark className={styles.brandIcon} size={28} />
          <Wordmark className={styles.wordmark} />
        </Link>
        <div className={styles.topbarActions}>
          {user ? null : (
            <>
              <Dropdown trigger={["click"]} placement="bottomRight" menu={schemeMenu}>
                <button
                  type="button"
                  className={styles.iconButton}
                  aria-label="Appearance"
                >
                  {schemeIcon}
                </button>
              </Dropdown>
              <Link to="/authForm" state={{ mode: "signIn" }}>
                <Button type="primary" size="small">
                  Log in
                </Button>
              </Link>
              <Link to="/authForm" state={{ mode: "signUp" }}>
                <Button type="link" size="small">
                  Sign up
                </Button>
              </Link>
            </>
          )}
        </div>
      </header>

      <nav className={styles.tabbar} aria-label="Primary mobile">
        <NavLink to="/" end className={styles.tab} aria-label="Home">
          {({ isActive }) => (isActive ? <HomeFilled /> : <HomeOutlined />)}
        </NavLink>
        {user ? (
          <>
            <button
              type="button"
              className={styles.tab}
              aria-label="Create"
              onClick={openCreate}
            >
              <PlusSquareOutlined />
            </button>
            <Dropdown
              trigger={["click"]}
              placement="topRight"
              menu={{
                items: [
                  { key: "user", label: user.username, disabled: true },
                  { type: "divider" },
                  { type: "group", label: "Appearance", children: schemeItems },
                  { type: "divider" },
                  {
                    key: "logout",
                    label: "Log out",
                    icon: <LogoutOutlined />,
                    disabled: status === "loading",
                  },
                ],
                selectable: true,
                selectedKeys: [`${SCHEME_PREFIX}${preference}`],
                onClick: onMenuClick,
              }}
            >
              <button type="button" className={styles.tab} aria-label="Account">
                <UserAvatar username={user.username} size={26} />
              </button>
            </Dropdown>
          </>
        ) : (
          <Link
            to="/authForm"
            state={{ mode: "signIn" }}
            className={styles.tab}
            aria-label="Log in"
          >
            <LoginOutlined />
          </Link>
        )}
      </nav>
    </>
  );
};

export default AppBar;
