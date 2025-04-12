import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import DashBoard from './pages/cms/dashboard/Page'
import AdminPage from '@/pages/cms/AdminPage'
import MainContent from './pages/blog/home-page/MainContent'
import CategoryManagementPage from './pages/cms/categoryManagement/Page'
import ViewDetailPostPage from '@/pages/cms/postManagement/viewPostDetail/Page'
import ViewPostPage from '@/pages/cms/postManagement/viewpost/Page'
import { Toaster } from 'sonner'
import UserManagementPage from './pages/cms/userManagement/Page'
import ErrorPage from './pages/ErrorPage'
import RoleManagementPage from '@/pages/cms/roleManagement/Page'
import { adminCategoriesPath, adminDashboardPath, adminLoginPath, adminPath, adminPostsPath, adminRoleManagePath, adminUsersPath, blogPath, blogPostPath } from '@/RouteDefinition'
import BlogLayout from './pages/blog/Layout'
import Page from './pages/blog/post-detail/Page'
import Test from './Test'
import Login from './pages/cms/login/Login'
import { useState } from 'react'
import { fa } from '@faker-js/faker'
import { AuthProvider, useAuthService } from './hooks/AuthProvider'

function App() {

  return (
    <>
      <Toaster>

      </Toaster>
      <BrowserRouter >

        <AuthProvider >
          <Routes>
            <Route path={adminPath} element={<AdminPage />} >
              <Route path={adminDashboardPath} element={<DashBoard />} ></Route>
              <Route path={adminPostsPath} element={<ViewPostPage />}></Route>
              <Route path={adminPostsPath + "/:id"} element={<ViewDetailPostPage />} />
              <Route path={adminCategoriesPath} element={<CategoryManagementPage />}>
              </Route>
              <Route path={adminUsersPath} element={<UserManagementPage />}></Route>
              <Route path={adminRoleManagePath} element={<RoleManagementPage />} />
            </Route>
            <Route path={adminLoginPath} element={<Login />}></Route>
            <Route element={<BlogLayout />}>
              <Route path={blogPath} element={<MainContent />} ></Route>
              {/* <Route path={blogPostPath} element={<Page />} /> */}
            </Route>



            <Route path="test/*" element={<Test />}></Route>
            {/* <Route path='*' element={<ErrorPage />}></Route> */}
          </Routes>
        </AuthProvider>
      </BrowserRouter>

    </>
  )
}

export default App
