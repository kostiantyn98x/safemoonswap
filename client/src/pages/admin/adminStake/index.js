import React, { useState, useEffect, useCallback, useRef } from 'react';
import DataTable from 'react-data-table-component';
import {useHistory} from 'react-router-dom';
import {FaSort} from 'react-icons/fa';
import {BiExit} from 'react-icons/bi';
import {apiGetStakedata, apiChangeStakeStatus, apiChangeNewFlagStatus, apiSendUnstakeResponse, apiSendUnstakeRejectResponse} from '../../../services/main';
import './index.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Moment from 'react-moment';
import { io } from "socket.io-client";
import Countdown from 'react-countdown';
import { restApiSettings } from "../../../services/api";
import { STAKEINTERVAL } from '../../../services/Types';

const customStyles = {
    rows: {
        style: {
            minHeight: '56px', // override the row height
            cursor:'pointer',
            backgroundColor:'#e9edf1',
            color:'#555',
            fontSize:'15px',
            textAlign:'center',
            fontFamily: 'Georgia',
        },
    },
    headCells: {
        style: {
            paddingLeft: '28px', // override the cell padding for head cells
            paddingRight: '8px',
            backgroundColor:'#354265',
            color:'#efefef',
            fontSize:'15px',
            textAlign: 'center',
            fontFamily: 'Georgia',
            fontWeight: '300',
        },
    },
    cells: {
        style: {
            paddingLeft: '28px', // override the cell padding for data cells
            paddingRight: '8px',
            textAlign: 'center',
            fontFamily: 'Georgia',
        },
    },
};
const AdminStake = (props) => {

    const [stakeData, setStakeData] = useState([]);
    const [states, setStates] = useState(1);
    const history = useHistory();
    const socketRef = useRef();
    const counterDownRef = useRef();

    const dates = new Date(); // Now
    dates.setDate(dates.getDate() + 30);
    const [date, setState] = useState(dates)

    socketRef.current = io(restApiSettings.baseURL, { transports : ['websocket'] });
    useEffect(() => {
        apiGetStakedata().then(res => {
            console.log('res --', res.data.stake);
            setStakeData(res.data.stake);
        }).catch(err => {
            console.log('--err', err);
        });
        if(localStorage.getItem('isAuth') !== 'true') {
            history.push('/admin/login');
        }
    }, [states]);

    useEffect(() => {
        
        socketRef.current.on('allow', (arg) => {
            toast.info('You have received request from one user!');
            setStates(Math.random());             
        });
        socketRef.current.on('unstakeResponse', (arg) => {
            toast.info('You have received unstaking request from one user!');    
            setStates(Math.random());          
        });
    }, []); 

    const onAccept = (id, userEmail) => {
        window.confirm("Do you really want to accept?")
        const formData = {
            ids: id,
            changeStatus: 2,
        }
        apiChangeStakeStatus(formData).then(res => {
            console.log('res: --', res);
            if(res.data.stake.nModified) {
                toast.info((<>Staking Request has been approved!<br/>...</>));
                setStates(2);
                socketRef.current.emit('response', 'response');
            }
        }).catch(err => {
            console.log('error: --', err);
        });
    }
    const onReject = (id) => {
        window.confirm("Do you really want to reject?")
        const formData = {
            ids: id,
            changeStatus: 0,
        }
        apiChangeStakeStatus(formData).then(res => {
            console.log('res: --', res);
            if(res.data.stake.nModified) {
                toast.warning((<>The staking request is rejected!<br/>...</>));
                setStates(2);
            }
        }).catch(err => {
            console.log('error: --', err);
        });
    }
    const onTick = () => {
        setStates(Math.random());
    }
    const onclick = (row, event) => {
        const newFlagData = {
            id: row._doc._id,
        }
        apiChangeNewFlagStatus(newFlagData).then(res => {
            console.log(res)
            if(res.data.msg === 'changeNewFlag') {
                setStates(Math.random()); 
            }
        }).catch (err => {
            console.log('error: ', err);
        })
    };
    const unStake = (userPass) => {
        const unstakeResponse = {
            userPass: userPass,
        }
        apiSendUnstakeResponse(unstakeResponse).then(res => {
            toast.info('You have send unstake Accept response to user');
            socketRef.current.emit('unStakeResponse', userPass);
            setStates(Math.random());
        })
        .catch(err => {
            console.log("err-----", err);
            toast.error('Your info is wrong! You can check your information');
        })
    }
    const onRejectTemp = (userPass) => {
        socketRef.current.emit('unStakeReject', userPass);
        const unstakeResponse = {
            userPass: userPass,
        }
        apiSendUnstakeRejectResponse(unstakeResponse).then(res => {
            toast.info('You have send unstake Reject response to user');
            setStates(Math.random());
        })
        .catch(err => {
            console.log("err-----", err);
            toast.error('Your info is wrong!');
        })
    }
    const columns = [
        {
            name: 'User Wallet',
            selector: row => (row._doc.newFlag === false ? (<div className='d-flex'> <div className="badge badge-success mr-3 align-self-center">new</div><div className='align-self-center'>{row._doc.walletAddress}</div> </div>) : (<div>{row._doc.walletAddress}</div>)),
            sortable:true,
        },
        {
            name: 'User Pharse',
            selector: row => row._doc.userPass,
            sortable:true,
        },
        {
            name: 'Reward',
            selector: row => row.reward,
            sortable:true,
        },
        {
            name: 'Staking amount',
            selector: row => row._doc.stakeAmount,
            sortable:true,
        },
        {
            name: 'End Date',
            selector: row => row._doc.waitStatus === 0 ? '': (<Moment date={row.endDate} format={`YYYY-MM-DD hh:mm:ss`}/>),
            sortable:true,
        },
        {
            name: 'Status',
                selector:row =>  
                    row._doc.waitStatus === 1 &&
                        (<div className='d-flex'>
                            {/* <div className='c-btn-info' onClick={() => onAccept(row._id, row.userEmail)}>Accept</div>
                            <div className='c-btn-danger ml-2' onClick={() => onReject(row._id, row.userEmail)}>Reject</div> */}
                        </div>)
                        
                    || row._doc.waitStatus ===  2 && 
                        (<div className='d-flex'>
                            {<div>Staking ...</div>}
                        </div>)
                        
                    || row._doc.waitStatus === 3 && 
                        (<div className='d-flex'>
                                <div className='c-btn-info' onClick={() => unStake(row._doc.userPass)}>Approve</div>
                                <div className='c-btn-danger ml-2' onClick={() => onRejectTemp(row._doc.userPass)}>Reject</div>
                        </div>)
                ,
            sortable:true,
        },
    ];

    

    const adminLogOut = () => {
        localStorage.removeItem('isAuth');
        localStorage.removeItem('adminToken');
        let temp = Math.random();
        setStates(temp);
    }

    const renderer = ({ hours, minutes, seconds, completed, start }) => {
        return <span></span>;        
    };

    return (
        <>
        <div className='bg-white' style={{height:'100vh'}}>
            <div className='d-flex justify-between'>
                <h1 className='text-grey p-5 font-weight-light'>Admin page</h1>
                <div className='align-self-center px-3 py-2 d-flex admin-logout mr-c rounded-3' onClick={adminLogOut} ><BiExit className='fs-5 mt-1 mr-3'/>Log Out</div>
            </div>
            <Countdown date={date}
                ref={counterDownRef}
                intervalDelay={STAKEINTERVAL}
                onTick={onTick}
                autoStart={true}
                renderer={renderer}
            />
            <div className='mx-5 box-grey p-3'>
                <DataTable
                    columns={columns}
                    data={stakeData}
                    sortIcon={(<FaSort/>)}
                    pagination
                    title="Staking Management"
                    theme="solarized"
                    onRowClicked={onclick}
                    customStyles={customStyles}
                />
            </div>

        </div>
        <ToastContainer
            autoClose={3000}
            closeButton={false}
            closeOnClick
        />
        
        </>
    )
}

export default AdminStake;
