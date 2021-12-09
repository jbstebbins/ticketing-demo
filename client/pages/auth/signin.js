import { useState } from "react";
import Router from 'next/router';
import useRequest from "../../hooks/use-request";

const signIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { doRequest, errors } = useRequest({
        url: '/api/users/signin',
        method: 'post',
        body: {
            email, password
        },
        onSuccess: () => Router.push('/')
    });

    const onSubmit = async (event) => {
        event.preventDefault();
        await doRequest();

    };

    return (
        <div style={{padding: "1.5rem"}}>
            <form onSubmit={onSubmit}>
            <h1>Signin</h1>
            <div className="form-group">
                <label>Email Address</label>
                <input value={email} onChange={e => setEmail(e.target.value)} className="form-control"></input>
            </div>
            <div className="form-group">
                <label>Password</label>
                <input value={password} onChange={e => setPassword(e.target.value)}type="password" className="form-control"></input>
            </div>
            {errors}
            <button className="btn btn-primary">Sign in</button>
        </form>
        </div>
        
    );
};

export default signIn;