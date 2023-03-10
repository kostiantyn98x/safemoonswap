
import React, { useState, useEffect, useHistory } from 'react';
import { FaAlignJustify, FaHome, FaTractor, FaBabyCarriage, FaSteam, FaOutdent,
         FaShareSquare, FaTwitter, FaStackExchange, FaExchangeAlt, FaArrowDown} from 'react-icons/fa';
import {FiChevronDown} from 'react-icons/fi';
import {BsBoxArrowRight} from 'react-icons/bs';
import {IoMdAddCircle} from 'react-icons/io';
import { Link } from 'react-router-dom';
import logo_short from '../../img/quotation/24_24.svg';
import logo_default from '../../img/quotation/156_25.svg';
import MyModal from '../../components/Modal';
import SignModal from '../../components/Modal/signModal';
import PoolIcon from '../../img/icons/pool-icon.png';
// import './index.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Navbar = ({openChecked, isLogin}) => {
    const [open, setOpen] = useState('close');
    const [openModal, setOpenModal] = useState(false);    
    
    const [login, setLogin] = useState(false);
    const [balance, setBalance] = useState('');

    const [submenu, setSubmenu] = useState(false);
    const [address, setAddress] = useState(false);
    const [menus, setMenus] = useState(false);
    const [isStake, setIsstake] = useState(false);
    const [openNotification, setOpenNotification] = useState(false);
    const [messageInfo, setMessageInfo] = useState('');

    const [openSign, setOpenSign] = useState(false);


    const clickAlign = () => {
        if(open === 'close') {
            setOpen('open');
            openChecked('open');
        } else {
            setOpen('close');
            openChecked('close');
        }        
    }

    useEffect(() => {
        // alert('this is');
        console.log(login);
        isLogin(login);
    }, [login]);

    const OpenModal = () => {
        if(openModal === false)
            setOpenModal(true)
        else
            setOpenModal(false);
    }

    const openSubmenus = () => {
        setOpen('open');
        if(submenu === true) 
            setSubmenu(false);
        else
            setSubmenu(true);
    }
    const OpenMenu = () => {
        if(menus === true) 
            setMenus(false);
        else
            setMenus(true);
    }

    const signUp = () => {
        if (openSign === false) 
            setOpenSign(true);
        else
            setOpenSign(false);
    }
    useEffect(() => {
        setMenus(false);
    }, [login]);
    const logOut = () => {
        let answer = window.confirm("Do you want to log out?");
        if(answer) {
            localStorage.setItem('login', false);
            setLogin('false');
            setMessageInfo('You have successfully been logged out!');
            setOpenNotification(true);
            toast.info('You have successfully been logged out!');
            isLogin(false);
            localStorage.removeItem('token');
            localStorage.setItem('stakeAmount', 0);
        }
    }
    
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenNotification(false);
    };

    return (
        <>
            <div className='d-flex justify-content-between my-nav align-self-center'>
                <div className='d-flex pl-5 cursor-pointer' onClick={clickAlign}>
                    <div className='align-self-center'>
                        {open === 'close' && (
                            <FaAlignJustify className='main-color'/>
                        )}
                        {open === 'open' && (
                            <FaOutdent className='main-color'/>
                        )}
                    </div>
                    <div className='align-self-center ml-12 ch-image'></div>
                </div>jjj
                {localStorage.getItem('login') !== 'true' && (
                    <div className='d-flex'>
                        <div className="align-self-center btn btn-primary rounded-button main-bg-color font-OpenSansBold mr-4" onClick={OpenModal}>
                            connect                        
                        </div>
                    </div>
                )}
                {localStorage.getItem('login') === 'true' && (
                    <div className='d-flex'>                   
                        <div className='align-self-center chocolate font-OpenSansBold'>Balance: {localStorage.getItem('balance')} Baby Doge</div>
                        <div className='pt-3'>
                            <div className="ml-3 btn btn-warnings font-OpenSansBold mr-4" onClick={() => OpenMenu()}>
                                { localStorage.getItem('address').substr(0,7)+'...'+ localStorage.getItem('address').substr(-7,7)}                                
                            </div>
                            {menus === true && (
                                <div className='right-top-menu ml-3 mr-4'>     
                                    <a href={`https://bscscan.com/address/${localStorage.getItem('address')}`} target="_blank"><div className='font-OpenSansBold chocolate cursor-pointer menu-list-item'>Wallet</div></a>
                                    <hr className='my-0'/>
                                    <div className='d-flex font-OpenSansBold chocolate cursor-pointer menu-list-item' onClick={() => logOut()}>Disconnect<BsBoxArrowRight className='align-self-center ml-3'/></div>
                                </div>
                            )}
                        </div>                                         
                    </div>
                )}
                
            </div>
            
            
            {open === "close" && (
                <div className='left-nav'>
                    <div className='d-flex flex-column'>
                        <Link to='/home'><div className='left-nav-icon'><FaHome /></div></Link>
                        <div className="cursor-pointer" onClick={() => openSubmenus()}><div className='left-nav-icon'><FaExchangeAlt /></div></div>
                        <Link to='/farm'><div className='left-nav-icon'><FaTractor /></div></Link>
                        <Link to='/pool'><div className='left-nav-icon'><FaBabyCarriage /></div></Link>
                    </div>
                    
                    <div className='left-nav-icon-spec' onClick={clickAlign}><hr/><FaSteam /></div>
                </div>
            )}
            {open === 'open' && (
                <>
                <div className='left-nav w-open'>
                    <div className='d-flex flex-column'>
                        <Link to='/home'><div className='left-nav-icon d-flex'><FaHome className='align-self-center'/> <span className='align-self-center left-nav-text'>Home</span></div></Link>
                        <div className="cursor-pointer" onClick={() => openSubmenus()}><div className='left-nav-icon d-flex'><FaExchangeAlt className='align-self-center'/> <span className='align-self-center left-nav-text'>Trade</span> <FiChevronDown className='align-self-center fs-12 ml-c-5 mt-1' /> </div></div>
                        {submenu === true && (
                            <div>
                                <a href={`https://pancakeswap.finance/swap?outputCurrency=0xc748673057861a797275CD8A068AbB95A902e8de`} target='_blank'><div className='left-nav-icon d-flex'><span className='align-self-center left-nav-text'>Exchange</span></div></a>
                                <a href={`https://pancakeswap.finance/add/0xc748673057861a797275CD8A068AbB95A902e8de`} target='_blank'><div className='left-nav-icon d-flex'><span className='align-self-center left-nav-text'>Liquidity</span></div></a>
                            </div>
                        )}
                        <Link to='/farm'><div className='left-nav-icon d-flex'><FaTractor className='align-self-center'/> <span className='align-self-center left-nav-text'>Farms</span></div></Link>
                        <Link to='/pool'><div className='left-nav-icon d-flex'><FaBabyCarriage className='align-self-center'/> <span className='align-self-center left-nav-text'>Staking</span></div></Link>
                    </div>
                    <div className='left-nav-icon-spec2'>
                        <hr/>
                        <div className='d-flex'><img src={logo_short} className='w-24' /> <span className='white font-OpenSansBold pl-price left-nav-text'>$0.00000000001983</span></div>
                        <div className='d-flex justify-content-between w-80 pt-3' style={{marginLeft:4}}>
                            <FaShareSquare />
                            <FaTwitter />
                        </div>
                    </div>
                </div>
                <div className='blur'></div>
                </>
            )}
            <MyModal isOpen={openModal} isLogin={setLogin} isBalance={setBalance} setAddress={setAddress} isStake={setIsstake}/>       
            <SignModal isOpen={openSign} />
            
            
        </>
    )
}

export default Navbar;
