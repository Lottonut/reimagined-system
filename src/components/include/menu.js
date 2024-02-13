import React, { useContext, useEffect, useState, useRef } from "react";
import Context from "../../context/context";
import { NavLink as Link, useNavigate } from "react-router-dom";

import Web3 from "web3";
const Menu = () => {
  const {account, onConnect, onDisconnect} = useContext(Context);
  return (
    <>
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <a href='./' className="navbar-brand"><img src="img/logo.png" className="img-fluid" /></a>
        <div className="d-flex">
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon">
            <i className="fa-solid fa-bars"></i>
          </span>
        </button>
        <div className="nav-item mx-2 mobshow">
                { account ?
                      <button className="btn nav-link m-0" onClick={onDisconnect}>{account.substring(0,5)}....{account.substring(38,42)}</button>
                    :
                     <button className="btn nav-link m-0" onClick={onConnect}>Connect Wallet</button>
                }
              </div>
            </div>
        <div className="collapse navbar-collapse" id="navbarText">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0"></ul>
          <span className="navbar-text">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link to="/about" className=" nav-link">About Us</Link>
              </li>
              <li className="nav-item">
                <Link to="/participate" className=" nav-link">How to Participate</Link>
              </li>
              <li className="nav-item">
                <Link to="/rules" className=" nav-link">Rules</Link>
              </li>
              <li className="nav-item">
                <Link to="/previous-winners" className=" nav-link">Previous Winners</Link>
              </li>
              <li className="nav-item mx-2 mobhide">
                { account ?
                      <button className="btn nav-link" onClick={onDisconnect}>{account.substring(0,7)}....{account.substring(37,42)}</button>
                    :
                     <button className="btn nav-link" onClick={onConnect}>Connect Wallet</button>
                }
              </li>
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item social-mob">
                  <a href="https://t.me/lottonut" className="social nav-link" target="_blank"><i className="fa-brands fa-telegram"></i></a>
                </li>
                <li className="nav-item social-mob">
                  <a href="https://twitter.com/Lottonut_io" className="social nav-link" target="_blank"><i className="fa-brands fa-x-twitter"></i></a>
                </li>
              </ul>
            </ul>

          </span>
        </div>
      </div>
    </nav>
    </>
  );
};
export default Menu;