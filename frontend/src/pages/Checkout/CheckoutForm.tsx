import React, { useState } from "react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { IShippingAddress } from 'types/order.interface';
import { checkout } from '@services/orderService';

const CheckoutForm: React.FC<{ shippingAddress: IShippingAddress | null }> = ({
  shippingAddress,
}) => {
  const stripe = useStripe();
  const elements = useElements();

    const [message, setMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        if (!shippingAddress) {
            setMessage('Shipping address is required.');
            return;
        }

        setIsLoading(true);

        try {
            await checkout(shippingAddress);
        } catch (error) {
            console.error(error);
        }

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: import.meta.env.VITE_RETURN_URL || "http://localhost:5173/complete",
            },
        });

        if (error && (error.type === "card_error" || error.type === "validation_error")) {
            setMessage(error.message || "An unexpected error occurred.");
        } else if (!error) {
            setMessage("Payment successful!");
        } else {
            setMessage("An unexpected error occurred.");
        }

        setIsLoading(false);
    };

    return (
        <form id="payment-form" onSubmit={handleSubmit}>
            <PaymentElement id="payment-element" />
            <button
                disabled={isLoading || !stripe || !elements}
                id="submit"
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
            >
                {isLoading ? <div className="spinner" id="spinner"></div> : "Pay now"}
            </button>
            {message && <div id="payment-message">{message}</div>}
        </form>
    );
};

export default CheckoutForm;
