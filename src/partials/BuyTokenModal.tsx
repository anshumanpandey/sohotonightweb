import useAxios from 'axios-hooks';
import React, { useState } from 'react';
import { PayPalButton } from 'react-paypal-button-v2';
import { SavePayment } from '../request/paypal.requests';
import { setSuccessAlert, showBuyTokensModal, updateCurrentUser, useGlobalState } from '../state/GlobalState';
import { BrandColor } from '../utils/Colors';
import SohoModal from './SohoModal';
import Color from 'color';


type PackOptionParams = { value: number, onSelected: (v: number) => void, isChecked: boolean, pricePerToken: number }
const PackOption = ({ value, onSelected, isChecked, pricePerToken }: PackOptionParams) => {
    return (
        <>
            <div className="radio" style={{ border: `1px solid ${isChecked ? BrandColor : Color(BrandColor).lighten(0.7)}`, borderRadius: "25px", margin: 10 }}>
                <label style={{ margin: 0, padding: 10 }}>
                    <input
                        type="radio"
                        name={"phoneChat"}
                        value={value}
                        onChange={() => onSelected(value)}
                        checked={isChecked}
                    />
                    <span className="text" style={{ color: isChecked ? BrandColor : undefined }}>
                        {value} tokens * {pricePerToken} GBP each = {value * pricePerToken} GBP
                    </span>
                </label>
            </div>
        </>
    )
}

const tokenPackOptions = [10, 30, 50]
const BuyTokenModal: React.FC = () => {
    const [selectedPack, setSelectedPack] = useState<undefined | number>()
    const [btnIsReady, setBtnIsReady] = useState<boolean>(false)
    const [buyTokenModal] = useGlobalState("buyTokenModal");

    const [paymentReq, doSave] = useAxios({
        url: '/payment/tokensPurchase/',
        method: 'post'
    }, { manual: true })

    const [appConfigReq] = useAxios({
        url: '/appConfigs/get/',
    })

    const disablePaymentButton = () => {
        return selectedPack === undefined || btnIsReady === false
    }

    return (
        <SohoModal
            onClose={() => showBuyTokensModal(false)}
            show={buyTokenModal}
            title="Buy Tokens"
            footer={() => <button onClick={() => showBuyTokensModal(false)} type="button" className="btn btn-default">Close</button>}
        >
            <>
                {tokenPackOptions.map(v => {
                    return (
                        <PackOption
                            value={v} 
                            isChecked={selectedPack == v}
                            pricePerToken={appConfigReq?.data?.pricePerToken}
                            onSelected={(p) => setSelectedPack(p)}
                        />
                    )
                })}
                <div style={{ pointerEvents: disablePaymentButton() ? 'none' : 'unset', opacity: disablePaymentButton() ? 0.4 : 1, width: '30%', margin: 'auto' }}>
                    <PayPalButton
                        amount={(selectedPack || 0) * appConfigReq?.data?.pricePerToken}
                        onButtonReady={() => {
                            setBtnIsReady(true)
                        }}
                        // shippingPreference="NO_SHIPPING" // default is "GET_FROM_FILE"
                        onSuccess={(details: any, data: any) => {
                            doSave({ data: { transactionId: data.orderID, amount: selectedPack } })
                                .then(() => {
                                    setSuccessAlert("Payment Saved!")
                                    return updateCurrentUser()
                                })
                                .then(() => {
                                    showBuyTokensModal(false)
                                })
                        }}
                        options={{
                            clientId: "Ad_1yqkg40dYYOkw1oWZLkl0L_RKHEnGgklSB2fG33FzKrtJoPV8QIg_olt4npLOrpBXfukUARdretzX",
                            currency: 'GBP'
                        }}
                    />
                </div>
            </>
        </SohoModal>
    );
}
export default BuyTokenModal;
