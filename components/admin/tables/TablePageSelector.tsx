import { ChangeEventHandler, memo, useEffect, useState } from 'react';

type TablePageSelectorProperties = {
	arrayLength: number;
	limit: number;
	skip: number;
	onChange: ({ limit, skip }: { limit: number, skip: number }) => void;
}

type PaginationButton = {
	number: number;
	skip: number;
}

const TablePageSelector = ({ arrayLength, limit, skip, onChange }: TablePageSelectorProperties) => {

    const [ buttons, setButtons ] = useState<PaginationButton[]>([]);

    const onChangeLimit: ChangeEventHandler<HTMLSelectElement> = (event) => {
        const { value } = event.target;
        onChange({
            limit: +value,
            skip,
        });
    };

    const onChangePage: ChangeEventHandler<HTMLSelectElement> = (event) => {
        const { value } = event.target;
        onChange({
            limit,
            skip: +value,
        });
    };

    useEffect(() => {
        const buttonsCount = Math.ceil(arrayLength / limit);
        const btns = [];
        for (let index = 0; index < buttonsCount; index++) {
            btns.push({
                skip: limit * index,
                number: index + 1,
            });
        }
        setButtons([ ...btns ]);
    }, [ limit, skip, arrayLength ]);

    return (
        <div className="flex items-center justify-between mt-5">
            {buttons && buttons.length > 1 && (
                <select
                    id="usersPerPageSelect"
                    value={ skip }
                    className="appearance-none h-9 rounded-md px-4 drop-shadow text-sm text-primary-light-default dark:text-primary-dark-default bg-secondary-light-default dark:bg-secondary-dark-tint"
                    onChange={ onChangePage }
                >
                    {
                        buttons.map((button) => (
                            <option
                                key={ `table-page-selector-option-${ button.number }` }
                                value={ button.skip }
                            >Page n°{ button.number }</option>
                        ))
                    }
                </select>
            )}
            <select
                id="usersPerPageSelect"
                value={ limit }
                className="appearance-none h-9 rounded-md px-4 drop-shadow text-sm text-primary-light-default dark:text-primary-dark-default bg-secondary-light-default dark:bg-secondary-dark-tint ml-auto"
                onChange={ onChangeLimit }
            >
                <option value="10">10 / page</option>
                <option value="25">25 / page</option>
                <option value="50">50 / page</option>
            </select>
        </div>
    );
};

export default memo(TablePageSelector);
