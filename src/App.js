import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './style-sheets/app.css';
import './style-sheets/responsive.css';
import './style-sheets/custom.css';
import Home from './pages/index';
import Menu from './components/include/menu';
import PreWinners from './components/information/winners';
import About from './components/information/about';
import Rules from './components/information/rules';
import Participate from './components/information/participate';
import { EthereumProvider } from "@walletconnect/ethereum-provider";
import swal from "sweetalert";
import Web3 from "web3";
import Context from './context/context';
import Reactconnectwallet from './react-wallet/reactconnectwallet';

export default function App() {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [providers, setProviders] = useState();
  const [account, setAccount] = useState();
  const projectId = 'b7a6eea3e6ba336a600d424eec762b27';
  let provider;

  async function reactconnectwalletModal() {
     setIsOpen(true);
  }

  useEffect(() => {
    let lastprovider = localStorage.getItem("lastprovider");
    if(lastprovider=="metamask")
    {
        onMetamaskConnect();
    }
    else if(lastprovider=="walletconnect")
    {
        onWalletConnect();
    }
  }, []);

  async function onMetamaskConnect(){
     await setIsOpen(false);
      try {
          await window.ethereum.request({method:'eth_requestAccounts'});
          provider =  window.ethereum;
          await setProviders(provider);  
          localStorage.setItem("lastprovider", 'metamask');
          await window.ethereum.enable();
          provider.on("accountsChanged", (account) => {
             setAccount(account[0]);
          });
          provider.on("chainChanged", (chainId) => {
             if(parseInt(chainId) != 56)
             {
                 swal({
                    title: "Error Found",
                    text: 'Make Sure You Are Using The Binance Network',
                    type: "error",
                    showCancelButton: false,
                    confirmButtonClass: "btn-danger",
                    confirmButtonText: "Ok",
                    closeOnConfirm: false
                });
             }
          });
         await init();
      } catch (e) {
          console.log("Could not get a metamask connection", e);
      }
  }

  async function onWalletConnect() {
     await setIsOpen(false);
     try {
          provider = await EthereumProvider.init({
              projectId,
              showQrModal: true,
              qrModalOptions: {
                themeMode: "light",
              },
              chains: [56]
          });
          await setProviders(provider);  
          localStorage.setItem("lastprovider", 'walletconnect'); 
          await provider.enable();
          provider.on("accountsChanged", (account) => {
             setAccount(account[0]);
          });
          provider.on("chainChanged", (chainId) => {
             console.log(chainId);
             if(parseInt(chainId) != 56)
             {
                 swal({
                    title: "Error Found",
                    text: 'Make Sure You Are Using The Binance Network',
                    type: "error",
                    showCancelButton: false,
                    confirmButtonClass: "btn-danger",
                    confirmButtonText: "Ok",
                    closeOnConfirm: false
                });
             }
          });
          await init();
      } catch (e) {
          console.log("Could not get a wallet connection", e);
          return;
      }
  }

  async function onConnect() {
     setIsOpen(true);
  }

  async function onDisconnect() {
     setAccount();
     localStorage.setItem("lastprovider", ''); 
  }

  async function init() {
     let web3 = new Web3(provider);
     let account = await web3.eth.getAccounts();
     setAccount(account[0]);
     let chainId = await web3.eth.getChainId();
     if(parseInt(chainId) != 56)
     {
         swal({
            title: "Error Found",
            text: 'Make Sure You Are Using The Binance Network',
            type: "error",
            showCancelButton: false,
            confirmButtonClass: "btn-danger",
            confirmButtonText: "Ok",
            closeOnConfirm: false
        });
     }
  }
  return (
  <> 
    <Context.Provider value={{account, providers, onConnect, onDisconnect}}>
       <Router>
       <Menu />
          <Routes>
           <Route path='/' exact element={<Home />} />
           <Route path='/previous-winners' exact element={<PreWinners />} />
           <Route path='/about' exact element={<About />} />
           <Route path='/rules' exact element={<Rules />} />
           <Route path='/participate' exact element={<Participate />} />

         </Routes>
       </Router>
    </Context.Provider>   
    <Reactconnectwallet onWalletConnect={onWalletConnect} onMetamaskConnect={onMetamaskConnect} modalIsOpen={modalIsOpen} setIsOpen={setIsOpen}  />
   </>
  );
}

