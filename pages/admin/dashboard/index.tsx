import { HomeOutlined } from '@ant-design/icons';
import { GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';

import PageTitle from '@components/admin/ui/PageTitle';

const AdminDashboardPage = () => {
	return(
		<PageTitle>
			<HomeOutlined /><span>Tableau de bord</span>
		</PageTitle>
	);
};

export default AdminDashboardPage;

const getServerSideProps = async ({ req }: GetServerSidePropsContext) => {
	const session = await getSession({ req });

	if (!session) {
		return {
			redirect: {
				destination: '/',
				permanent: false,
			},
		};
	}

	return { props: { session } };
};

export { getServerSideProps };
