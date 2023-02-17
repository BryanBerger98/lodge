import { Layout } from 'antd';
import { Dispatch, FC, SetStateAction } from 'react';
import SiderMenu from './SiderMenu';

const { Sider: AntSider } = Layout;

type SiderProperties = {
	collapsed: boolean;
	setCollapsed: Dispatch<SetStateAction<boolean>>;
}

const Sider: FC<SiderProperties> = ({ collapsed, setCollapsed }) => {

    return (
        <AntSider
            collapsible
            collapsed={ collapsed }
            onCollapse={ (value) => setCollapsed(value) }
        >
            <div
                style={ {
                    height: 32,
                    margin: 16,
                    background: 'rgba(255, 255, 255, 0.2)',
                } }
            />
            <SiderMenu />
        </AntSider>
    );
};

export default Sider;
