import { Layout as AntLayout, theme as antTheme } from 'antd';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { ReactNode, useEffect, useState } from 'react';

import { useAuthContext } from '@context/auth.context';

const DynamicHeader = dynamic(() => import('./Header'));
const DynamicSider = dynamic(() => import('./Sider'));

const { Content } = AntLayout;

type LayoutProperties = {
	children: ReactNode;
}

const Layout = ({ children = null }: LayoutProperties) => {

	const { data: session } = useSession();

	const { currentUser, getCurrentUser } = useAuthContext();
	const [ showAdminHeader, setShowAdminHeader ] = useState<boolean>(false);
	const [ showSidebar, setShowSidebar ] = useState<boolean>(false);
	const [ isSidebarOpen, setIsSidebarOpen ] = useState<boolean>(false);
	const router = useRouter();
	const [ , pathDomain, pathRoute ] = router.pathname.split('/');

	useEffect(() => {
		if (session) {
			getCurrentUser();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ session ]);

	useEffect(() => {
		if (currentUser) {
			if (pathDomain === 'admin' && pathRoute !== 'auth') {
				setShowAdminHeader(true);
				setShowSidebar(true);
			}
			if (pathDomain !== 'admin') {
				setShowAdminHeader(true);
				setShowSidebar(false);
			}
		} else {
			setShowAdminHeader(false);
			setShowSidebar(false);
		}
	}, [ pathDomain, pathRoute, currentUser ]);

	const { token } = antTheme.useToken();

	return (
		<AntLayout
			style={ {
				minHeight: '100vh',
				flexFlow: 'row',
			} }
		>
			{
				currentUser && showSidebar ?
					<DynamicSider
						isCollapsed={ isSidebarOpen }
						setCollapsed={ setIsSidebarOpen }
					/> : null
			}
			<AntLayout
				style={ {
					flexFlow: 'column',
					flexGrow: 1,
				} }
			>
				{
					currentUser && showAdminHeader ?
						<DynamicHeader
							isCollapsed={ isSidebarOpen }
							isToggleButtonDisplayed={ showSidebar }
							setCollapsed={ setIsSidebarOpen }
							token={ token }
						/> : null
				}
				<Content
					style={ {
						flexGrow: 1,
						margin: pathDomain === 'admin' ? 24 : 0,
					} }
				>
					<div
						style={ pathDomain === 'admin' ? {
							padding: 24,
							minHeight: '100%',
							background: token.colorBgContainer,
							display: 'flex',
							flexDirection: 'column',
						} : { padding: 24 } }
					>
						{ children }
					</div>
				</Content>
			</AntLayout>
		</AntLayout>
	);

};

export default Layout;
