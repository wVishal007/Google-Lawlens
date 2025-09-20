import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  Upload, 
  FileText, 
  User, 
  Users, 
  Calendar,
  BarChart3,
  X
} from 'lucide-react'
import { useAppDispatch } from '../../hooks/useAppDispatch'
import { useAppSelector } from '../../hooks/useAppSelector'
import { toggleSidebar } from '../../redux/slices/uiSlice'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
  { name: 'Upload Document', href: '/upload', icon: Upload },
  { name: 'Results', href: '/results', icon: FileText },
  { name: 'Profile', href: '/profile', icon: User },
  { name: 'Lawyers', href: '/lawyers', icon: Users },
  { name: 'Case Board', href: '/caseboard', icon: Calendar },
  { name: 'activity Board', href: '/activity', icon: Calendar },
]

export const Sidebar: React.FC = () => {
  const location = useLocation()
  const dispatch = useAppDispatch()
  const { sidebarOpen } = useAppSelector(state => state.ui)

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 md:hidden bg-black bg-opacity-50"
          onClick={() => dispatch(toggleSidebar())}
        />
      )}
      
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:inset-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 md:hidden">
          <span className="text-lg font-semibold">Menu</span>
          <button 
            onClick={() => dispatch(toggleSidebar())}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <nav className="p-4 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.href
            
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all duration-200 ${
                  isActive
                    ? 'bg-black text-white'
                    : 'text-gray-700 hover:bg-gray-100 hover:translate-x-1'
                }`}
                onClick={() => dispatch(toggleSidebar())}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </>
  )
}