import React, { useEffect } from 'react';

export const PictureItem = ({ image, onClick, innerText, isFree = false, isBought }: { isBought?: boolean, isFree?: boolean,image: any, innerText?: string ,onClick: () => any }) => {
    const pictureHeight = 200
    const pictureWidth = 300
    let tagText = innerText
    let imageUrl = image.assetUrl
    if (isFree == false) {
        tagText = `Buy Now
        ${image.price}
        `
    }
    if (isBought) {
        tagText = `Download`
    }
    return (
        <div className="item-img-wrap ">
            <img style={{ height: pictureHeight, width: pictureWidth }} src={imageUrl} className="img-responsive" alt="workimg" />
            <div onClick={onClick} className="item-img-overlay" style={{ width: pictureWidth }}>
                <a href="#" onClick={(e) => e.preventDefault()} className="show-image">
                    {isFree === false && <span style={{ paddingTop: pictureHeight / 2.5 }} className="item-img_text"><i className="fa fa-shopping-cart" aria-hidden="true"></i>{tagText}</span>}
                </a>
            </div>
        </div>
    );
}