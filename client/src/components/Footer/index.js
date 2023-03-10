
import React, { useState, useEffect, useHistory } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';
const Footer = () => {

    return (
        <>            
            <footer>
                    <a href="https://www.SafeMoon.net/" target="_blank" rel="noreferrer">Website</a><a
                            href="https://t.me/SafeMoonv2" target="_blank" rel="noreferrer">Telegram</a><a
                            href="https://discord.com/invite/SafeMoon" target="_blank" rel="noreferrer">Discord</a><a
                            href="https://github.com/SafeMoonprotocol"
                            target="_blank" rel="noreferrer">Governance</a><a href="https://twitter.com/SafeMoon"
                                                                            target="_blank" rel="noreferrer">Twitter</a><a
                            href="https://www.bscscan.com/token/0x42981d0bfbAf196529376EE702F2a9Eb9092fcB5" target="_blank"
                            rel="noreferrer">BSCscan</a><a href="https://www.SafeMoon.net/" target="_blank" rel="noreferrer">Contact
                        us
                    </a>
                </footer>
        </>
    )
}

export default Footer;
