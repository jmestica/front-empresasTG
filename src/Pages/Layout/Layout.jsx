import './Layout.css'
import Sidebar from './../../Components/Sidebar/Sidebar'
import { Outlet } from 'react-router-dom'


function Layout() {
  return (
    <div className="layout-container">

        <div>
            <Sidebar/>            
        </div>

        <div className="content">
            <Outlet/>
        </div>

    </div>
  )
}

export default Layout