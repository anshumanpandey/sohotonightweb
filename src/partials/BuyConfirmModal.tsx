import useAxios from 'axios-hooks';
import React from 'react';
import Loader from 'react-loader-spinner';
import { useHistory } from 'react-router-dom';
//@ts-ignore
import { hideConfirmBuyingAsset, setSuccessAlert, updateCurrentUser, useGlobalState } from '../state/GlobalState';
import { BrandColor } from '../utils/Colors';
import SohoButton from './SohoButton';
import SohoModal from './SohoModal';

const BuyConfirmModal: React.FC = () => {
    let history = useHistory();
    const [userData] = useGlobalState('userData')
    const [currentBuyingAsset] = useGlobalState('currentBuyingAsset')
    const [{ data, loading, error }, buyAssets] = useAxios({ url: '/assets/buy', method: 'POST' }, { manual: true });

    const doBuy = () => {
        return buyAssets({
            data: {
                "assetId": currentBuyingAsset.id,
                "userId": currentBuyingAsset.userId,
                "assetType": currentBuyingAsset.type
            }
        })
            .then(() => updateCurrentUser())
            .then(() => {
                setSuccessAlert("Purchase Completed.")
                hideConfirmBuyingAsset()
                history.go(0)
                history.push(history.location.pathname + '?tabIdx=1')
            })
    }

    const userHasNoEnoughBalance = () => {
        return currentBuyingAsset && userData && currentBuyingAsset.price > userData.tokensBalance
    }

    const resolveBody = () => {
        if (userHasNoEnoughBalance()) {
            return (
                <p style={{ fontSize: 20, color: BrandColor, textAlign: 'center' }}>
                    You dont have enough tokens to buy this item. {`\n`}
                    Purchase more and continue enjoying our contetn
                </p>
            )
        }
        return (
            <>
                {loading && (<div style={{ pointerEvents: "none", position: 'absolute', backgroundColor: '#ffffff50', display: 'flex', justifyContent: 'center', width: '100%', height: '100%' }}>
                    <Loader
                        type="ThreeDots"
                        color={BrandColor}
                        height={80}
                        width={80}
                    />
                </div>)}
                {currentBuyingAsset && <p style={{ fontSize: 20, color: BrandColor, textAlign: 'center' }}>
                    You are about to buy 1 {currentBuyingAsset.type} for {currentBuyingAsset.price} tokens
            </p>}
            </>
        )
    }


    const resolveFooter = (close: any) => {
        if (userHasNoEnoughBalance()) {
            return (
                <div style={{ display: 'flex', justifyContent: "space-around" }}>
                    <SohoButton
                        style={{ width: '25%' }}
                        disabled={loading}
                        onClick={() => {
                            history.push(`/payment`)
                            close()
                        }}
                        value={"Buy More Tokens"} />
                </div>
            )
        }
        return (
            <div style={{ display: 'flex', justifyContent: "space-around" }}>
                <SohoButton style={{ width: '25%' }} disabled={loading} onClick={() => close()} value={"Cancel"} />
                <SohoButton style={{ width: '25%' }} disabled={loading} onClick={doBuy} value={"Accept"} />
            </div>
        )
    }

    return (
        <SohoModal
            closeOnBackdropClik={false}
            onClose={() => hideConfirmBuyingAsset()}
            show={currentBuyingAsset != null}
            title="Do you want to buy this asset?"
            footer={resolveFooter}
        >
            {resolveBody()}
        </SohoModal>
    );
}
export default BuyConfirmModal;
