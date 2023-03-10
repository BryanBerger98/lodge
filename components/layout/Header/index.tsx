import { ArrowLeftOutlined, HomeOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Button, Layout } from 'antd';
import { GlobalToken } from 'antd/es/theme';
import { useRouter } from 'next/router';
import { createElement, Dispatch, FC, SetStateAction } from 'react';

import AccountDropDownMenu from '@components/admin/account/AccountDropdownMenu';

const { Header: AntHeader } = Layout;

type HeaderProperties = {
	token: GlobalToken;
	isCollapsed: boolean;
	setCollapsed: Dispatch<SetStateAction<boolean>>;
	isToggleButtonDisplayed: boolean;
}

const Header: FC<HeaderProperties> = ({ token, isCollapsed, setCollapsed, isToggleButtonDisplayed = false }) => {

	const router = useRouter();
	const [ , pathDomain ] = router.pathname.split('/');

	const { colorBgContainer } = token;

	const handleChangeView = () => {
		if (pathDomain === 'admin') {
			router.push('/');
		} else {
			router.push('/admin/dashboard');
		}
	};

	return (
		<AntHeader
			className="drop-shadow"
			style={ {
				padding: '0 24px',
				background: colorBgContainer,
				display: 'flex',
				justifyContent: 'space-between',
				alignItems: 'center',
			} }
		>
			<div
				style={ {
					display: 'flex',
					gap: 16,
					alignItems: 'center',
				} }
			>
				{
					isToggleButtonDisplayed ?
						createElement(
							isCollapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
							{
								style: {
									padding: 0,
									fontSize: '18px',
									lineHeight: '64px',
									cursor: 'pointer',
									display: 'flex',
									alignItems: 'center',
								},
								onClick: () => setCollapsed(!isCollapsed),
							}
						)
						: null
				}
				<Button
					icon={ pathDomain === 'admin' ? <ArrowLeftOutlined /> : <HomeOutlined /> }
					type="primary"
					onClick={ handleChangeView }
				>
					{ pathDomain === 'admin' ? 'Retourner au site' : 'Tableau de bord' }
				</Button>
			</div>
			<AccountDropDownMenu />
		</AntHeader>
	);
};

export default Header;
