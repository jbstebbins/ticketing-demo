import { useEffect, useState } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import useRequest from '../../hooks/use-request';
import Router from 'next/router';

const OrderShow = ({ order, currentUser }) => {
    const [timeLeft, setTimeLeft] = useState(0);
    const { doRequest, errors } = useRequest({
        url: '/api/payments',
        method: 'post',
        body: {
            orderId: order.order.id
        },
        onSuccess: () => Router.push('/orders')
    });


    useEffect(() => {
        const findTimeLeft = () => {
            const msLeft = new Date(order.order.expiresAt) - new Date();
            setTimeLeft(Math.round(msLeft/1000));
        };

        findTimeLeft();
        const timerId = setInterval(findTimeLeft, 1000);

        //this return function is called when navigating away or stopping the component for some reason
        return () => {
            clearInterval(timerId);
        }
    }, [])

    if (timeLeft < 0) {
        return <div>Order Expired</div>
    }

    return <div>
        Time left to pay: {timeLeft} seconds
        <StripeCheckout 
            token={({id}) => doRequest({ token: id })}
            stripeKey="pk_test_51Ir6jxJaQIvYVqeLSXR1e0VTy74KW8LTZsZww46rdbN0RMnSQXz9VZNAVTBibrHUAq4cybFQJgwYhr0FhxrDhPdx00kwFOfMfX"
            amount={order.order.ticketPrice * 1000}
            email={currentUser.email}
        />
        {errors}
        </div>;
};


OrderShow.getInitialProps = async (context, client) => {
    const {orderId} = context.query;
    const {data} = await client.get(`/api/orders/${orderId}`);

    
    return { order: data };
}

export default OrderShow;
