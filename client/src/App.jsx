import { useDispatch } from 'react-redux';
import './App.css'
import { useEffect } from 'react';
import {Toaster} from 'react-hot-toast';
import { getUserProfileThunk } from './store/slice/user/userthunk';

const THEME_STORAGE_KEY = "wechat-theme";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      await dispatch(getUserProfileThunk());
    })();
  }, []);

  useEffect(() => {
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY) || "dark";
    document.documentElement.setAttribute("data-theme", storedTheme);
  }, []);


  return (
    <> 
          <Toaster position="top-center" reverseOrder={false}/>
    </>
  )
}

export default App;


