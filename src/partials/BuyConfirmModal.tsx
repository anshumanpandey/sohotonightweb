import useAxios from 'axios-hooks';
import React from 'react';
import Loader from 'react-loader-spinner';
//@ts-ignore
import { hideConfirmBuyingAsset, setSuccessAlert, updateCurrentUser, useGlobalState } from '../state/GlobalState';
import { BrandColor } from '../utils/Colors';
import SohoButton from './SohoButton';
import SohoModal from './SohoModal';

const BuyConfirmModal: React.FC = () => {
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
            setSuccessAlert("Item bought successfully")
            hideConfirmBuyingAsset()
        })
    }

    return (
        <SohoModal
            closeOnBackdropClik={false}
            onClose={() => hideConfirmBuyingAsset()}
            show={currentBuyingAsset != null}
            title="Do you want to buy this asset?"
            footer={(close) => {
                return (
                    <div style={{ display: 'flex', justifyContent: "space-around" }}>
                        <SohoButton style={{ width: '25%' }} disabled={loading} onClick={() => close()} value={"Cancel"} />
                        <SohoButton style={{ width: '25%' }} disabled={loading} onClick={doBuy} value={"Accept"} />
                    </div>
                )
            }}
        >
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
        </SohoModal>
    );
}
export default BuyConfirmModal;
