import './App.css';
import Header from "./component/layout/Header/Header.js";
import UserOptions from "./component/layout/Header/UserOptions"
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import webfont from "webfontloader"
import React from 'react';
import Footer from './component/layout/Footer/Footer';
import Home from './component/layout/Home/Home.js';
import ProductDetails from './component/layout/products/ProductDetails';
import Products from './component/layout/products/Products';
import Search from './component/layout/products/Search'
import LoginSignup from './component/User/LoginSignup';
import store from './Store'
import { loadUser } from './actions/UserAction';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import Profile from './component/User/Profile';
import UpdateProfile from './component/User/UpdateProfile';
import UpdatePassword from './component/User/UpdatePassword';
import ProtectedRoute from './component/Route/ProtectedRoute';
import ForgetPassword from "./component/User/ForgetPassword"
import ResetPassword from './component/User/ResetPassword';
import Cart from './component/layout/cart/Cart';
import Shipping from './component/layout/cart/Shipping';
import ConfirmOrder from './component/layout/cart/ConfirmOrder';
import axios from "axios";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Payment from './component/layout/cart/Payment';
import OrderSuccess from './component/layout/cart/OrderSuccess';
import MyOrders from './component/layout/order/MyOrders';
import OrderDetails from './component/layout/order/OrderDetails';
import Dashboard from './component/layout/admin/Dashboard';
import AdminRoute from './component/Route/AdminRoute';
import ProductList from './component/layout/admin/Productlist';
import NewProduct from './component/layout/admin/Newproduct';
import UpdateProduct from './component/layout/admin/Updateproduct';
import OrderList from './component/layout/admin/Orderlist';
import ProcessOrder from './component/layout/admin/Processorder';
import Userslist from './component/layout/admin/Userslist';
import Updateuser from './component/layout/admin/Updateuser';
import ProductReviews from './component/layout/admin/ProductReviews';
import About from './component/layout/about/About';
import Contact from './component/layout/contact/Contact';
import Notfound from './component/layout/Notfound';

function App() {

   const [stripeApiKey, setStripeApiKey] = useState("");
   const { isAuthenticated, user } = useSelector(state => state.user)

   async function getStripeApiKey() {
      const { data } = await axios.get("/api/vi/stripeapikey");
      setStripeApiKey(data.stripeApiKey);
   }

   useEffect(() => {
      webfont.load({
         google: {
            families: ["Roboto", "Droid Sans", "Chilanka"]
         }

      })
      getStripeApiKey()
      store.dispatch(loadUser())
   }, [])

   //  window.addEventListener("contextmenu",(e)=>{e.preventDefault()})

   return (
      <Router>

         <Header />

         {isAuthenticated && <UserOptions user={user} />}

         <Routes>

            <Route exact path='/' element={<Home />} />
            <Route exact path='/product/:id' element={<ProductDetails />} />
            <Route exact path='/products' element={<Products />} />
            <Route path='/products/:keyword' element={<Products />} />
            <Route exact path='/search' element={<Search />} />

            <Route element={<AdminRoute isAdmin={true} />}>

               <Route exact path='/admin/dashboard' element={<Dashboard />} />
               <Route exact path='/admin/products' element={<ProductList />} />
               <Route exact path='/admin/product' element={<NewProduct />} />
               <Route exact path='/admin/product/:id' element={<UpdateProduct />} />
               <Route exact path='/admin/orders' element={<OrderList />} />
               <Route exact path='/admin/order/:id' element={<ProcessOrder />} />
               <Route exact path='/admin/users' element={<Userslist />} />
               <Route exact path='/admin/user/:id' element={<Updateuser />} />
               <Route exact path='/admin/reviews' element={<ProductReviews />} />

            </Route>

            <Route element={<ProtectedRoute />}>

               <Route exact path='/account' element={<Profile />} />
               <Route exact path='/me/update' element={<UpdateProfile />} />
               <Route exact path='/password/update' element={<UpdatePassword />} />
               <Route exact path='/login/shipping' element={<Shipping />} />
               <Route exact path='/order/confirm' element={<ConfirmOrder />} />
               <Route>
                  {stripeApiKey && <Route path="/process/payment" element={(<Elements stripe={loadStripe(stripeApiKey)}> {<Payment />}</Elements>)} />}
               </Route>
               <Route exact path='/success' element={<OrderSuccess />} />
               <Route exact path='/orders' element={<MyOrders />} />
               <Route exact path='/order/:id' element={<OrderDetails />} />

            </Route>


            <Route exact path='/password/forget' element={<ForgetPassword />} />
            <Route exact path='/password/reset/:token' element={<ResetPassword />} />
            <Route exact path='/login' element={<LoginSignup />} />
            <Route exact path='/about' element={<About />} />
            <Route exact path='/contact' element={<Contact />} />
            <Route exact path='/cart' element={<Cart />} />
            <Route path='*' element={<Notfound />} />

         </Routes>
         <Footer />
      </Router>
   )

}

export default App;
