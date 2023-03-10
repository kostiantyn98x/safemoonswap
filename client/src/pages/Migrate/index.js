import React, { useState, useEffect } from 'react';
import {useHistory} from 'react-router-dom';
import $ from 'jquery';
import './index.css';
import Notification from '../../components/Notification';

const Migrate = (props) => {

    const history = useHistory();
    const [openNoti, setOpenNoti] = useState(false);
    const [titleNoti, setTitleNoti] = useState('');
    const [contentNoti, setContentNoti] = useState('');

    const showMigrate = () => {
        if(localStorage.getItem('login') !== "true") {
            setTitleNoti('Notification');
            setContentNoti('Please login with your wallet')
            setOpenNoti(true);
        } else {
            window.location.href = 'https://swap.safemoon.com';
        }    
    }

    return (
        <>                        
        <Notification isOpen={openNoti} title={titleNoti} content={contentNoti} /> 
        <div className="swap__mainfield">
            <div className="badge bg-info team-rank px-3 bg-item" style={{position:'absolute', left:0, borderRadius:' .35rem 0 8px 0', top:0, boxShadow:' 0 0 5px rgba(0,0,0,.6)', textAlign:'center', paddingLeft:'1rem', paddingRight:'1rem', lineHeight:'1.6rem', width:'190px', color:'#f4f4f4', fontSize:'17px', fontWeight:300}}>MIGRATE</div>                        
            <div id='swap-page' className="swap__page pt2">
                <div className="swap__header__line__settings">
                    <div><img src="img/telescope.png" alt="icon" style={{width:'44px', display:'inline-block'}}/></div>
                </div>
                <div className="swap__page__container">
                    <div>
                        <div id="swap-currency-output" label="[object Object]" style={{borderRadius:'0.4375rem', marginBottom:0, height:'28px'}}>
                            <p style={{fontSize:'12px', position:'relative', bottom:'35px', right:'43px', fontWeight:600}}>Migrate from V1 to V2
                            </p>
                        </div>
                        <div id="swap-currency-input" label="[object Object]" style={{borderRadius:'0.4375rem', marginBottom:0}}>
                            <p className='mb-0' style={{fontSize:'12px', fontWeight:600}}>Swap your SafeMoon V1 tokens for SafeMoon V2 (SFM)</p>
                        </div>
                    </div>
                    <div className="swap__connect">
                        {/* <a target="_blank" href="https://swap.safemoon.com"> */}
                            <button onClick={showMigrate} type="button" id="swap_tokens"  style={{fontFamily:'Open Sans', fontWeight:'bold'}}>Swap Tokens</button>
                        {/* </a> */}
                    </div>
                </div>
            </div>
        </div> 
        </>
    )
}

export default Migrate;
