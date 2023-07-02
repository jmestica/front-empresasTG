import { NavLink } from 'react-router-dom';
import './Sidebar.css'
import { MdPeopleOutline } from "react-icons/md";
import { GoSearch } from "react-icons/go";
import {LuEdit2} from "react-icons/lu";
import {IoPersonAddOutline} from "react-icons/io5";


function Sidebar() {
  return (
    <div className="container">
        <div className="logo">
          <MdPeopleOutline className='logo-icon'/>
          empresas tg
        </div>

      <div className="menu">
        <p className='section-name'>EMPRESAS</p>

        <NavLink to="/" className="sidebar-navlink">
          <GoSearch className='sidebar-icon'/>
          <p className='sidebar-item'>buscador</p>
        </NavLink>


        <NavLink to="editor" className="sidebar-navlink">
          <LuEdit2 className='sidebar-icon'/>
          <p className='sidebar-item'>editar datos</p>
        </NavLink>

        <NavLink to="add" className="sidebar-navlink">
          <IoPersonAddOutline className='sidebar-icon'/>
          <p className='sidebar-item'>agregar empresa</p>
        </NavLink>

      </div>

    </div>
  )
}

export default Sidebar