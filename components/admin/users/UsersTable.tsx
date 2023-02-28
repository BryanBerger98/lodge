import { Table } from 'antd';
import { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { FilterValue, SorterResult } from 'antd/es/table/interface';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';

import { useAuthContext } from '@context/auth.context';
import useLoadUsersTable from '@hooks/useLoadUsersTable';
import { ObjectId } from '@infrastructure/types/database.type';
import { selectUsersState } from '@store/users.slice';
import { getStringSlashedDateFromDate } from '@utils/date.util';
import { formatPhoneNumber } from '@utils/phone-number.util';
import { IUser } from 'types/user.type';

import UserTableDataMenu from './UserTableDataMenu';

type UserTableProperties = {
	searchString?: string;
	usersList: IUser[];
	usersCount: number;
};

const UsersTable = ({ searchString, usersList, usersCount }: UserTableProperties) => {

	const router = useRouter();

	const { loadUsersTable, DEFAULT_LIMIT, DEFAULT_SKIP, DEFAULT_SORT } = useLoadUsersTable(usersList);
	const { loading } = useSelector(selectUsersState);

	const { currentUser } = useAuthContext();

	const columns: ColumnsType<IUser> = [
		{
			title: 'Nom',
			dataIndex: 'username',
			key: 'username',
			sorter: true,
			sortDirections: [ 'ascend', 'descend' ],
		},
		{
			title: 'Adresse email',
			dataIndex: 'email',
			key: 'email',
			sorter: true,
			sortDirections: [ 'ascend', 'descend' ],
		},
		{
			title: 'Téléphone',
			dataIndex: 'phone_number',
			key: 'phone_number',
			render: (value) => value && value.length > 0 ? <span>{ formatPhoneNumber(value) }</span> : '',
			sorter: true,
			sortDirections: [ 'ascend', 'descend' ],
		},
		{
			title: 'Rôle',
			dataIndex: 'role',
			key: 'role',
			render: (value) => value === 'admin' ? 'Administrateur' : value === 'user' ? 'Utilisateur' : '',
			sorter: true,
			sortDirections: [ 'ascend', 'descend' ],
		  },
		  {
			title: 'Date de création',
			dataIndex: 'created_on',
			key: 'created_on',
			render: (value) => getStringSlashedDateFromDate(value, 'fr'),
			sorter: true,
			sortDirections: [ 'ascend', 'descend' ],
			defaultSortOrder: 'descend',
		  },
		  {
			title: 'Dernière connexion',
			dataIndex: 'last_login_on',
			key: 'last_login_on',
			sorter: true,
			sortDirections: [ 'ascend', 'descend' ],
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
		loadUsersTable({
			limit: pagination.pageSize,
			skip: pagination.current,
			sort: {
				field: (sorter as SorterResult<IUser>).columnKey?.toString() || 'created_on',
				direction: (sorter as SorterResult<IUser>).order === 'ascend' ? 1 : -1,
			},
			searchString,
		});
	};

	const handleEditUser = (userId: string | ObjectId) => () => {
		router.push(`/admin/users/edit/${ userId }`);
	};

	return(
		<Table
			columns={ columns }
			dataSource={ usersList }
			loading={ loading === 'pending' ? true : false }
			pagination={ {
				defaultCurrent: 1,
				defaultPageSize: 10,
				hideOnSinglePage: true,
				pageSizeOptions: [ 10, 25, 50 ],
				total: usersCount,
			} }
			rowKey="_id"
			onChange={ handleTablePaginationChange }
		/>
	);
};

export default UsersTable;
