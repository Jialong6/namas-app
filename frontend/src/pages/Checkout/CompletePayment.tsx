import React, { useEffect, useState } from "react";
import { useStripe, Elements } from "@stripe/react-stripe-js";
import { loadStripe, Stripe } from "@stripe/stripe-js"

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

const CompletePageContent: React.FC<{ clientSecret: string }> = ({ clientSecret }) => {
    const stripe = useStripe();
    const [status, setStatus] = useState<string>("default");
    const [message, setMessage] = useState<string>("");

    useEffect(() => {
        if (!stripe) return;

        stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent, error }) => {
            if (error) {
                setMessage(error.message || "An unexpected error occurred.");
                setStatus("failed");
                return;
            }
            if (paymentIntent) {
                setStatus(paymentIntent.status);
                if (paymentIntent.status === "succeeded") {
                    setMessage("Purchase successful!");
                } else if (paymentIntent.status === "processing") {
                    setMessage("Your purchase is processing.");
                } else if (paymentIntent.status === "requires_payment_method") {
                    setMessage("Your payment was not successful, please try again.");
                }
            }
        });
    }, [stripe, clientSecret]);

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-2xl font-semibold mb-4">{message}</h2>
            {status === "succeeded" && (
                <p>Thank you for your purchase!</p>
            )}
            {status !== "succeeded" && status !== "default" && (
                <p>There was an issue with your purchase. Please try again.</p>
            )}
        </div>
    );
};

const CompletePage: React.FC = () => {
    const searchParams = new URLSearchParams(window.location.search);
    const clientSecret = searchParams.get("payment_intent_client_secret");

    if (!clientSecret) {
        return (
            <div className="container mx-auto px-4 py-8">
                <h2 className="text-2xl font-semibold">No Payment Intent found.</h2>
            </div>
        );
    }

    const options = {
        clientSecret,
    };

    return (
        <Elements stripe={stripePromise} options={options}>
            <CompletePageContent clientSecret={clientSecret} />
        </Elements>
    );
};

export default CompletePage;
