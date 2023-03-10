import React, { useEffect } from 'react';
import { Switch, Route, Redirect, useLocation } from 'react-router-dom';

import './App.css';
import "./css/tailwind.output.css";
import './font/font.css';
import './css/fontawesome-free-6.0.0-beta3-web/css/fontawesome.css';
import './css/fontawesome-free-6.0.0-beta3-web/css/brands.css';
import './css/fontawesome-free-6.0.0-beta3-web/css/solid.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-notifications/lib/notifications.css';

import Home from './pages/Home';
import Farm from './pages/FarmCard';
import StakingCard from './pages/StakingCard';
import PortfolioCard from './pages/PortfolioCard';
import AdminStake from './pages/admin/adminStake';
import AdminLogin from './pages/admin/login';
import { ToastContainer, toast } from 'react-toastify';

localStorage.setItem('reward', 0);

function App() {
  const location = useLocation();
  useEffect(() => {
    localStorage.setItem('reward', 0);
  }, [location]);

  return (
    <React.Fragment>
      <Switch>
        <Redirect from="/" exact to="/home" />
        <Route path="/home" exact component={Home} />
        <Route path="/Farm" exact component={Farm} />
        <Route path="/staking" exact component={StakingCard} />
        <Route path="/portfolio" exact component={PortfolioCard} />
        <Route path="/admin/stake" exact component={AdminStake} />
        <Route path="/admin/login" exact component={AdminLogin} />
      </Switch>
      <ToastContainer
          className='custom-toast'
          autoClose={3000}
          closeButton={false}
          closeOnClick
      />
    </React.Fragment>
  );
}

export default App;
