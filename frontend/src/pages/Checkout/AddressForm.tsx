// src/components/AddressForm.tsx

import React from 'react';
import { AddressElement } from '@stripe/react-stripe-js';
import { IShippingAddress } from 'types/order.interface';

interface AddressFormProps {
    onAddressChange: (address: IShippingAddress | null) => void;
}

const AddressForm: React.FC<AddressFormProps> = ({ onAddressChange }) => {
    const handleAddressChange = (event: any) => {
        if (event.complete) {
            const address = event.value.address;
            const addressData: IShippingAddress = {
                streetAddress: address.line1,
                city: address.city,
                state: address.state,
                postalCode: address.postal_code,
                country: address.country,
                phoneNumber: address.phone || '',
                email: address.email || '',
                firstName: address.firstname,
                lastName: address.lastname,
            };
            onAddressChange(addressData);
        } else {
            onAddressChange(null);
        }
    };

    return (
        <div className="space-y-4">
            <div className="border p-4 rounded">
                <AddressElement
                    options={{
                        mode: 'shipping',
                        autocomplete: {
                            mode: 'google_maps_api',
                            apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
                        },
                        fields: {
                            phone: 'always',
                        },
                    }}
                    onChange={handleAddressChange}
                />
            </div>
        </div>
    );
};

export default AddressForm;
