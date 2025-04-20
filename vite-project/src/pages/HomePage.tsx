import { Link } from 'react-router-dom';
import Logo from '../components/Logo';
import { useState } from 'react';

const HomePage = () => {
   const [isScrolled, setIsScrolled] = useState(false);
   const categories = [
      'Technology',
      'Business',
      'Lifestyle',
      'Travel',
      'Food',
      'Health',
      'Entertainment'
   ];

   // Handle scroll effect
   if (typeof window !== 'undefined') {
      window.addEventListener('scroll', () => {
         if (window.scrollY > 50) {
            setIsScrolled(true);
         } else {
            setIsScrolled(false);
         }
      });
   }

   return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
         {/* Navigation Bar */}
         <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-sm shadow-lg' : 'bg-transparent'
            }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
               <div className="flex justify-between h-16">
                  <div className="flex items-center">
                     <Logo />

                     {/* Categories */}
                     <div className="hidden md:ml-10 md:flex md:space-x-8">
                        {categories.map((category) => (
                           <Link
                              key={category}
                              to={`/category/${category.toLowerCase()}`}
                              className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 hover:border-b-2 hover:border-blue-500 transition-all duration-200"
                           >
                              {category}
                           </Link>
                        ))}
                     </div>
                  </div>

                  {/* Auth Buttons */}
                  <div className="flex items-center space-x-4">
                     <Link
                        to="/login"
                        className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-full text-blue-600 hover:text-white hover:bg-blue-600 transition-all duration-300 border border-blue-600"
                     >
                        Login
                     </Link>
                     <Link
                        to="/signup"
                        className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-full text-white bg-blue-600 hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg"
                     >
                        Sign Up
                     </Link>
                  </div>
               </div>
            </div>
         </nav>

         {/* Main Content */}
         <main className="pt-16">
            {/* Hero Section */}
            <div className="relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 -z-10"></div>
               <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                  <div className="text-center">
                     <h1 className="text-5xl font-bold text-gray-900 sm:text-6xl md:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                        Welcome to Our Platform
                     </h1>
                     <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
                        Discover amazing content and connect with our community. Start your journey today.
                     </p>
                     <div className="mt-10 flex justify-center gap-4">
                        <Link
                           to="/explore"
                           className="inline-flex items-center px-8 py-3 text-base font-medium rounded-full text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                           Start Exploring
                        </Link>
                        <Link
                           to="/learn-more"
                           className="inline-flex items-center px-8 py-3 text-base font-medium rounded-full text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-all duration-300"
                        >
                           Learn More
                        </Link>
                     </div>
                  </div>
               </div>
            </div>

            {/* Featured Content Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
               <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-gray-900">Featured Content</h2>
                  <p className="mt-4 text-lg text-gray-600">Discover our most popular and trending content</p>
               </div>
               <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map((item) => (
                     <div
                        key={item}
                        className="group bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
                     >
                        <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-500 relative overflow-hidden">
                           <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all duration-300"></div>
                           <div className="absolute bottom-2 left-2">
                              <span className="px-2 py-0.5 text-xs text-white bg-blue-600/90 rounded-full">Featured</span>
                           </div>
                        </div>
                        <div className="p-4">
                           <h3 className="text-base font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 line-clamp-1">
                              Featured Item {item}
                           </h3>
                           <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                           </p>
                           <div className="mt-3 flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                 <div className="w-6 h-6 rounded-full bg-gray-200"></div>
                                 <span className="text-xs text-gray-600">Author</span>
                              </div>
                              <Link
                                 to={`/article/${item}`}
                                 className="text-blue-600 hover:text-blue-700 font-medium text-xs"
                              >
                                 Read More →
                              </Link>
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
            </div>

            {/* Categories Section */}
            <div className="bg-gray-50 py-16">
               <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="text-center mb-12">
                     <h2 className="text-3xl font-bold text-gray-900">Browse Categories</h2>
                     <p className="mt-4 text-lg text-gray-600">Explore content by category</p>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                     {categories.map((category) => (
                        <Link
                           key={category}
                           to={`/category/${category.toLowerCase()}`}
                           className="group p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 text-center"
                        >
                           <h3 className="text-lg font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                              {category}
                           </h3>
                        </Link>
                     ))}
                  </div>
               </div>
            </div>
         </main>
      </div>
   );
};

export default HomePage; 