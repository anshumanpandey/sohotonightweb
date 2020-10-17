import React, { useEffect } from 'react';

export const PictureItem = ({ src, onClick } : { src: string, onClick: () => any }) => {
    return (
        <div className="mix col-sm-4 page1 page4 margin30">
            <div className="item-img-wrap ">
                <img onClick={onClick} src={src} className="img-responsive" alt="workimg" />
            </div>
        </div>
    );
}