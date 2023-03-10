import { SearchOutlined } from '@ant-design/icons';
import { Input } from 'antd';
import { BaseSyntheticEvent, FC } from 'react';

type SearchFieldProperties = {
	onSearchElements: (searchString: string) => void;
	placeholder?: string;
};

const DEBOUNCE_DELAY = 400;

const SearchField: FC<SearchFieldProperties> = ({ onSearchElements, placeholder = 'Rechercher...' }) => {
	let delay: NodeJS.Timeout;

	const handleClearDelay = () => {
		clearTimeout(delay);
	};

	const handleSearch = (event: BaseSyntheticEvent) => {

		const value: string = event.currentTarget.value.trim();
		handleClearDelay();
		delay = setTimeout(() => {
			onSearchElements(value);
		}, DEBOUNCE_DELAY);
	};


	return (
		<Input
			className="drop-shadow"
			placeholder={ placeholder }
			prefix={ <SearchOutlined /> }
			size="middle"
			type="search"
			onChange={ handleSearch }
			onKeyDown={ handleClearDelay }
		/>
	);
};

export default SearchField;
