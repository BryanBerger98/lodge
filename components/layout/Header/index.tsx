import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Layout } from 'antd';
import { GlobalToken } from 'antd/es/theme';
import { createElement, Dispatch, FC, SetStateAction } from 'react';

const { Header: AntHeader } = Layout;

type HeaderProperties = {
	token: GlobalToken;
	collapsed: boolean;
	setCollapsed: Dispatch<SetStateAction<boolean>>;
}

const Header: FC<HeaderProperties> = ({ token, collapsed, setCollapsed }) => {

    const { colorBgContainer } = token;

    return (
        <AntHeader
            style={ {
                padding: 0,
                background: colorBgContainer,
            } }
        >
            {
                createElement(
                    collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
                    {
                        style: {
                            padding: '0 24px',
                            fontSize: '18px',
                            lineHeight: '64px',
                            cursor: 'pointer',
                        },
                        onClick: () => setCollapsed(!collapsed),
                    }
                )
            }
        </AntHeader>
    );
};

export default Header;
