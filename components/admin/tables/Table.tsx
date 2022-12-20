import { Fragment, useState, memo, ReactNode } from 'react';
import { FiArrowDown, FiArrowUp } from 'react-icons/fi';
import TablePageSelector from './TablePageSelector';

export type TableSort = {
	field: string;
	direction: 1 | -1;
};

type TableField = {
	title: string;
	name: string;
	sortable: boolean,
	fontStyle: 'bold' | 'semibold' | 'medium' | 'light',
	align: 'left' | 'right' | 'center',
};

type TableProperties = {
	tableName: string;
	dataLoading: boolean;
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
        <Fragment>
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
                                            <span>{field.title}</span>
                                            {sort.field === field.name && sort.direction === 1 && <FiArrowUp />}
                                            {sort.field === field.name && sort.direction === -1 && <FiArrowDown />}
                                        </span>
                                    </th>
                                    :
                                    <th
                                        key={ field.name + '-' + index }
                                        className={ `font-${ field.fontStyle ? field.fontStyle : 'semibold' } border-b border-light-400 dark:border-light-700 py-2` }
                                    >
                                        <span className={ `flex gap-1 items-center justify-${ field.align === 'left' ? 'start' : field.align === 'right' ? 'end' : 'center' }` }>
                                            <span>{field.title}</span>
                                        </span>
                                    </th>
                            ))
                        }
                    </tr>
                </thead>
                <tbody>
                    {!dataLoading && children}
                    {
                        dataLoading &&
                        Array.from(Array(limit), (element, index) => (
                            <tr
                                className="animate-pulse"
                                key={ 'table-pulse' + element + index }
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
            { !dataLoading &&
				<TablePageSelector
				    arrayLength={ dataCount }
				    limit={ limit }
				    skip={ skip }
				    onChange={ onChangePagination }
				/>
            }
        </Fragment>
    );
};

export default memo(Table);
