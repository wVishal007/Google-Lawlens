import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Scale, User, LogOut, Menu } from 'lucide-react'
import { Button } from '../ui/Button'
import { useAppDispatch } from '../../hooks/useAppDispatch'
import { useAppSelector } from '../../hooks/useAppSelector'
import { logout } from '../../redux/slices/authSlice'
import { toggleSidebar } from '../../redux/slices/uiSlice'

export const Navbar: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { isAuthenticated, user } = useAppSelector(state => state.auth)

  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
  }

  const isLandingPage = location.pathname === '/'

  if (isLandingPage) {
    return (
      <nav className="absolute top-0 w-full z-50 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link to="/" className="flex items-center space-x-2 group">
              <Scale className="w-8 h-8 text-black group-hover:scale-110 transition-transform duration-300" />
              <span className="text-2xl font-bold text-black">LawLens</span>
            </Link>
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard">
                    <Button variant="ghost">Dashboard</Button>
                  </Link>
                  <Button variant="outline" onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="ghost">Login</Button>
                  </Link>
                  <Link to="/signup">
                    <Button variant="primary">Sign Up</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => dispatch(toggleSidebar())}
              className="md:hidden"
            >
              <Menu className="w-5 h-5" />
            </Button>
            <Link to="/" className="flex items-center space-x-2 group">
              <Scale className="w-6 h-6 text-black group-hover:scale-110 transition-transform duration-300" />
              <span className="text-xl font-bold text-black">LawLens</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link to="/profile">
                  <Button variant="ghost" size="sm">
                    <User className="w-4 h-4 mr-2" />
                    {user?.name}
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <Link to="/login">
                <Button variant="primary" size="sm">Login</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}