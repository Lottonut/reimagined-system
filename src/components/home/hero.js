import React, { useContext, useEffect, useState, useRef } from "react";
import Footer from '../include/footer';
import Tickets from './tickets';
import Context from "../../context/context";
import LotteryContract from '../../abis/lottery.json';
import USDTContract from '../../abis/usdt.json';
import Web3 from "web3";
import swal from "sweetalert";
import {providerURL, toHex, txAfterDone, txDone, txStart } from '../utils';
import TransactionStatus from "../trxStatus";
import {FaRegStar} from "react-icons/fa";
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import axios from 'axios'

const Hero = () => {
    const [copyaddress, setCopyaddress] = useState('00');
    let subtitle;
    const [modalIsOpen, setIsOpen] = React.useState(false);
    function myCopy(e) {
       navigator.clipboard.writeText(e.currentTarget.title);
       setIsOpen(true);
      setCopyaddress(" " + e.currentTarget.title);
    }
    function afterOpenModal() {
       subtitle.style.color = '#f00';
    }
    function closeModal() {
       setIsOpen(false);
    }
    const {account, providers, onConnect} = useContext(Context);
    const [refresh, setRefresh] = useState(false);
    const [ticketPrice, setTicketPrice] = useState(0);
    const [ticketLimit, setTicketLimit] = useState(0);
    const [ticketSold, setTicketSold] = useState(0);
    const [remainingTickets, setRemainingTickets] = useState(0);
    const [tickets, setTickets] = useState(0);
    const [ticketCount, setTicketCount] = useState(0);
    const [userBalance, setUserBalance] = useState(0);
    const [approvedTokens, setApprovedTokens] = useState(0);
    const [approvedRequired, setApprovedRequired] = useState(0);
    const [sponserCode, setSponserCode] = useState("");
    const [mycode, setMycode] = useState("");
    const [topSponsor, setTopSponsor] = useState("0x0000000000000000000000000000000000000000");
    const [sponsorAmount, setSponsorAmount] = useState("0.00");
    const [stage, setStage] = useState(0);
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const baseurl = "https://lottonut.io?referid=";  

    function getParameterByName(name, url = window.location.href) {
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return "";
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

    function validateEmail(email) {
      var re = /\S+@\S+\.\S+/;
      return re.test(email);
    }

     function validateName(name) {
      var re = /^[a-zA-Z ]+$/;
      return re.test(name);
    }

    useEffect(() => {
          let storedSponserCode = localStorage.getItem("sponserCode")
          if (window.location.href.includes("?referid=")) {
              setSponserCode(String(getParameterByName("referid")).toLowerCase())
              localStorage.setItem("sponserCode", getParameterByName("referid"))
          }
          else if (storedSponserCode) {
              setSponserCode(String(storedSponserCode).toLowerCase())
          }
    }, []);

    useEffect(() => {
      init();
      if(account) 
      {
         getUserData();
      }
    }, [account, refresh]); 

    
    const init = async () => {
      let web3 = new Web3('https://bsc-dataseed.binance.org/');
      let contract = await new web3.eth.Contract(LotteryContract.ABI, LotteryContract.Contract);

      let currentStage = parseInt(await contract.methods.currentStage().call());
      let currentLottery = parseInt(await contract.methods.currentLottery().call());
      let maxTicketPerStage = parseInt(await contract.methods.maxTicketPerStage(currentStage).call());
      let pricePerTicket = parseInt(await contract.methods.pricePerTicket(currentStage).call());
      let ticketSold = parseInt(await contract.methods.ticketSold().call());
      if(ticketSold > 0)
      {
         try 
         {
            let topSponsor = await contract.methods.topSponsor(currentLottery, 0).call();
            let sponsorAmount = parseInt(await contract.methods.sponsorAmount(currentLottery, topSponsor).call()) / 10**18;
            setTopSponsor(topSponsor);
            setSponsorAmount(sponsorAmount);
         }
        catch (error) {}
      }
      setStage(currentStage);
      setTicketPrice(pricePerTicket);
      setTicketLimit(maxTicketPerStage);
      setTicketSold(ticketSold);
      setRemainingTickets(maxTicketPerStage - ticketSold);
    }

    const getUserData = async () =>  {
       const web3 = new Web3(providers);
       const Lottery = new web3.eth.Contract(LotteryContract.ABI, LotteryContract.Contract);
       let currentLottery = parseInt(await Lottery.methods.currentLottery().call());
       let referral = await Lottery.methods.referral(account).call();

       setTicketCount(parseInt(await Lottery.methods.getOwnerTicketCount(currentLottery, account).call()));
       setMycode(referral);

       const USDT = new web3.eth.Contract(USDTContract.ABI, USDTContract.Contract);
       setUserBalance(parseInt(await USDT.methods.balanceOf(account).call()));
       setApprovedTokens(parseInt(await USDT.methods.allowance(account, LotteryContract.Contract).call()));
    }

    function randomString(length, chars) {
        var result = '';
        for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
        var referralCode = result + String(account).slice(2, 6)
        return referralCode;
    }
	
    const buyTicket = async () => {
        const web3 = new Web3(providers);
        const Lottery = await new web3.eth.Contract(LotteryContract.ABI, LotteryContract.Contract);
        try 
        {
            let referralCode = mycode == "" ? randomString(15, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ') : mycode; 
            await Lottery.methods.buyTicket(parseInt(tickets), sponserCode.toLowerCase(), referralCode.toLowerCase()).send({
                  from: account
              }).on('transactionHash', function(payload) {
                  txStart();
              }).on('error', function(error) {
                  swal({
                      title: "Error Found",
                      text: error.message,
                      icon: "error",
                      showCancelButton: false,
                      confirmButtonClass: "btn-danger",
                      confirmButtonText: "Close",
                      closeOnConfirm: false
                  });
              }).then(function(receipt) {
                 txDone()
                 setTimeout(() => {
                    txAfterDone()
                 }, 2000)
                 setRefresh(!refresh)
            });
        }
        catch (error) 
        {
           console.log(error.message);
        }
    }

    const approveToken = async () => {
       try 
       {
          const web3 = new Web3(providers);
          const USDTToken = new web3.eth.Contract(USDTContract.ABI, USDTContract.Contract);
          await USDTToken.methods.approve(LotteryContract.Contract, '115792089237316195423570985008687907853269984665640564039458').send({from: account}).on('transactionHash', function(payload) {
             txStart();
          }).on('error', function(error) {
              swal({
                  title: "Error Found",
                  text: error.message,
                  icon: "error",
                  showCancelButton: false,
                  confirmButtonClass: "btn-danger",
                  confirmButtonText: "Close",
                  closeOnConfirm: false
              });
          }).then(function(receipt) {
             txDone()
             setTimeout(() => {
                txAfterDone()
             }, 2000)
             setRefresh(!refresh)
          });
       }
       catch (error) 
       {
          console.log(error.message);
       }
   }

   async function setCount(count){
       if(parseInt(count) > remainingTickets)
       {
          if(remainingTickets > 200)
          {
              setTickets(200);
              setApprovedRequired(ticketPrice * 200);
          }
          else
          {
              setTickets(remainingTickets);
              setApprovedRequired(ticketPrice * remainingTickets);
          }
       }
       else
       {
          if(count > 200)
          {
              setTickets(200);
              setApprovedRequired(ticketPrice * 200);
          }
          else
          {
              setTickets(count);
              setApprovedRequired(ticketPrice * count);
          }
       }
    }

    async function submitform() {
       const data = {"Name":userName, "Email":userEmail, "Wallet Address": account}
       axios.post('https://sheet.best/api/sheets/aab0763a-db35-48a4-90d0-882653d3b822',data).then(response=>{
           setUserEmail('');
           setUserName('');
           swal({
              title: 'Awesome !',
              text: 'Details Submitted Successfully !',
              type: 'success'
           });
       })
    }

    return (
    <>
       <section className="padSection h100vh ">
          <div className="container">
            <div className='newsletter'>
              <h4>Join the newletter!</h4>
              <div className="row">
                <div className="col-sm-5">
                  <div className="form-group">
                      <input type="text" name="" className="form-control" placeholder="Enter the Name" value={userName} onChange={(e) => setUserName(e.target.value)}/>
                  </div>
                </div>
                <div className="col-sm-5">
                  <div className="form-group">
                     <input type="text" name="" className="form-control" placeholder="Enter the Email" value={userEmail} onChange={(e) => setUserEmail(e.target.value)}/>
                  </div>
                </div>
                <div className="col-sm-2">
                     {
                        account && validateEmail(userEmail) && userName.length > 3 && validateName(userName)?
                        <>
                           <button type='submit' className="orenge_btn w-100" onClick={() => { submitform() }}>Subscribe</button>
                        </>
                        :
                        <>
                           <button type='submit' className="orenge_btn w-100" disabled>Subscribe</button>
                        </>
                     }
                </div>
              </div>
            </div>
            <div className="presaleSlider">
              <div className="row justify-content-center">
                <div className="col-sm-8">
                <div className="purchaseSec justify-content-between align-items-center d-flex mt-0 ">
                    <p>Current Stage: <b>{stage+1} / 5</b></p>
                    <p>Ticket Sold: <b>{((ticketSold / ticketLimit) * 100).toFixed(1)}%</b></p>
                    <p>Ticket Left: <b>{(remainingTickets).toLocaleString()}</b></p>
                  </div>
                  <div className="presaleSliderbody">
                    <div className="row">
                      <div className="col-sm-6">
                        <div className="whiteBox minHei justify-content-center">
                          <div className="d-flex align-items-center">
                            <div className="col-12 col-sm-12 text-center">
                              <div className="CardIcon">
                                <img src="img/1.webp" className="img-fluid IMF" />
                              </div>
                              <h2 className="greenT gt">{parseFloat((ticketPrice/10**18) * ((ticketLimit)/ 3)).toFixed(2)} USDT</h2>
                              <h5>Winning Amount</h5>
                            </div>
                          </div>
                          <div className="loaderAni">
                            <div></div>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <div className="whiteBox inside-info-box minHei inBoxHere">
                          <div>
                            <div className="inputgroup d-flex gap-2">
                              <h5>Buy Tickets</h5>
                            </div>
                            <p className="mb-2">Price Per Ticket : {ticketPrice / 10**18} USDT</p>
                            <div className="inputgroup d-flex gap-2">
                              <input type="number" className="form-control" min="0" max="200" placeholder="0" value={tickets} onChange={(e) => setCount(e.target.value)}/>
                                {
                                  account && tickets > 0 ?
                                    approvedRequired > approvedTokens?
                                   <>
                                      <button type='submit' className="orenge_btn" onClick={() => { approveToken() }}>Approve</button>
                                   </>
                                   :
                                      userBalance >= ticketPrice * tickets ?
                                      <>
                                        <button type='submit' className="orenge_btn" onClick={() => { buyTicket() }}>Buy Ticket</button>
                                      </>
                                      :
                                      <>
                                        <button type='submit' className="orenge_btn" disabled>Buy Ticket</button>
                                      </>
                                  :
                                  <>
                                    <button type='submit' className="orenge_btn" disabled>Buy Ticket</button>
                                  </>
                               }
                            </div>
                            <div className="text-start gastext">
                              <h5 className="text-start snTime">{parseFloat((ticketPrice/10**18) * tickets).toLocaleString()} USDT + Gas Fee Required</h5>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-sm-4">
                  {
                    account ?
                     mycode == "" ?
                     <>
                      <div className="ReferHere text-start">
                       <h3 className="mt-0">Referral Link</h3>
                        <div className="referCode d-flex justify-content-between">
                          <div className="leftSide">
                            <h6>Please purchase your ticket to generate your referral link</h6>
                          </div>
                        </div>
                      </div> 
                     </>
                     :
                    <>
                     <div className="ReferHere text-start">
                      <h3 className="mt-0">Referral Link</h3>
                        <div className="referCode d-flex justify-content-between">
                          <div className="leftSide">
                            <h6>{baseurl}{mycode}</h6>
                          </div>
                          <div className='copyIcon ShareIcon'>
                            <button className='px-2 py-2' title={baseurl+mycode} onClick={myCopy}>
                            <i className="fa-regular fa-copy"></i>
                          </button>
                          </div>
                        </div>
                      </div>
                    </>
                    :
                    <>
                    <div className="ReferHere text-start">
                      <h3 className="mt-0">Referral Link</h3>
                        <div className="referCode d-flex justify-content-between">
                          <div className="leftSide">
                            <h6>Please connect your wallet and purchase your ticket to generate your referral link</h6>
                          </div>
                        </div>
                      </div>
                    </>
                  }
                <div className="ReferHere tReferrals text-start">
                 <h3 className="mt-0">Top Referrals</h3>
                  <div className="d-flex align-items-center gap-2 winner3 ticketsHere text-start">
                      <div className="reText">
                          <p className="mb-1 Text_break">{topSponsor}</p>
                          <h4 className="mb-0">{sponsorAmount} USDT</h4>
                      </div>
                  </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="note ReferHere text-center">
              <h5>You have forgotten leave your email to be informed of all the news.</h5>
            </div>
            {
               account && ticketCount > 0 ?
               <>
                 <Tickets refresh={refresh}/>
               </>
               :
               <>
               </>
            }
          </div>
        </section>
       <TransactionStatus />
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        contentLabel="Example Modal"
      >
      <div className="popupcenter">
        <p className='edittext ' ref={(_subtitle) => (subtitle = _subtitle)}>Copied: <br/>{copyaddress}</p>
        <span className="border-btn-small d-block"><button className="btn small btn-primary " onClick={closeModal}>Close</button></span>
        </div>
      </Modal>

      <Footer />

    </>
  );
};
export default Hero;