import { LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Dropdown, MenuProps } from 'antd';
import { useRouter } from 'next/router';
import { signOut } from 'next-auth/react';


const AccountDropDownMenu = () => {

	const router = useRouter();

	const handleClickOnSettings = () => {
		router.push('/admin/account');
	};

	const handleLogout = () => {
		signOut();
	};

	const items: MenuProps['items'] = [
		{
		  key: 'account',
		  label: 'Paramètres',
		  icon: <SettingOutlined />,
		  onClick: handleClickOnSettings,
		},
		{
		  key: 'logout',
		  label: 'Déconnexion',
		  icon: <LogoutOutlined />,
		  danger: true,
		  onClick: handleLogout,
		},
	];

	return (
		<Dropdown
			menu={ { items } }
			placement="topRight"
			arrow
		>
			<Button icon={ <UserOutlined /> }>Mon compte</Button>
		</Dropdown>
	);
};

export default AccountDropDownMenu;
