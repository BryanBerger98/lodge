import { PlusOutlined, TeamOutlined } from '@ant-design/icons';
import { Button, Col, Row } from 'antd';
import { useRouter } from 'next/router';

import { useUsersContext } from '@context/users/users.context';

import SearchField from '../forms/SearchField';
import PageTitle from '../ui/PageTitle';

const UsersPageHeader = () => {

	const router = useRouter();

	const { state: { total }, fetchUsers } = useUsersContext();

	const handleCreateNewUser = () => {
		router.push('/admin/users/edit');
	};

	const handleSearchUsers = (value: string) => {
		fetchUsers({ searchString: value });
	};

	return (
		<>
			<PageTitle><TeamOutlined /><span>{ total } Utilisateur{ total > 1 ? 's' : '' }</span></PageTitle>
			<Row>
				<Col span={ 12 }>
					<SearchField onSearchElements={ handleSearchUsers } />
				</Col>
				<Col
					span={ 12 }
					style={ {
						display: 'flex',
						justifyContent: 'flex-end',
					} }
				>
					<Button
						htmlType="button"
						icon={ <PlusOutlined /> }
						style={ { marginBottom: 16 } }
						type="primary"
						onClick= { handleCreateNewUser }
					>
						Nouveau
					</Button>
				</Col>
			</Row>
		</>
	);
};

export default UsersPageHeader;
