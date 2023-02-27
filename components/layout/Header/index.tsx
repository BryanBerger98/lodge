import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Layout } from 'antd';
import { GlobalToken } from 'antd/es/theme';
import { createElement, Dispatch, FC, SetStateAction } from 'react';

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
				padding: 0,
				background: colorBgContainer,
			} }
		>
			{
				createElement(
					isCollapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
					{
						style: {
							padding: '0 24px',
							fontSize: '18px',
							lineHeight: '64px',
							cursor: 'pointer',
						},
						onClick: () => setCollapsed(!isCollapsed),
					}
				)
			}
		</AntHeader>
	);
};

export default Header;
