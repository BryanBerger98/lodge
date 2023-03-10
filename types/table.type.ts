export type TableSort = {
	field: string;
	direction: 1 | -1;
};

export type TableConfig = {
	limit: number;
	skip: number;
	sort: TableSort;
}

export type TableConfigWithSearch = TableConfig & {
	search?: string;
}

export type TableField = {
	title: string;
	name: string;
	sortable: boolean,
	fontStyle: 'bold' | 'semibold' | 'medium' | 'light',
	align: 'left' | 'right' | 'center',
};
