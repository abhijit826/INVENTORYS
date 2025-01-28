 
import { useDispatch,  } from 'react-redux'
import { collapsedSidebar  ,toggleSidebar } from '../provider/slice/Sidebar.slice';
import { RiMenu2Fill } from "react-icons/ri";
import { FaSignOutAlt } from "react-icons/fa";
import { removeUser } from '../provider/slice/user.slice';
import { useNavigate } from 'react-router-dom';
const Header = () => {

  const disptach = useDispatch(); 

  const sidebarHandler = () => disptach(collapsedSidebar())
  const sidebarHandlerToggle = () => disptach(toggleSidebar())
  const navigate = useNavigate()


  const logoutHandler = ()=>{
    try {
          localStorage.removeItem("token");
      disptach(removeUser())
      navigate("/login");
    } catch (error:any) {
      console.log(error.message)
    }
  }

  return (
    <>
                <header className="py-4 shadow md px-10">
              <div className="nav flex items-center justify-between">
                <div className="btn"> 
            <button className='lg:hidden' onClick={sidebarHandlerToggle}><RiMenu2Fill className='text-4xl text-yellow-500' /> </button>
            <button className='hidden lg:flex' onClick={sidebarHandler}><RiMenu2Fill className='text-4xl text-yellow-500' /> </button></div>
        
            <div className="flex-1 text-center">
            <h1 className="text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-blue-500 font-sans">Inventory Management System</h1>
          </div>
        
        
            <div className="end">
            <button title='logout' className='hidden lg:flex' onClick={logoutHandler}><FaSignOutAlt className='text-2xl text-red-500' /> </button>
            </div>
              </div>
                </header>
    </>
  )
}

export default Header