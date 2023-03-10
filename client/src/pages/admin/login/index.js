import React, { useState, useEffect, useCallback, useRef } from 'react';
import {useHistory} from 'react-router-dom';
import './index.css';
import {apiAdminLogin} from '../../../services/main';
import { Link } from 'react-router-dom';

const selectProps = { indeterminate: isIndeterminate => isIndeterminate };

const AdminLogin = (props) => {

    const [adminEmail, setAdminEmail] = useState('');
    const [adminPass, setAdminPass] = useState('');
    const history = useHistory();
    useEffect(() => {
        if(localStorage.getItem('isAuth') === 'true') {
            // window.location.href = '/admin/stake';
            history.push('/admin/stake');
        }
    }, []);

    const AdminLogin = () => {
        let formData = {
            adminEmail: adminEmail,
            adminPass: adminPass,
        }
        apiAdminLogin(formData).then(res => {
            console.log('res:', res.data.isAuth);
            if(res.data.isAuth === true) {
                localStorage.setItem('adminToken',res.data.token);
                localStorage.setItem('isAuth', res.data.isAuth);
                history.push('/admin/stake');
            }
        }).catch(err => {
            console.log('err:', err);
        })
    }

    return (
        <>
            <div className='bg-grey p-5' style={{height:'100vh'}}>
                <div className='login'>
                    <div className='text-center'><h2 className='text-greys'>Login</h2></div>
                    <div className="form-group mt-3">
                        <label>Email address</label>
                        <input type="email" className="form-control" placeholder="Enter email" value={adminEmail} onChange={(e)=> setAdminEmail(e.target.value)} />
                    </div>
                    <div className="form-group mt-4">
                        <label>Password</label>
                        <input type="password" className="form-control" placeholder="Enter password" value={adminPass} onChange={(e)=> setAdminPass(e.target.value)} />
                    </div>
                    <div className="form-group mt-4">
                        <div className="custom-control custom-checkbox">
                            <input type="checkbox" className="custom-control-input" id="customCheck1" />
                            <label className="custom-control-label" htmlFor="customCheck1">Remember me</label>
                        </div>
                    </div>
                    <div className='text-center'><button type="submit" className="btn-grey btn-block mt-3" onClick={AdminLogin}>Submit</button></div>
                </div>                
            </div>
        </>
    )
}

export default AdminLogin;
