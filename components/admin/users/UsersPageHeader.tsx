import { PlusOutlined, TeamOutlined } from '@ant-design/icons';
import { Button, Col, Row } from 'antd';
import { useRouter } from 'next/router';
import { FC } from 'react';

import useLoadReduxTable from '@hooks/useLoadReduxTable';
import { fetchUsers, selectUsersState, setUsersTableConfig } from '@store/users.slice';

import SearchField from '../forms/SearchField';
import PageTitle from '../ui/PageTitle';

type UsersPageHeaderProperties = {
	total: number;
}

const UsersPageHeader: FC<UsersPageHeaderProperties> = ({ total }) => {

	const router = useRouter();

	const { loadTable: loadUsersTable } = useLoadReduxTable({
		dataList: [],
		dataFetcher: fetchUsers,
		stateSelector: selectUsersState,
		tableConfigSetter: setUsersTableConfig,
	});

	const handleCreateNewUser = () => {
		router.push('/admin/users/edit');
	};

	const handleSearchUsers = (value: string) => {
		loadUsersTable({ searchString: value });
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
