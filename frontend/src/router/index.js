import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { WrapComps } from '../components/hoc/componenHoc'
import Home from "../components/home/home";
import Login from "../components/login/login";
import Register from "../components/register/register";
import Listing from "../components/listing/listing";
import AddList from "../components/addlist/addlist";
import UpdateList from "../components/updatelist/updatelist";
import ListInfo from "../components/listinfo/listinfo";
import Booking from "../components/booking/booking";
import ListingView from "../components/listing/ListingView.js";
import ManagingBooking from "../components/booking/ManagingBooking.js";
export default function Index() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" exact element={<WrapComps el={Home}/>}/>
          <Route path="/login" exact element={<WrapComps el={Login}/>}/>
          <Route path="/register" exact element={<Register/>}/>
          <Route path="/listing" exact element={<Listing/>}/>
          <Route path="/listing/:listingId" element={<ListingView/>}></Route>
          <Route path="/listing/:listingId/booking" element={<ManagingBooking/>}></Route>
          <Route path="/addlist" exact element={<AddList/>}/>
          <Route path="/updatelist/:listingId" exact element={<WrapComps el={UpdateList}/>}/>
          <Route path="/listinfo" exact element={<ListInfo/>}/>
          <Route path="/booking" exact element={<Booking/>}/>
        </Routes>
      </BrowserRouter>
  );
}
