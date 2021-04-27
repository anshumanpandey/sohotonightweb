import React, { useEffect } from 'react';

export const PictureItem = ({ image, onClick, innerText, isFree = false }: { isFree?: boolean,image: any, innerText?: string ,onClick: () => any }) => {
    const pictureHeight = 200
    const pictureWidth = 300
    return (
        <div className="item-img-wrap ">
            <img style={{ height: pictureHeight, width: pictureWidth }} src={image.imageName} className="img-responsive" alt="workimg" />
            <div onClick={onClick} className="item-img-overlay" style={{ width: pictureWidth }}>
                <a href="#" onClick={(e) => e.preventDefault()} className="show-image">
                    {isFree === false && <span style={{ paddingTop: pictureHeight / 2.5 }} className="item-img_text"><i className="fa fa-shopping-cart" aria-hidden="true"></i>{innerText ? innerText: <>&nbsp; Buy Now <br />{image.price}</>} </span>}
                </a>
            </div>
        </div>
    );
}