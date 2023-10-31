import {
  createBrowserRouter,
  RouterProvider,
  useLoaderData
} from 'react-router-dom';
import HomePage from '@/pages/homePage';
import TxtImgPage from './pages/txtImgPage';

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      Component() {
        return (
          <>
            <HomePage />
          </>
        );
      }
    },
    {
      path: '/img',
      Component() {
        return (
          <>
            <TxtImgPage />
          </>
        );
      }
    }
  ]);
  return <RouterProvider router={router} />;
}

export default App;
