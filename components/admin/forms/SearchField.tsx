import { BaseSyntheticEvent, FC } from 'react';
import { FiSearch } from 'react-icons/fi';

type SearchFieldProperties = {
	onSearchElements: (searchString: string) => void;
	placeholder?: string;
};

const SearchField: FC<SearchFieldProperties> = ({ onSearchElements, placeholder }) => {
    let delay: NodeJS.Timeout;

    const onSearch = (event: BaseSyntheticEvent) => {
        const value: string = event.currentTarget.value.trim();
        clearDelay();
        delay = setTimeout(() => {
            onSearchElements(value);
        }, 400);
    };

    const clearDelay = () => {
        clearTimeout(delay);
    };

    return (
        <div className="relative text-sm">
            <input
                type="search"
                placeholder={ placeholder ?? 'Rechercher...' }
                className="bg-gray-100 dark:bg-gray-900 placeholder:text-gray-400 dark:text-gray-50 p-2 rounded-md pl-8 w-full drop-shadow"
                onKeyDown={ clearDelay }
                onChange={ onSearch }
            />
            <FiSearch className="absolute text-base text-gray-400 left-2 inset-y-0 my-auto" />
        </div>
    );
};

export default SearchField;
