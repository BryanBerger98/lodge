import { Layout } from 'antd';
import { Dispatch, FC, SetStateAction } from 'react';

import SiderMenu from './SiderMenu';

const { Sider: AntSider } = Layout;

type SiderProperties = {
	isCollapsed: boolean;
	setCollapsed: Dispatch<SetStateAction<boolean>>;
}

const Sider: FC<SiderProperties> = ({ isCollapsed, setCollapsed }) => {

	const handleCollapse = (value: boolean) => setCollapsed(value);

	return (
		<AntSider
			collapsed={ isCollapsed }
			trigger={ null }
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
				Lodge
			</div>
			<SiderMenu />
		</AntSider>
	);
};

export default Sider;
