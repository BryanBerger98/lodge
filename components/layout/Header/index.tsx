import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Layout } from 'antd';
import { GlobalToken } from 'antd/es/theme';
import { createElement, Dispatch, FC, SetStateAction } from 'react';

import AccountDropDownMenu from '@components/admin/account/AccountDropdownMenu';

const { Header: AntHeader } = Layout;

type HeaderProperties = {
	token: GlobalToken;
	isCollapsed: boolean;
	setCollapsed: Dispatch<SetStateAction<boolean>>;
}

const Header: FC<HeaderProperties> = ({ token, isCollapsed, setCollapsed }) => {

	const { colorBgContainer } = token;

	return (
		<AntHeader
			style={ {
				padding: '0 24px',
				background: colorBgContainer,
				display: 'flex',
				justifyContent: 'space-between',
				alignItems: 'center',
			} }
		>
			{
				createElement(
					isCollapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
					{
						style: {
							padding: 0,
							fontSize: '18px',
							lineHeight: '64px',
							cursor: 'pointer',
						},
						onClick: () => setCollapsed(!isCollapsed),
					}
				)
			}
			<AccountDropDownMenu />
		</AntHeader>
	);
};

export default Header;
