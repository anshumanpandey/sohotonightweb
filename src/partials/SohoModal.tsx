import React, { FunctionComponent, useEffect } from 'react';

type Props = { title: string, show: boolean, onClose: () => void, footer: (close: () => void) => any, size?: "lg" }
const SohoModal: FunctionComponent<Props> = ({ title, show = false, onClose, children, footer, size }) => {

    useEffect(() => {
        if (show == true) {
            //@ts-ignore
            $("#modalShow").modal()
        } else {
            //@ts-ignore
            $('#modalShow').modal('hide')
        }
        //@ts-ignore
        $('#modalShow').on('hidden.bs.modal', function (e) {
            onClose()
        })
    }, [show])

    return (
        <div className="modal fade" id="modalShow" tabIndex={-1} role="dialog" aria-labelledby="myModalLabel">
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