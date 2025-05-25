import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom'
import DashBoard from './pages/admin/dashboard/Page'
import AdminPage from '@/pages/admin/Page'
import MainContent from './pages/blog/home-page/Page'
import CategoryManagementPage from './pages/admin/categories/Page'
import { Toaster } from 'sonner'
import UserManagementPage from './pages/admin/users/page'
import RoleManagementPage from '@/pages/admin/users/page'
import HomepageLayout from './pages/blog/Page'
import AdminLogin from './pages/admin/login/Login'
import { AuthProvider } from './hooks/AuthProvider'
import HomePageRoutes from './routes/HomePageRoutes'
import MyProfilePage from './pages/blog/my-profile/Page'
import MyPostsPage from './pages/blog/my-posts/Page'
import LibaryPage from './pages/blog/library/Page'
import PostsPage from './pages/admin/posts/Page'
import CommentsPage from './pages/admin/comments/page'
import PostDetailPage from './pages/blog/home-page/post-detail/Page'
import UserProfilePage from './pages/blog/home-page/user-profile/Page'
import ReportsPage from './pages/admin/report/Page'
import EditPost from './pages/blog/edit-post/Page'
import TestScreen from './utils/test'
import AdminProtectedRoute from './routes/AdminProtectedRoutes'
import PostPreview from './pages/admin/posts/posts-preview/Page'
function App() {

  return (
    <>
      <Toaster>

      </Toaster>
      <BrowserRouter >

        <AuthProvider >
          <Routes>


            <Route path='admin' element={<AdminProtectedRoute />} >
              <Route element={<AdminPage />}>
                {/* Thêm redirect khi vào /admin */}
                <Route index element={<Navigate to="posts" replace />} />

                <Route path='dashboard' element={<div>Empty</div>} />
                <Route path='users' element={<UserManagementPage />} />
                <Route path='posts' element={<PostsPage />} />
                <Route path='comments' element={<CommentsPage />} />
                <Route path='categories' element={<CategoryManagementPage />} />
                <Route path='reports' element={<ReportsPage />} />
              </Route>
              <Route path='preview-post/:postId' element={<PostPreview />} />
            </Route>
            <Route path='admin/login' element={<AdminLogin />} />

            <Route element={<HomePageRoutes>
              <HomepageLayout />
            </HomePageRoutes>}>
              <Route path='/' element={<MainContent />} ></Route>
              <Route path='/posts/:postId' element={<PostDetailPage />} />
              <Route path='/edit-posts/:postId' element={<EditPost />} />
              <Route path='/profile' element={<MyProfilePage />} />
              <Route path='/library' element={<LibaryPage />} />
              <Route path='/my-posts' element={<MyPostsPage />} />
              <Route path='/users/:username' element={<UserProfilePage />} />
            </Route>
            <Route path='/test' element={<TestScreen />}></Route>



          </Routes>
        </AuthProvider>
      </BrowserRouter>

    </>
  )
}

export default App
