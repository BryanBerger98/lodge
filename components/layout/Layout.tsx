import { Layout as AntLayout, theme as antTheme } from 'antd';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { ReactNode, useEffect, useState } from 'react';

import { useAuthContext } from '@context/auth.context';

import Loader from '../admin/ui/Loader';

import Header from './Header';
import Sider from './Sider';

const { Content } = AntLayout;

type LayoutProperties = {
	children: ReactNode;
}

const Layout = ({ children = null }: LayoutProperties) => {

	const { data: session, status } = useSession();

	const { currentUser, getCurrentUser } = useAuthContext();
	const [ showAdminHeader, setShowAdminHeader ] = useState<boolean>(false);
	const [ showSidebar, setShowSidebar ] = useState<boolean>(false);
	const [ isSidebarOpen, setIsSidebarOpen ] = useState<boolean>(false);
	const router = useRouter();

	useEffect(() => {
		if (session) {
			getCurrentUser();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ session ]);

	useEffect(() => {
		const pathElementIndex = 0;
		const numberOfElementsToDelete = 1;
		const pathArr = router.pathname.split('/');
		pathArr.splice(pathElementIndex, numberOfElementsToDelete);
		if ((pathArr[ 0 ] === 'auth' && pathArr[ 1 ] === 'verify-email') || (pathArr[ 0 ] === 'auth' && pathArr[ 1 ] === 'reset-password') || (pathArr[ 0 ] === 'admin' && pathArr[ 1 ] === 'auth')) {
			setShowAdminHeader(false);
			setShowSidebar(false);
		} else {
			if (currentUser) {
				setShowAdminHeader(true);
				setShowSidebar(true);
			}
		}
	}, [ router, currentUser ]);

	const { token } = antTheme.useToken();

	return (
		<AntLayout
			style={ {
				minHeight: '100vh',
				flexFlow: 'row',
			} }
		>
			{
				status === 'loading'
					? <Loader isLoading />
					:
					<>
						{
							currentUser && showSidebar ?
								<Sider
									isCollapsed={ isSidebarOpen }
									setCollapsed={ setIsSidebarOpen }
								/> : null
						}

					</>
			}
			<AntLayout
				style={ {
					flexFlow: 'column',
					flexGrow: 1,
				} }
			>
				{
					currentUser && showAdminHeader ?
						<Header
							isCollapsed={ isSidebarOpen }
							setCollapsed={ setIsSidebarOpen }
							token={ token }
						/> : null
				}
				<Content
					style={ {
						flexGrow: 1,
						margin: 24,
					} }
				>
					<div
						style={ {
							padding: 24,
							minHeight: '100%',
							background: token.colorBgContainer,
							display: 'flex',
							flexDirection: 'column',
						} }
					>
						{ children }
					</div>
				</Content>
			</AntLayout>
		</AntLayout>
	);

};

export default Layout;
