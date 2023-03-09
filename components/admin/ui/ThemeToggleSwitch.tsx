import { Switch } from '@headlessui/react';
import { useState } from 'react';
import { FiMoon, FiSun } from 'react-icons/fi';

import { useThemeContext } from '../../../context/theme.context';

const ThemeToggleSwitch = () => {
	const { theme, toggleTheme } = useThemeContext();
	const [ enabled, setEnabled ] = useState(theme === 'dark' ? true : false);

	const handleSwitchChange = (value: boolean) => {
		setEnabled(value);
		toggleTheme(value ? 'dark' : 'light');
	};

	return (
		<Switch
			checked={ enabled }
			className={ `${ enabled ? 'bg-primary-dark-default' : 'bg-secondary-light-shade' } relative inline-flex h-8 w-11 items-center rounded-full shadow-inner` }
			onChange={ handleSwitchChange }
		>
			<span className="sr-only">Switch to { theme === 'dark' ? 'light' : 'dark' } mode</span>
			<span
				className={ `${
					enabled ? 'translate-x-4 text-warning-dark-tint' : '-translate-x-1 text-warning-light-shade'
				} h-8 w-8 text-xl bg-white dark:bg-secondary-dark-shade drop-shadow rounded-full transform transition ease-in-out duration-200 flex items-center justify-center` }
			>
				{ !enabled && <FiSun /> }
				{ enabled ? <FiMoon /> : null }
			</span>
		</Switch>
	);
};

export default ThemeToggleSwitch;
