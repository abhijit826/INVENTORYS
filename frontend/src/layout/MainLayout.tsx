 
import { Sidebar, Menu, MenuItem  } from 'react-pro-sidebar';
import { useDispatch, useSelector } from 'react-redux';
import { SidebarSlicePath, toggleSidebar } from '../provider/slice/Sidebar.slice';
import { AiOutlineDashboard } from "react-icons/ai";
import { FiUser } from "react-icons/fi";
import { IoIosArrowDropright, IoIosArrowDropleft } from "react-icons/io";
import { TbTransactionRupee } from "react-icons/tb";
import { Link } from 'react-router-dom';
const MainLayout = ({ children }:{children:React.ReactNode}) => {
    const selector = useSelector(SidebarSlicePath) 
    const dispatch = useDispatch()
  


  return (
    <>
    
                    <div className="flex items-start lg:gap-x-4 text-pink-500 ">
              <Sidebar collapsed={selector.collapsed} breakPoint="lg" toggled={selector.toggle} >
                  <Menu >
                      {/* <SubMenu  label="Charts">
                          <MenuItem> Pie charts </MenuItem>
                          <MenuItem> Line charts </MenuItem>
                      </SubMenu> */}
                      <MenuItem className="lg:hidden" onClick={() => dispatch(toggleSidebar())} > {selector.toggle ? <IoIosArrowDropright className="text-2xl" />:<IoIosArrowDropleft className="text-2xl" />} </MenuItem>

                      <MenuItem component={<Link to="/" />} icon={<AiOutlineDashboard  className="text-4xl text-red-500" />}  className="py-5 text-2xl"> Performance </MenuItem>
        
            <MenuItem component={<Link to="/orders" />} icon={<TbTransactionRupee className="text-4xl text-green-500" />} className="py-5 text-xl" > Orders & Invoice </MenuItem>

            <MenuItem component={<Link to="/user" />} icon={<FiUser className="text-4xl text-blue-500" />} className="py-5 text-2xl" > Users </MenuItem>
                  </Menu>
              </Sidebar>
                                <div className="w-full">
                  {children}
                                </div>


                    </div>
    </>
  )
}

export default MainLayout