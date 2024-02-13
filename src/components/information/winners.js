import React, {useEffect, useState} from "react";
import LotteryContract from '../../abis/lottery.json';
import Web3 from "web3";
import Menu from '../include/menu';
import Footer from '../include/footer';
const Hero = () => {
  const [winnerList, setWinnerList] = useState([]);
  useEffect(() => {
    init();
  }, []);

  const init = async () => 
  {
      let web3 = new Web3('https://bsc-dataseed.binance.org/');
      let contract = await new web3.eth.Contract(LotteryContract.ABI, LotteryContract.Contract);
      let currentLottery = parseInt(await contract.methods.currentLottery().call());
      const winnerArray = [];
      const startTimeArray = [];
      const endTimeArray = [];
      for (let i = 0; i <= currentLottery; i++) 
      {
          let raffleDetails = await contract.methods.mapWinnerInfo(i).call();
              winnerArray.push({"raffle": i+1, "winner": raffleDetails.winnerWallet, "ticket": parseInt(raffleDetails.winnerTicket), "reward": parseInt(raffleDetails.winnerReward)});
      }
      await setWinnerList(winnerArray);
  }

  function padWithLeadingZeros(num, totalLength) {
       return String(num).padStart(totalLength, '0');
    }
  return (
    <>
      <section className="padSection  h100vh">
        <div className="container">
          <h2 className='cBlack '>Previous  Winners</h2>
           <div className="row">
            <div className="col-sm-12">
            <div className='presaleSlider'>
             <div className='tabelHandle  table-fluid table-responsive'>
                <table className="table table-bordered tabel-striped table-hover">
                  <thead>
                    <tr>
                      <th>Lottery Number</th>
                      <th>Winner Address</th>
                      <th>Winner Ticket</th>
                      <th>Winning Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      winnerList.length > 0 ? 
                        winnerList.slice(0).reverse().map((item, index) => {
                          return (
                            <tr>
                               <td>{parseInt(item.raffle)}</td>
                               <td>{item.winner=="0x0000000000000000000000000000000000000000" ? 'Not Declared Yet' : item.winner}</td>
                               <td>{item.winner=="0x0000000000000000000000000000000000000000" ? 'Not Declared Yet' : padWithLeadingZeros(parseInt(item.ticket), 8)}</td>
                               <td>{item.winner=="0x0000000000000000000000000000000000000000" ? 'Not Declared Yet' : item.reward / 10**18 + ' USDT'}</td>
                             </tr>
                          )
                        })
                      :
                      <>
                      <tr>
                         <td colspan="4" className="text-center">No, record found</td>
                       </tr>
                      </>
                    }
                  </tbody>  
                </table>
              </div>
            </div>
          </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};
export default Hero;