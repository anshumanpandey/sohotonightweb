import React, { useState } from 'react';
import { setSuccessAlert, showBuyTokensModal, updateCurrentUser, useGlobalState } from '../state/GlobalState';
import BuyTokenForm from './BuyTokenForm';
import SohoModal from './SohoModal';


const BuyTokenModal: React.FC = () => {
    const [buyTokenModal] = useGlobalState("buyTokenModal");

    return (
        <SohoModal
            onClose={() => showBuyTokensModal(false)}
            show={buyTokenModal}
            title="Buy Tokens"
            footer={() => <button onClick={() => showBuyTokensModal(false)} type="button" className="btn btn-default">Close</button>}
        >
            <BuyTokenForm />
        </SohoModal>
    );
}
export default BuyTokenModal;
