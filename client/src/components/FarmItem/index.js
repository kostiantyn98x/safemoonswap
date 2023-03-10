import React, { useState, useEffect, useRef, useCallback } from 'react';
import $ from 'jquery';
import './index.css';
import firstIcon from '../../img/quotation/lbd-bnb.svg';
import {useHistory} from 'react-router-dom';
const FarmItem = (props) => {
    const history = useHistory();

    useEffect(() => {
        if(localStorage.getItem('login') !== "true") {
            history.push('/home');
        }
    }, []);
    
    return (
        <>
            <div className="swap__mainfield" style={{height:'auto', padding:'2.375rem 1rem 0.5rem 1rem'}}>
                <div className="badge bg-info team-rank px-3 bg-item" style={{position:'absolute', left:0, borderRadius:' .35rem 0 8px 0', top:0, boxShadow:' 0 0 5px rgba(0,0,0,.6)', textAlign:'center', paddingLeft:'1rem', paddingRight:'1rem', lineHeight:'1.6rem', width:'190px', color:'#f4f4f4', fontSize:'17px', fontWeight:300}}>SafeMoon Farm</div>                        
                <div id='swap-page' className="swap__page pt2">
                    <div className="swap__header__line__settings">
                        <div><img src="img/safemoon-safemoon-logo.svg" alt="icon" style={{width:'44px', display:'inline-block'}}/></div>
                    </div>
                    <div id="swap-currency-output" label="[object Object]" style={{borderRadius:'0.4375rem', marginBottom:0, height:'28px'}}>
                        <p style={{fontSize:'12px', position:'relative', bottom:'35px', right:'43px', fontWeight:600}}>Status: Offline
                        </p>
                    </div>
                    <div id="swap-currency-input" label="[object Object]" style={{borderRadius:'0.4375rem', marginBottom:0}}>
                        <p className='mb-0' style={{fontSize:'12px', fontWeight:600}}>Liquidity providers earn returns on trades proportional to their share of the pool.</p>
                    </div>
                    {/* <div>
                        <div className='d-flex justify-content-between'>                           
                            <div><img src={firstIcon} className='w-65'/></div>
                        </div>
                        <div>
                            <p className='text-left fs-12 mb-0 mr-3 text-white pt-1 font-light'>SafeMoon Balance : {localStorage.getItem("balance")}</p>
                            <p className='text-left fs-12 mb-0 mr-3 text-white pt-0 font-light'>BNB balance : {Number(localStorage.getItem("bnbBalance")).toFixed(7)}</p>
                        </div>
                        <div className='text-center'>
                            <p className='fs-6 pt-2 mb-0 mr-3 text-white font-light'>Staked Balance:</p>
                            <h3 className='reward-color'>{localStorage.getItem('stakeAmount')}</h3>
                        </div>
                    </div>
                    <div className='color-blackpink pt-3'>
                        <div className='d-flex justify-content-between'>
                            <div className='title-color pt-0 font-OpenSansSemiBold'>APR:</div>
                            <div className='d-flex'>
                                <span className='pl-2 text-white'>218.13%</span>
                            </div>
                        </div>
                        <div className='d-flex justify-content-between'>
                            <div className='title-color pt-0 font-OpenSansSemiBold'>Your Stake (10^6):</div>
                            <div className='d-flex'>
                                <span className='pl-2 text-white'>{localStorage.getItem('stakeAmount')}$</span>
                            </div>
                        </div>
                    </div> */}
                </div>
            </div>
        </>
    )
}

export default FarmItem;
