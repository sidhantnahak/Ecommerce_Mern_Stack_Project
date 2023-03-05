import React from 'react'
import{ReactNavbar}  from "overlay-navbar"
import{FaSearch} from "react-icons/fa"
import{ FaCartArrowDown} from "react-icons/fa"
import{MdAccountCircle} from "react-icons/md"
import logo from "../images/logo.png"


const Header = () => {
      
   return <ReactNavbar
   logo={logo}
   burgerColor="white"
   burgerColorHover= "#eb4034"       
   logoWidth= "20vmax"
   navColor1= "white"
   logoHoverSize= "10px"
   logoHoverColor= "#eb4034"
   link1Text= "Home"
   link2Text= "Products"
   link3Text= "Contact"
   link4Text= "About"
   link1Url= "/"
   link2Url= "/products"
   link3Url= "/contact"
   link4Url= "/about"
   link1ColorHover="#eb4034"
   link1Size= "1.3vmax"
   link1Color= "black"
   nav1justifyContent= "flex-end"
   nav2justifyContent= "flex-end"
   nav3justifyContent= "flex-start"
   nav4justifyContent= "flex-start"
   link1Margin= "1vmax"

   searchIcon={true}
   searchIconUrl='/search'
   SearchIconElement={FaSearch}
   searchIconColor="black"
   searchIconSize="2vmax"

   cartIcon={true}
   cartIconUrl="/cart"
   CartIconElement={FaCartArrowDown}
   cartIconColor="black"
   cartIconSize="2vmax"
   cartIconMargin="15px"
   
   profileIcon={true}
   profileIconUrl='/login'
   profileIconColor="black"
   ProfileIconElement={MdAccountCircle}
   profileIconSize="2vmax"

   

   />
  
}

export default Header