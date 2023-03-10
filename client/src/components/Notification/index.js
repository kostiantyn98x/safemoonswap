
import React, { useState, useEffect, useHistory } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';
const Notification = ({isOpen, title, content}) => {
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        setModalOpen(isOpen);
    }, [isOpen]);     

    const closeModal = () => {
        setModalOpen(false);
    }

    return (
        <>            
            <div data-reach-dialog-overlay="true" className={`dhCkyp2 iiHqcD notification ${modalOpen === false ? "":"open"}`} style={{opacity:1}}>
                    <div role="dialog" aria-modal="true" data-reach-dialog-content="true" tabindex="-1"
                        aria-labelledby="wallet-modal-label" className="dWodJw1" hidden="">
                        <button className="iHaOcn1"></button>
                        <div className="iMWOje1">
                            <div className="gpVQzW1">
                                <h4 className="kQNlUO1">
                                    <div className="ejJoEn1" style={{textAlign:'center'}}>{title}</div>
                                </h4>
                                
                                <div className="jOXgFj1">
                                    <div style={{textAlign:'center'}}>
                                        <p>{content}</p>
                                    </div>
                                    <div style={{textAlign:'center', paddingTop:'2rem'}}>
                                        <button type="button" id="btn_welcome" style={{color:"#60c6be"}} onClick={closeModal} className="welcome-ok">Ok</button>
                                    </div>
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div data-reach-dialog-overlay="true" id ="dhCkyp3" className="dhCkyp3 iiHqcD" style={{opacity:1}}>
                    <div role="dialog" aria-modal="true" data-reach-dialog-content="true" tabindex="-1"
                        aria-labelledby="wallet-modal-label" className="dWodJw1" hidden="">
                        <button className="iHaOcn1"></button>
                        <div className="iMWOje1">
                            <div className="gpVQzW1">
                                <h4 className="kQNlUO1">
                                    <div className="ejJoEn1" style={{textAlign:'center'}}>Notification</div>
                                </h4>
                                
                                <div className="jOXgFj1">
                                    <div style={{textAlign:'center'}}>
                                        <p id="noti_context">Please check your balance!</p>
                                    </div>
                                    <div style={{textAlign:'center', paddingTop:'2rem'}}>
                                        <button type="button" id="btn_notification" className="welcome-ok">Ok</button>
                                    </div>
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
        </>
    )
}

export default Notification;
