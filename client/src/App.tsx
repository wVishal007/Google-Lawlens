import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from './redux/store'

// Layout Components
import { Navbar } from './components/layout/Navbar'
import { Sidebar } from './components/layout/Sidebar'

// Pages
import { Landing } from './pages/Landing'
import { Upload } from './pages/Upload'
import { Results } from './pages/Results'
import { Login } from './pages/Login'
import { Signup } from './pages/Signup'
import { Profile } from './pages/Profile'
import { LawyerManagement } from './pages/Lawyers'
import { Dashboard } from './pages/Dashboard'
import { CaseBoard } from './pages/CaseBoard'

// Hooks
import { useAppSelector } from './hooks/useAppSelector'
import { ActivitiesBoard } from './pages/ActivityBoard'

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAppSelector(state => state.auth)
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />
}

// Layout Component for authenticated pages
// Layout Component for authenticated pages
const AuthenticatedLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar /> {/* Render once, Sidebar handles mobile vs desktop */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  )
}


// App Routes Component
const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<><Navbar /><Landing /></>} />
        <Route path="/login" element={<><Navbar /><Login /></>} />
        <Route path="/signup" element={<><Navbar /><Signup /></>} />
        
        {/* Protected Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <AuthenticatedLayout>
              <Dashboard />
            </AuthenticatedLayout>
          </ProtectedRoute>
        } />
        <Route path="/upload" element={
          <ProtectedRoute>
            <AuthenticatedLayout>
              <Upload />
            </AuthenticatedLayout>
          </ProtectedRoute>
        } />
        <Route path="/results" element={
          <ProtectedRoute>
            <AuthenticatedLayout>
              <Results />
            </AuthenticatedLayout>
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <AuthenticatedLayout>
              <Profile />
            </AuthenticatedLayout>
          </ProtectedRoute>
        } />
        <Route path="/lawyers" element={
          <ProtectedRoute>
            <AuthenticatedLayout>
              <LawyerManagement />
            </AuthenticatedLayout>
          </ProtectedRoute>
        } />
        <Route path="/caseboard" element={
          <ProtectedRoute>
            <AuthenticatedLayout>
              <CaseBoard />
            </AuthenticatedLayout>
          </ProtectedRoute>
        } />
        <Route path="/activity" element={
          <ProtectedRoute>
            <AuthenticatedLayout>
              <ActivitiesBoard />
            </AuthenticatedLayout>
          </ProtectedRoute>
        } />
        
        {/* Catch all route - redirect to landing */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  )
}

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
        <div className="App">
          <AppRoutes />
        </div>
      </PersistGate>
    </Provider>
  )
}

export default App