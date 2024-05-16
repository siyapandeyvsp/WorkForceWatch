import { useState } from 'react';
import { Group, Code } from '@mantine/core';
import {
  IconUsersGroup,
  IconChecklist,
  IconSwitchHorizontal,
  IconLogout,
  IconDashboard,
  IconUser,
  IconSettings,
} from '@tabler/icons-react';
import { MantineLogo } from '@mantinex/mantine-logo';
import classes from './NavbarSimple.module.css';
import { useRouter } from 'next/navigation';
import ScreenRecorder from '@/utils/ScreenRecorder';
const data = [
  { link: '/user/manage-employee', label: 'Manage Employees', icon: IconUsersGroup },
  { link: '/user/manage-tasks', label: 'Manage Tasks ', icon: IconChecklist },
 {link:'/employee/profile',label:' Employee Profile',icon:IconUser},
 {link:'/employee',label:'Employee Dashboard',icon:IconDashboard}
];

export function NavbarSimple() {
  const [active, setActive] = useState('Billing');
const router=useRouter();
  const links = data.map((item) => (
    <a
      className={classes.link}
      data-active={item.label === active || undefined}
      href={item.link}
      key={item.label}
      onClick={(event) => {
        event.preventDefault();
        setActive(item.label);
        router.push(item.link)
      }}
    >
      <item.icon className={classes.linkIcon} stroke={1.5} />
      <span>{item.label}</span>
    </a>
  ));
  const handleLogout = (event) => {
    event.preventDefault();
    sessionStorage.clear(); // clear the sessionStorage
    router.push('/'); // navigate to the root
  };
  return (
    <nav className={classes.navbar}>
      <div className={classes.navbarMain}>
        {/* <Group className={classes.header} justify="space-between">
          <MantineLogo size={28} />
          <Code fw={700}>v3.1.2</Code>
        </Group> */}
        {links}
      </div>

      <div className={classes.footer}>
       
        <a href="/employee/recordings" className={classes.link} onClick={(event) => {event.preventDefault() ; router.push('/employee/recordings')}}>
          <IconSettings className={classes.linkIcon} stroke={1.5} />
          <span>Settings</span>
        </a>
        <a href="#" className={classes.link} onClick={(event) => event.preventDefault()}>
          <IconSwitchHorizontal className={classes.linkIcon} stroke={1.5} />
          <span>Change account</span>
        </a>

        <a href="#" className={classes.link} onClick={handleLogout}>
          <IconLogout className={classes.linkIcon} stroke={1.5} />
          <span>Logout</span>
        </a>
      </div>
    </nav>
  );
}