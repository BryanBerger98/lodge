import { HomeOutlined } from '@ant-design/icons';
import { GetServerSidePropsContext } from 'next';
import dynamic from 'next/dynamic';
import { getSession } from 'next-auth/react';

const PageTitle = dynamic(() => import('@components/admin/ui/PageTitle'));

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
