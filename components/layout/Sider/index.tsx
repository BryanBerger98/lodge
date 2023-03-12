import { Layout } from 'antd';
import { CSSProperties, Dispatch, FC, SetStateAction, useRef } from 'react';

import useBreakpoints from '@hooks/useBreakpoints';
import useOnClickOutside from '@hooks/useOnClickOutside';

import SiderMenu from './SiderMenu';

const { Sider: AntSider } = Layout;

type SiderProperties = {
	isCollapsed: boolean;
	setCollapsed: Dispatch<SetStateAction<boolean>>;
}

const Sider: FC<SiderProperties> = ({ isCollapsed, setCollapsed }) => {

	const siderReference = useRef<HTMLDivElement | null>(null);

	const handleCollapse = (value: boolean) => setCollapsed(value);

	const { isDeviceMobile } = useBreakpoints();

	const handleClickOutside = () => {
		if (isDeviceMobile) {
			setCollapsed(true);
		}
	};

	useOnClickOutside(siderReference, handleClickOutside);

	const mobileStyle: CSSProperties = isDeviceMobile ? {
		position: 'fixed',
		left: 0,
		top: 0,
		bottom: 0,
		zIndex: 50,
	} : {};

	return (
		<AntSider
			collapsed={ isCollapsed }
			collapsedWidth={ isDeviceMobile ? 0 : 80 }
			ref={ siderReference }
			style={ {
				overflow: 'auto',
				height: '100vh',
				...mobileStyle,
			  } }
			trigger={ null }
			zeroWidthTriggerStyle={ { display: 'none' } }
			collapsible
			onCollapse={ handleCollapse }
		>
			<div
				style={ {
					padding: '0.8rem',
					margin: 16,
					background: 'rgba(255, 255, 255, 0.2)',
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					color: '#fff',
					fontSize: '1rem',
				} }
			>
				{ isCollapsed ? 'L' : 'Lodge' }
			</div>
			<SiderMenu />
		</AntSider>
	);
};

export default Sider;
