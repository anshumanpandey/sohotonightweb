import React, { useEffect } from 'react';

export const PictureUploadItem = ({ src, onDeleteClick, onClick }: { src: string, onClick: () => any, onDeleteClick: () => void}) => {
    return (
        <div className="mix col-sm-4 page1 page4 margin30">
            <div className="item-img-wrap">
                <a href="#" onClick={(e) => {
                    e.preventDefault()
                    onDeleteClick()
                }} className="show-image">
                    <span style={{ color: "white", fontSize: "18px", right: 0, backgroundColor: '#d32a6b80', padding: '0.5rem', borderRadius: "0.25rem" }} className="item-img_text">
                        <i className="fa fa-times" aria-hidden="true"></i>
                                                            Delete
                                                        </span>
                </a>
                <img onClick={onClick} src={src} className="img-responsive" alt="workimg" />

            </div>
        </div>
    );
}