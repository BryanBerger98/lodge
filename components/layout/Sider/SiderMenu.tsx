import { TeamOutlined, HomeOutlined } from '@ant-design/icons';
import { Menu, MenuProps } from 'antd';
import { useRouter } from 'next/router';
import { BaseSyntheticEvent } from 'react';

type MenuItem = Required<MenuProps>['items'][number];
type MenuClickEventHandler = {
	key: string;
	keyPath: string[];
	domEvent: BaseSyntheticEvent;
}

function getItem(
	label: React.ReactNode,
	key: React.Key,
	icon?: React.ReactNode,
	children?: MenuItem[]
): MenuItem {
	return {
		key,
		icon,
		children,
		label,
	} as MenuItem;
}

const items: MenuItem[] = [
	getItem('Tableau de bord', 'dashboard', <HomeOutlined />),
	getItem('Utilisateurs', 'users', <TeamOutlined />),
];

const SiderMenu = () => {

	const router = useRouter();

	const handleMenuClick = ({ key }: MenuClickEventHandler) => router.push(`/admin/${ key }`);

	return (
		<Menu
			defaultSelectedKeys={ [ 'dashboard' ] }
			items={ items }
			mode="inline"
			style={ { padding: '0 0.5rem' } }
			theme="dark"
			onClick={ handleMenuClick }
		/>
	);
};

export default SiderMenu;
