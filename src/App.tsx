import { useState } from 'react'
import { Outlet, Link } from 'react-router-dom'
import { Layout, Menu, theme, Input, Space, Card, Table, MenuProps } from 'antd';
import type { SearchProps } from 'antd/es/input/Search';
import SubMenu from 'antd/es/menu/SubMenu';




function App() {

  const { Header, Content, Footer } = Layout;


  const items = [
    {
      key: '1',
      label: 'Book',
      link: '/book',
      newLink: '/create-book'
    },
    {
      key: '2',
      label: 'Loan',
      link: '/loan',
      newLink: '/create-loan'
    },
    {
      key: '3',
      label: 'Student',
      link: '/student',
      newLink: '/create-student'
    },
  ];

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();




  return (
    <Layout style={{ gap: '25px', backgroundColor: 'white' }}>
      <Header style={{ backgroundColor: 'white', display: 'flex', alignItems: 'center' }}>
        <div className="demo-logo" />
        <Menu
    theme="light"
    mode="horizontal"
    defaultSelectedKeys={['2']}
    style={{ flex: 1, minWidth: 0 }}
  >
    {items.map(item => (
      <SubMenu key={item.key} title={<Link to={item.link}>{item.label}</Link>}>
        <Menu.Item key={`${item.key}2`}><Link to={item.newLink}>Cadastro</Link></Menu.Item>
      </SubMenu>
    ))}
  </Menu>
      </Header>
      <Content style={{ display: 'flex', justifyContent: 'center', width: '100%', padding: '0 0', }}>
        <div
          style={{
            background: colorBgContainer,
            minHeight: 280,
            width: '100%',
            padding: 24,
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet />
        </div>
      </Content>
      <Footer style={{ position: 'fixed', width: '100%' ,bottom: 0, textAlign: 'center' }}>
        Rodi38 © 2024
      </Footer>
    </Layout>
  )
}

export default App
