import React, { FunctionComponent, useEffect } from 'react';

type Props = { title: string, show: boolean, onClose: () => void, closeOnBackdropClik?: boolean, footer: (close: () => void) => any, size?: "lg" }
const SohoModal: FunctionComponent<Props> = ({ title, show = false, onClose, closeOnBackdropClik = true, children, footer, size }) => {
    let htmlId = Math.random().toString(36).substring(7);

    useEffect(() => {
        if (show == true) {
            //@ts-ignore
            $(`#${htmlId}`).modal()
        } else {
            //@ts-ignore
            $(`#${htmlId}`).modal('hide')
        }
        //@ts-ignore
        $(`#${htmlId}`).on('hidden.bs.modal', function (e) {
            onClose()
        })
    }, [show])

    return (
        <div className="modal fade modal-fullscreen-xs-down" data-backdrop={closeOnBackdropClik == true ? "true": "static"} id={htmlId} tabIndex={-1} role="dialog" aria-labelledby="myModalLabel">
            <div className={`modal-dialog ${size ? 'modal-lg': undefined}`} role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                        <h4 className="modal-title" id="myModalLabel">{title}</h4>
                    </div>
                    <div className="modal-body text-centers">
                        {children}
                    </div>
                    <div className="modal-footer">
                        {footer(onClose)}
                    </div>
                </div>
            </div>
        </div>
    );
}
export default SohoModal;