import { useEffect, useState } from 'react';

type Breakpoint = 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

const useBreakpoints = () => {

	const [ currentBreakpoint, setCurrentBreakpoint ] = useState<Breakpoint>('xxs');
	const [ isDeviceMobile, setIsDeviceMobile ] = useState<boolean>(true);

	const handleResizeWindow = () => {
		const screenWidth = window.screen.width;
		if (screenWidth < 480 && currentBreakpoint !== 'xxs') {
			setCurrentBreakpoint('xxs');
			setIsDeviceMobile(true);
		}
		if (screenWidth >= 480 && screenWidth < 576 && currentBreakpoint !== 'xs') {
			setCurrentBreakpoint('xs');
			setIsDeviceMobile(true);
		}
		if (screenWidth >= 576 && screenWidth < 768 && currentBreakpoint !== 'sm') {
			setCurrentBreakpoint('sm');
			setIsDeviceMobile(true);
		}
		if (screenWidth >= 768 && screenWidth < 992 && currentBreakpoint !== 'md') {
			setIsDeviceMobile(true);
			setCurrentBreakpoint('md');
		}
		if (screenWidth >= 992 && screenWidth < 1200 && currentBreakpoint !== 'lg') {
			setCurrentBreakpoint('lg');
			setIsDeviceMobile(false);
		}
		if (screenWidth >= 1200 && screenWidth < 1600 && currentBreakpoint !== 'xl') {
			setCurrentBreakpoint('xl');
			setIsDeviceMobile(false);
		}
		if (screenWidth >= 1600 && currentBreakpoint !== 'xxl') {
			setCurrentBreakpoint('xxl');
			setIsDeviceMobile(false);
		}
	};

	useEffect(() => {
		setIsDeviceMobile(window.screen.width < 768);
		window.addEventListener('resize', handleResizeWindow);
		return () => window.removeEventListener('resize', handleResizeWindow);
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return {
		currentBreakpoint,
		isDeviceMobile,
	};

};

export default useBreakpoints;
