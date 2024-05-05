import { useState } from 'react'
import { Outlet, Link } from 'react-router-dom'
import { Layout, Menu, theme, Input, Space, Card, Table, MenuProps, ConfigProvider, Radio, Switch } from 'antd';
import SubMenu from 'antd/es/menu/SubMenu';
import { MoonFilled, SunFilled, SunOutlined } from '@ant-design/icons';




function App() {

  const { Content, Footer } = Layout;


  const [currentTheme, setCurrentTheme] = useState('light');

  const ligthTheme = {

    colorPrimary: "#228b22", 
    colorTextBase: "black",
    colorBgBase: 'white',
    colorButton: '#3f51b5', 
    colorLink: 'black', 
    colorBgContainer: 'white',
    colorPrimaryTextActive: 'white',
    colorPrimaryBg: '#f5f5f5',

    borderRadius: 4,

  }

  const darkTheme = {

    colorPrimary: "#009688",
    colorTextBase: "white",
    colorBgBase: '#303030',
    colorTextLightSolid: '#cfd8dc',
    colorButton: "#90caf9", 
    colorLink: "white", 
    colorPrimaryBg: '#121212',
    colorPrimaryText: 'black',
    colorPrimaryTextActive: 'white',
    colorBgContainer: '#121212',

    borderRadius: 4,

  }

  const items = [
    {
      key: '1',
      label: 'Livro',
      link: '/book',
      newLink: '/create-book'
    },
    {
      key: '2',
      label: 'Emprestimo',
      link: '/loan',
      newLink: '/create-loan'
    },
    {
      key: '3',
      label: 'Estudante',
      link: '/student',
      newLink: '/create-student'
    },
  ];

  return (
    <ConfigProvider theme={{
      token: currentTheme === 'light' ? ligthTheme : darkTheme,
      components: {
          Menu: {
            colorPrimary: currentTheme === 'light' ? 'black' : 'white',
          },
          Button: {
            colorPrimary: currentTheme === 'light'? '#228b22' : '#009688',
          },
      }

    }}>
      <Layout style={{ height: '100vh', width: "100%" }}>
        <header style={{ display: 'flex', alignItems: 'center' }}>
          <Menu
           
            mode="horizontal"
            defaultSelectedKeys={['2']}
            style={{ flex: 1, minWidth: 0, border: 'none', background: 'transparent', }}
          >
            {items.map(item => (
              <SubMenu key={item.key} title={<Link to={item.link}>{item.label}</Link>}>
                <Menu.Item key={`${item.key}2`}><Link to={item.newLink}>Cadastro</Link></Menu.Item>
              </SubMenu>
            ))}


          </Menu>

          <Switch
            checked={currentTheme === 'dark'}
            onChange={(checked) => setCurrentTheme(checked ? 'dark' : 'light')}
            checkedChildren={<MoonFilled />} 
            unCheckedChildren={<SunFilled />}>
          </Switch>

        </header>
        <Content style={{ display: 'flex', justifyContent: 'center', width: '100%', padding: '0 0', background: currentTheme === 'light' ? ligthTheme.colorBgBase : darkTheme.colorBgBase }}>
          <div
            style={{
              minHeight: 280,
              width: '100%',
              padding: 24,
              borderRadius: '2px',
            }}
          >
            <Outlet />
          </div>
        </Content>
        <Footer style={{ position: 'fixed', width: '100%', bottom: 0, textAlign: 'center' }}>
          Rodi38 © 2024
        </Footer>
      </Layout>
    </ConfigProvider>



  )
}

export default App
