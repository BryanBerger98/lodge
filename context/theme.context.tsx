import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react';

export type ThemeValue = 'dark' | 'light';

type ThemeContextValue = {
	theme: ThemeValue;
	toggleTheme: (theme: ThemeValue) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);
export { ThemeContext };

export const useThemeContext = () => {
	const context = useContext(ThemeContext);
	if (context === null) {
		throw new Error('useThemeContext is null');
	}
	if (context === undefined) {
		throw new Error('useThemeContext was used outside of its Provider');
	}
	return context;
};

const ThemeContextProvider = ({ children }: { children: ReactNode }) => {
	const [ theme, setTheme ] = useState<ThemeValue>('light');

	const toggleTheme = useCallback(
		(value: ThemeValue) => {
			const mode = value ? value : theme === 'light' ? 'dark' : 'light';
			localStorage.setItem('theme', mode);
			setTheme(mode);
		},
		[ theme, setTheme ]
	);

	const contextValues = useMemo(
		() => ({
			theme,
			toggleTheme,
		}),
		[ theme, toggleTheme ]
	);

	return <ThemeContext.Provider value={ contextValues }>{ children }</ThemeContext.Provider>;
};

export default ThemeContextProvider;
