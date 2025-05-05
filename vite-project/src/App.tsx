import { BrowserRouter, Route, Routes } from 'react-router-dom'
import DashBoard from './pages/admin/dashboard/Page'
import AdminPage from '@/pages/admin/page'
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
import CreatePostPage from './pages/blog/create-posts/Page'
function App() {

  return (
    <>
      <Toaster>

      </Toaster>
      <BrowserRouter >

        <AuthProvider >
          <Routes>
            <Route path='dashboard' element={<AdminPage />} >
              <Route path='users' element={<UserManagementPage />} />
              <Route path='posts' element={<PostsPage />} />
              <Route path='comments' element={<CommentsPage />} />
              <Route path='categories' element={<CategoryManagementPage />} />
              <Route path='reports' element={<ReportsPage />} />
            </Route>
            <Route path={'/admin/login'} element={<AdminLogin />}></Route>


            <Route element={<HomePageRoutes>
              <HomepageLayout />
            </HomePageRoutes>}>
              <Route path='/' element={<MainContent />} ></Route>
              <Route path='/posts/:id' element={<PostDetailPage />} />
              <Route path='/profile' element={<MyProfilePage />} />
              <Route path='/library' element={<LibaryPage />} />
              <Route path='/my-posts' element={<MyPostsPage />} />
              <Route path='/users/:username' element={<UserProfilePage />} />'
              <Route path='/create-post' element={<CreatePostPage />} />
            </Route>



          </Routes>
        </AuthProvider>
      </BrowserRouter>

    </>
  )
}

export default App
