import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Space, Table, Tag, Typography } from 'antd';
import { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { FilterValue, SorterResult } from 'antd/es/table/interface';
import { useRouter } from 'next/router';

import { useAuthContext } from '@context/auth.context';
import { useUsersContext } from '@context/users/users.context';
import { ObjectId } from '@infrastructure/types/database.type';
import { getStringSlashedDateFromDate } from '@utils/date.util';
import { formatPhoneNumber } from '@utils/phone-number.util';
import { IUser } from 'types/user.type';

import UserTableDataMenu from './UserTableDataMenu';

const { Text } = Typography;

const UsersTable = () => {

	const router = useRouter();

	const { state: { loading, users, total }, fetchUsers } = useUsersContext();

	const { currentUser } = useAuthContext();

	const handleEditUser = (userId: string | ObjectId) => () => {
		router.push(`/admin/users/edit/${ userId }`);
	};

	const columns: ColumnsType<IUser> = [
		{
			title: 'Nom',
			dataIndex: 'username',
			key: 'username',
			sorter: true,
			sortDirections: [ 'ascend', 'descend' ],
			render: (_, record) => (
				<span
					style={ {
						display: 'flex',
						alignItems: 'center',
						gap: '0.5rem',
					} }
				>
					<Avatar
						icon={ <UserOutlined /> }
						size="large"
						src={ record.photo_url }
					/>
					<Space
						direction="vertical"
						size={ 0 }
					>
						<Text strong>{ record.username }</Text>
						{
							record.disabled ?
								<Tag
									color="warning"
									icon={ <LockOutlined /> }
								>
									Compte suspendu
								</Tag> : null
						}
					</Space>
				</span>
			),
			onCell: (data) => ({
				onClick: handleEditUser(data._id),
				style: { cursor: 'pointer' },
			}),
		},
		{
			title: 'Adresse email',
			dataIndex: 'email',
			key: 'email',
			sorter: true,
			sortDirections: [ 'ascend', 'descend' ],
			onCell: (data) => ({
				onClick: handleEditUser(data._id),
				style: { cursor: 'pointer' },
			}),
		},
		{
			title: 'Téléphone',
			dataIndex: 'phone_number',
			key: 'phone_number',
			render: (value) => value && value.length > 0 ? <span>{ formatPhoneNumber(value) }</span> : '',
			sorter: true,
			sortDirections: [ 'ascend', 'descend' ],
			onCell: (data) => ({
				onClick: handleEditUser(data._id),
				style: { cursor: 'pointer' },
			}),
		},
		{
			title: 'Rôle',
			dataIndex: 'role',
			key: 'role',
			render: (value) => value === 'admin' ? 'Administrateur' : value === 'user' ? 'Utilisateur' : '',
			sorter: true,
			sortDirections: [ 'ascend', 'descend' ],
			onCell: (data) => ({
				onClick: handleEditUser(data._id),
				style: { cursor: 'pointer' },
			}),
		  },
		  {
			title: 'Date de création',
			dataIndex: 'created_on',
			key: 'created_on',
			render: (value) => getStringSlashedDateFromDate(value, 'fr'),
			sorter: true,
			sortDirections: [ 'ascend', 'descend' ],
			defaultSortOrder: 'descend',
			onCell: (data) => ({
				onClick: handleEditUser(data._id),
				style: { cursor: 'pointer' },
			}),
		  },
		  {
			title: 'Dernière connexion',
			dataIndex: 'last_login_on',
			key: 'last_login_on',
			sorter: true,
			sortDirections: [ 'ascend', 'descend' ],
			onCell: (data) => ({
				onClick: handleEditUser(data._id),
				style: { cursor: 'pointer' },
			}),
		  },
		  {
			title: 'Actions',
			dataIndex: 'actions',
			key: 'actions',
			align: 'center',
			render: (_, record) => (
				<UserTableDataMenu
					currentUser={ currentUser }
					user={ record }
				/>
			),
		  },
	];

	const handleTablePaginationChange = (pagination: TablePaginationConfig, filters: Record<string, FilterValue | null>, sorter: SorterResult<IUser> | SorterResult<IUser>[]) => {
		fetchUsers({
			limit: pagination.pageSize || 10,
			skip: pagination.current && pagination.pageSize ? ((pagination.current - 1) * pagination.pageSize) : 0,
			sort: {
				field: (sorter as SorterResult<IUser>).columnKey?.toString() || 'created_on',
				direction: (sorter as SorterResult<IUser>).order === 'ascend' ? 1 : -1,
			},
		});
	};

	return(
		<Table
			columns={ columns }
			dataSource={ users }
			loading={ loading === 'pending' ? true : false }
			pagination={ {
				defaultCurrent: 1,
				defaultPageSize: 10,
				hideOnSinglePage: false,
				pageSizeOptions: [ 10, 25, 50 ],
				total,
				showSizeChanger: true,
			} }
			rowKey="_id"
			onChange={ handleTablePaginationChange }
		/>
	);
};

export default UsersTable;
