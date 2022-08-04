// import logo from './logo.svg';
import { BrowserRouter } from 'react-router-dom';
import {ReactNotifications} from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
import './App.css';
import AllRoutes from './routes/AllRoutes';

function App() {
  return (
   <>
       <BrowserRouter  basename='/'>
       <ReactNotifications/>
         <AllRoutes/>
       </BrowserRouter>
   </>
  )
}
export default App;
