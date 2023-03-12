import { UserOutlined } from '@ant-design/icons';
import { Col, Row } from 'antd';
import { GetServerSidePropsContext } from 'next';
import dynamic from 'next/dynamic';
import { getSession } from 'next-auth/react';
import { FC, useEffect } from 'react';

import { useAuthContext } from '@context/auth.context';
import { useCsrfContext } from '@context/csrf.context';
import csrf, { CsrfRequest, CsrfResponse } from '@utils/csrf.util';

const AccountChangePasswordForm = dynamic(() => import('@components/admin/account/AccountChangePasswordForm'));
const AccountEmailVerification = dynamic(() => import('@components/admin/account/AccountEmailVerification'));
const AccountInformationsSection = dynamic(() => import('@components/admin/account/AccountInformationsSection'));
const AccountContactInformationsForm = dynamic(() => import('@components/admin/account/AccountContactInformationsForm'));
const PageTitle = dynamic(() => import('@components/admin/ui/PageTitle'));

type AdminAccountPageProperties = {
	csrfToken: string;
}

const AdminAccountPage: FC<AdminAccountPageProperties> = ({ csrfToken }) => {

	const { currentUser } = useAuthContext();
	const { dispatchCsrfToken } = useCsrfContext();

	useEffect(() => {
		dispatchCsrfToken(csrfToken);
	}, [ dispatchCsrfToken, csrfToken ]);

	return (
		currentUser ?
			<>
				<PageTitle><UserOutlined /> <span>Mon compte</span></PageTitle>
				<Row gutter={ 16 }>
					<Col span={ 24 }>
						<AccountInformationsSection currentUser={ currentUser } />
					</Col>
					<Col span={ 24 }>
						{ !currentUser.email_verified ? <AccountEmailVerification /> : null }
					</Col>
					<Col span={ 12 }>
						<AccountContactInformationsForm currentUser={ currentUser } />
					</Col>
					<Col span={ 12 }>
						<AccountChangePasswordForm />
					</Col>
				</Row>
			</>
			: null
	);
};

export default AdminAccountPage;

const getServerSideProps = async ({ req, res }: GetServerSidePropsContext & { req: CsrfRequest, res: CsrfResponse }) => {
	const session = await getSession({ req });
	await csrf(req, res);

	if (!session) {
		return {
			redirect: {
				destination: '/',
				permanent: false,
			},
		};
	}

	return {
		props: {
			session,
			csrfToken: req.csrfToken(),
		},
	};
};

export { getServerSideProps };
