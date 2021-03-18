import React, { useState } from 'react';
import { BrandColor } from '../utils/Colors';
import Color from 'color';
import Loader from "react-loader-spinner";
import useAxios from 'axios-hooks';
import { PayPalButton } from 'react-paypal-button-v2';
import { setSuccessAlert, showBuyTokensModal, updateCurrentUser } from '../state/GlobalState';

type PackOptionParams = { value: number, onSelected: (v: number) => void, isChecked: boolean, pricePerToken: number }
const PackOption = ({ value, onSelected, isChecked, pricePerToken }: PackOptionParams) => {
    return (
        <>
            <div onClick={() => onSelected(value)} className="radio" style={{ cursor: 'pointer', border: `1px solid ${isChecked ? BrandColor : Color(BrandColor).lighten(0.7)}`, borderRadius: "25px", marginBottom: 20 }}>
                <label style={{ margin: 0, padding: 10 }}>
                    <input
                        type="radio"
                        name={"phoneChat"}
                        value={value}
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
const BuyTokenForm: React.FC<{ onPaymenDone?: () => void }> = ({ onPaymenDone }) => {

    const [selectedPack, setSelectedPack] = useState<undefined | number>()
    const [btnIsReady, setBtnIsReady] = useState<boolean>(false)

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

    const getPrice = () => {
        if (!selectedPack) return 1
        if (!appConfigReq?.data?.pricePerToken) return 1
        return selectedPack * appConfigReq?.data?.pricePerToken
    }

    if (appConfigReq.loading) {
        return <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Loader
                type="Circles"
                color={BrandColor}
                height={100}
                width={100}
            />
        </div>
    }

    return (
        <>
            {tokenPackOptions.map(v => {
                return (
                    <PackOption
                        key={`${v}-item`}
                        value={v}
                        isChecked={selectedPack == v}
                        pricePerToken={appConfigReq?.data?.pricePerToken}
                        onSelected={(p) => setSelectedPack(p)}
                    />
                )
            })}
            <div style={{ pointerEvents: disablePaymentButton() ? 'none' : 'unset', opacity: disablePaymentButton() ? 0.4 : 1, width: '30%', margin: 'auto' }}>
                <PayPalButton
                    amount={getPrice()}
                    onButtonReady={() => {
                        setBtnIsReady(true)
                    }}
                    // shippingPreference="NO_SHIPPING" // default is "GET_FROM_FILE"
                    onSuccess={(details: any, data: any) => {
                        doSave({ data: { transactionId: data.orderID, amount: selectedPack } })
                            .then(() => {
                                onPaymenDone && onPaymenDone()
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
    );
}
export default BuyTokenForm;
