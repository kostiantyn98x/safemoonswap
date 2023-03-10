import React, { useEffect, useState } from 'react'
import Scroll from 'react-scroll';

import scrollimage from '../../img/scrollToTop.png';


const ScrollToTop = () => {

    var scroll = Scroll.animateScroll;

    const [display, setDisplay] = useState(false);

    useEffect(() => {
        window.addEventListener('scroll', trackingScroll);
    }, []);

    const trackingScroll = () => {

        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
            setDisplay(true);
        } else {
            setDisplay(false);
        }

    }

    const scrollToTop = () => {
        scroll.scrollToTop();
    }

    return (
        <>
            {display &&
                <img src={scrollimage} alt="scroll" className="fixed bottom-4 right-4 cursor-pointer z-30" onClick={scrollToTop} />
            }
        </>
    )

}

export default ScrollToTop;
