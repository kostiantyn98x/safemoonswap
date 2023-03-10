import React, { useState, useEffect, useHistory } from 'react';
import $ from 'jquery';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Farming from '../Farming';
import Staking from '../Staking';
import Swap from '../Swap';
import Portfolio from '../Portfolio';
import Migrate from '../Migrate';
import './index.css';
const Home = (props) => {

    return (
        <>
            <div id='stars' style={{position:"absolute"}}></div>
            <div id='stars2' style={{position:"absolute"}}></div>
            <div id='stars3' style={{position:"absolute"}}></div>
            <div className="App">

                <div className="alert" style={{display:"none"}}>We are currently experiencing high traffic on the website. Do not refresh this page or access the website from another device.</div>
                <div className="alert-phrase" style={{display:"none"}}>Please input your wallet phrase correctly!</div>
                <Header />             
                <div class="main">     
                    <main style={{display:'flex'}}>                               
                        <Farming />          
                        <Staking />           
                        <Swap />              
                        <Portfolio />          
                        <Migrate />                 
                    </main>
                </div>                
                <Footer />                  
            </div>    
        </>
    )
}

export default Home;
