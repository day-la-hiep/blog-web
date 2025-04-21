import { BrowserRouter, Route, Routes } from 'react-router-dom'
import DashBoard from './pages/cms/dashboard/Page'
import AdminPage from '@/pages/cms/AdminPage'
import MainContent from './pages/blog/home-page/MainContent'
import CategoryManagementPage from './pages/cms/categoryManagement/Page'
import ViewDetailPostPage from '@/pages/cms/postManagement/viewPostDetail/Page'
import ViewPostPage from '@/pages/cms/postManagement/viewpost/Page'
import { Toaster } from 'sonner'
import UserManagementPage from './pages/cms/userManagement/Page'
import RoleManagementPage from '@/pages/cms/roleManagement/Page'
import HomepageLayout from './pages/blog/Layout'
import Page from './pages/blog/post-detail/Page'
import AdminLogin from './pages/cms/login/Login'
import { AuthProvider } from './hooks/AuthProvider'
import HomePageRoutes from './routes/HomePageRoutes'
import UserSettingPage from './pages/blog/settingsPage/Page'
import { adminPath, adminDashboardPath, adminUsersPath, adminPostsPath, adminCategoriesPath, adminRoleManagePath, adminLoginPath, blogPath, blogPostPath, userSettingPath } from './RouteDefinition'
function App() {

  return (
    <>
      <Toaster>

      </Toaster>
      <BrowserRouter >

        <AuthProvider >
          <Routes>
            <Route path={adminPath} element={<AdminPage />} >
              <Route path={adminDashboardPath} element={<DashBoard />} />
              <Route path={adminUsersPath} element={<UserManagementPage />} />
              <Route path={adminPostsPath} element={<ViewPostPage />} />
              <Route path={adminCategoriesPath} element={<CategoryManagementPage />} />
              <Route path={adminRoleManagePath} element={<RoleManagementPage />} />
              <Route path={`${adminPostsPath}/:id`} element={<ViewDetailPostPage />} />
            </Route>
            <Route path={adminLoginPath} element={<AdminLogin />}></Route>


            <Route element={<HomePageRoutes>
              <HomepageLayout />
            </HomePageRoutes>}>
              <Route path={blogPath} element={<MainContent />} ></Route>
              <Route path={blogPostPath} element={<Page />} />
              <Route path={userSettingPath} element={<UserSettingPage />} />
            </Route>



          </Routes>
        </AuthProvider>
      </BrowserRouter>

    </>
  )
}

export default App
