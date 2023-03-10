import React, { useState, useEffect } from 'react';
import {useHistory} from 'react-router-dom';
import PortfolioItem from '../../components/PortfolioItem';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import $ from 'jquery';
import './index.css';
const PortfolioCard = (props) => {

    const history = useHistory();

    const showPort = () => {
        history.push('/portfolio');
    }

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
                        <PortfolioItem />                 
                    </main>
                </div> 
                               
                <Footer />                  
            </div>  
        </>
    )
}

export default PortfolioCard;
