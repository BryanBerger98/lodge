export type SortParams = Record<string, -1 | 1>;

export type QueryParameters = {
	sortParams?: SortParams;
	skip?: number;
	limit?: number;
	search?: string;
}

export type FetchParameters = {
	sort: {
		field: string;
		direction: -1 | 1;
	};
	skip: number;
	limit: number;
	searchString?: string;
}
