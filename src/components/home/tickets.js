import React, { useContext, useEffect, useState, useRef } from "react";
import Context from "../../context/context";
import LotteryContract from '../../abis/lottery.json';
import Web3 from "web3";
import { FaRegStar } from "react-icons/fa";
import { IoReload } from "react-icons/io5";

const Hero = (refresh) => {
  const {account, providers} = useContext(Context);
  const [ticket, setTicket] = useState([]);

   useEffect(() => {
     init()
   }, [account, refresh]);

   const init = async () => {
       let web3 = new Web3(providers);
       let Lottery = await new web3.eth.Contract(LotteryContract.ABI, LotteryContract.Contract);

       let currentLottery = parseInt(await Lottery.methods.currentLottery().call());
       let ticketCount = parseInt(await Lottery.methods.getOwnerTicketCount(currentLottery, account).call());
       const ticketArray = [];
       for (let i = 0; i < ticketCount; i++) 
       {
          var ticket = parseInt(await Lottery.methods.getOwnerTicket(currentLottery, account, i).call());
          ticketArray.push(ticket);
       }
       setTicket(ticketArray);
    }

    function padWithLeadingZeros(num, totalLength) {
       return String(num).padStart(totalLength, '0');
    }
  return (
    <>
    <div className="Avaiblaraffele mt-5 stakeSection">
      <div className=" single_cart ">
        <h3 className="mb-2 text-center mt-0 cBlack">Your Ticket</h3>
        <div className=" bottom_in">
          <div className="row text-center">
            {
               ticket.map((item, index) => {
                  return (
                    <div className="col-sm-6 col-lg-4 col-xl-3" key={"pTGC"+index}>
                      <div className=" small_boxes_slider ticketsHere text-start d-flex gap-3 align-items-center">
                        <div className='linHere'></div>
                        <div className='stars'>
                            <i className="fa-regular fa-star star1"></i>
                            <i className="fa-regular fa-star star2"></i>
                            <i className="fa-regular fa-star star3"></i>
                          </div>
                          <h4 className="alignHere d-flex align-items-center flex-grow-0"> 
                           <div className="imgHerer">
                              <img src='./img/w.png' className="img-fluid flex-grow-1  d-flex" />
                            </div> <span>{padWithLeadingZeros(item, 8)}</span>
                          </h4>
                     </div>
                   </div>
                  )
               })
            }
          </div>
        </div>
      </div>
    </div>
    </>
  );
};
export default Hero;