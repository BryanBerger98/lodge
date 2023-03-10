import { UserOutlined } from '@ant-design/icons';
import { Col, Row } from 'antd';
import { GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';
import { FC, useEffect } from 'react';

import AccountChangePasswordForm from '@components/admin/account/AccountChangePasswordForm';
import AccountContactInformationsForm from '@components/admin/account/AccountContactInformationsForm';
import AccountEmailVerification from '@components/admin/account/AccountEmailVerification';
import AccountInformationsSection from '@components/admin/account/AccountInformationsSection';
import PageTitle from '@components/admin/ui/PageTitle';
import { useAuthContext } from '@context/auth.context';
import { useCsrfContext } from '@context/csrf.context';
import csrf, { CsrfRequest, CsrfResponse } from '@utils/csrf.util';

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
