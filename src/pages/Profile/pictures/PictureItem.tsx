import React, { useEffect } from 'react';

export const PictureItem = ({ image, onClick, isFree = false }: { isFree?: boolean,image: any, onClick: () => any }) => {
    const pictureHeight = 200
    return (
        <div className="item-img-wrap ">
            <img style={{ height: pictureHeight }} src={image.imageName} className="img-responsive" alt="workimg" />
            <div onClick={onClick} className="item-img-overlay">
                <a href="#" onClick={(e) => e.preventDefault()} className="show-image">
                    {isFree === false && <span style={{ paddingTop: pictureHeight / 2.5 }} className="item-img_text"><i className="fa fa-shopping-cart" aria-hidden="true"></i> &nbsp; Buy Now <br />£{image.price}</span>}
                </a>
            </div>
        </div>
    );
}