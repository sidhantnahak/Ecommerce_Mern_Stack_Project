import React from 'react'
import playstore from '../images/playstore.png'
import appstore from '../images/Appstore.png'
import './Footer.css'

const Footer = () => {
    return (
        <footer>
            <div className="leftFooter">
                <h4> Download our app</h4>
                <p>Download App for android and ios mobile</p>
                <img src={playstore} alt="playstore" /><img src={appstore} alt="appstore" />
            </div>
            <div className="midFooter">
                <h1>Ecommerce</h1>
                <p>High quality is our first priority</p>
                <p>copyrights 2021 &copy; Mesclasshant</p>
            </div>
            <div className="rightFooter">
                <h4>Follow us </h4>
                <a href="https://www.instagram.com">Instagram</a><a href="https://www.youtube.com">Youtube</a><a href="https://www.facebook.com">Facebook</a>
            </div>
        </footer>
    )
}

export default Footer