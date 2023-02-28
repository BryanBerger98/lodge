import { useState, memo, ReactNode } from 'react';
import { FiArrowDown, FiArrowUp } from 'react-icons/fi';

import { LoadingState } from '../../../types/loading.type';

import { TableField, TableSort } from './table.type';
import TablePageSelector from './TablePageSelector';

type TableProperties = {
	tableName: string;
	dataLoading: LoadingState;
	dataCount: number;
	fields: TableField[],
	defaultLimit: number;
	defaultSkip: number;
	defaultSort: TableSort;
	onReloadTable: (limit: number, skip: number, sort: TableSort) => void;
	children?: ReactNode;
};

const Table = ({ tableName, dataLoading, dataCount, fields, defaultLimit, defaultSkip, defaultSort, onReloadTable, children = null }: TableProperties) => {

	const [ limit, setLimit ] = useState(defaultLimit);
	const [ skip, setSkip ] = useState(defaultSkip);
	const [ sort, setSort ] = useState<TableSort>(defaultSort);

	const onChangeSort = (field: string, direction: 1 | -1) => {
		const sort = {
			field,
			direction,
		};
		setSort(sort);
		onReloadTable(limit, skip, sort);
		localStorage.setItem(tableName, JSON.stringify({
			limit,
			skip,
			sort,
		}));
	};

	const onChangePagination = ({ limit, skip }: { limit: number, skip: number }) => {
		setLimit(limit);
		setSkip(skip);
		onReloadTable(limit, skip, sort);
		localStorage.setItem(tableName, JSON.stringify({
			limit,
			skip,
			sort,
		}));
	};

	return(
		<>
			<table className="w-full text-sm">
				<thead>
					<tr>
						{
							fields.map((field, index) => (
								field.sortable ?
									<th
										key={ field.name + '-' + index }
										className={ `text-center font-${ field.fontStyle ? field.fontStyle : 'semibold' } border-b border-light-400 dark:border-light-700 py-2 hover:cursor-pointer` }
										onClick={ () => onChangeSort(field.name, sort.direction === 1 ? -1 : 1) }
									>
										<span className={ `flex gap-1 items-center justify-${ field.align === 'left' ? 'start' : field.align === 'right' ? 'end' : 'center' }` }>
											<span>{ field.title }</span>
											{ sort.field === field.name && sort.direction === 1 && <FiArrowUp /> }
											{ sort.field === field.name && sort.direction === -1 && <FiArrowDown /> }
										</span>
									</th>
									:
									<th
										key={ field.name + '-' + index }
										className={ `font-${ field.fontStyle ? field.fontStyle : 'semibold' } border-b border-light-400 dark:border-light-700 py-2` }
									>
										<span className={ `flex gap-1 items-center justify-${ field.align === 'left' ? 'start' : field.align === 'right' ? 'end' : 'center' }` }>
											<span>{ field.title }</span>
										</span>
									</th>
							))
						}
					</tr>
				</thead>
				<tbody>
					{ (dataLoading === 'succeded' || dataLoading === 'idle') && children }
					{
						dataLoading === 'pending' &&
                        Array.from(Array(limit), (element, index) => (
                        	<tr
                        		key={ 'table-pulse' + element + index }
		className="animate-pulse"
	>
                        		<td className="py-3 border-b-[0.5px] border-light-300 dark:border-light-700">
                        			<div className="w-44 bg-light-300 dark:bg-light-700 h-5 rounded-md">

 </div>
 </td>
                        		<td className="py-3 border-b-[0.5px] border-light-300 dark:border-light-700">
                        			<div className="w-64 bg-light-300 dark:bg-light-700 h-5 rounded-md">

 </div>
 </td>
                        		<td className="py-3 border-b-[0.5px] border-gray-300 dark:border-gray-700">
                        			<div className="w-36 bg-light-300 dark:bg-light-700 h-5 rounded-md">

 </div>
 </td>
                        		<td className="py-2 border-b-[0.5px] border-gray-300 dark:border-gray-700">
                        			<div className="w-28 bg-light-300 dark:bg-light-700 h-5 rounded-md">

 </div>
 </td>
                        		<td className="py-2 border-b-[0.5px] border-gray-300 dark:border-gray-700">
                        			<div className="w-28 bg-light-300 dark:bg-light-700 h-5 rounded-md">

 </div>
 </td>
                        		<td className="py-2 border-b-[0.5px] border-gray-300 dark:border-gray-700 text-center">
                        			<div className="w-10 mx-auto bg-light-300 dark:bg-light-700 h-5 rounded-md">

 </div>
 </td>
 </tr>
                        ))
					}
				</tbody>
			</table>
			{ (dataLoading === 'succeded' || dataLoading === 'idle') &&
				<TablePageSelector
					arrayLength={ dataCount }
					limit={ limit }
					skip={ skip }
					onChange={ onChangePagination }
				/> }
		</>
	);
};

export default memo(Table);
