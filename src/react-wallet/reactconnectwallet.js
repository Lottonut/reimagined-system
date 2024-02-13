import React, { useContext, useEffect, useState, useRef } from "react";
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
const WalletModal = ({  modalIsOpen, setIsOpen, onWalletConnect, onMetamaskConnect }) => {
  function closeModal() {
     setIsOpen(false);
  }
  let injectedProvider = typeof window.ethereum !== 'undefined' ? true : false;
  return (
     <>     
       <Modal className="modalWallet" ariaHideApp={false} isOpen={modalIsOpen} onRequestClose={closeModal} contentLabel="Wallet Modal">
          <div className="popupcenter">
            <div className="modalHeader d-flex justify-content-between align-items-center">
              <h2>Wallet Connect</h2>
              <button onClick={closeModal}><i className="fa-regular fa-circle-xmark"></i></button>
            </div>
            <hr />
            <div className="modalBody">
               { injectedProvider ?
                 <>
                 <button className="snWallet snWallet2 d-flex justify-content-between align-items-center" onClick={onMetamaskConnect}>
                    <img src="walletimg/metamask.png" className="img-fluid" />
                    <h4>MetaMask or Trust Wallet<span className="labelspan">Popular</span></h4>
                 </button>
                 </> 
                 :
                 <>
                 </>
               }
               <button className="snWallet d-flex justify-content-between align-items-center" onClick={onWalletConnect}>
                <img src="walletimg/walletconnect-logo.png" className="img-fluid" />
                <h4>WalletConnect</h4>
              </button>
            </div>
          </div>
        </Modal>
      </>
    );
};
export default WalletModal;