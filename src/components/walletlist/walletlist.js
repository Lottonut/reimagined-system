import React, {useEffect, useState} from "react";
import RaffleContract from '../../abis/raffle.json';
import Web3 from "web3";
import Menu from '../include/menu';
import Footer from '../include/footer';
const Hero = () => {
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [raffleCount, setRaffleCount] = useState(0);
  const [participantsCount, setParticipantsCount] = useState(0);
  const [participationList, setParticipationList] = useState([]);
  
  useEffect(() => {
    init();
  }, []);

  const init = async () => {
      let web3 = new Web3('https://bsc-dataseed.binance.org');
      let contract = await new web3.eth.Contract(RaffleContract.ABI, RaffleContract.Contract);
      let raffleCount = parseInt(await contract.methods.rafflesCount().call());
      let raffleDetails = await contract.methods.raffles(raffleCount).call();
      let participantsCount = await contract.methods.getParticipantsCount(raffleCount).call();

      setStartTime(parseInt(raffleDetails.startTime));
      setEndTime(parseInt(raffleDetails.endTime));
      setRaffleCount(parseInt(raffleCount));
      setParticipantsCount(parseInt(participantsCount));

      const participationArray = [];
      for (let i = 0; i < participantsCount; i++) {
          let participant = await contract.methods.getParticipants(raffleCount, i).call();
          participationArray.push(participant);
      }
      await setParticipationList(participationArray);
  }

  return (
    <>
      <Menu />
      <section className="padSection  h100vh">
        <div className="container">
          <h2>Participant List</h2>
          <div className="row">
            <div className="col-sm-3">
              <div className="snShow">
                <label>Raffle Number</label>
                <span className="numbers">{raffleCount}</span>
              </div>
            </div>
            <div className="col-sm-3">
              <div className="snShow">
                <label>Start Time</label>
                <span className="numbers">{startTime !=0 ? new Date(startTime * 1000).toLocaleString('en-US') : '0'}</span>
              </div>
            </div>
            <div className="col-sm-3">
              <div className="snShow">
                <label>End Time</label>
                <span className="numbers">{endTime !=0 ? new Date(endTime * 1000).toLocaleString('en-US') : '0'}</span>
              </div>
            </div>
            <div className="col-sm-3">
              <div className="snShow">
                <label>Total participation</label>
                <span className="numbers">{participantsCount}</span>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-12">
             <div className='tabelHandle table-fluid'>
                <table className="table table-bordered tabel-striped table-hover">
                  <thead>
                    <tr>
                      <th>S.No</th>
                      <th>Participant Address</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      participationList.length > 0 ? 
                        participationList.map((item, index) => {
                          return (
                            <tr>
                               <td>{index+1}</td>
                               <td>{item}</td>
                             </tr>
                          )
                        })
                      :
                      <>
                      </>
                    }
                  </tbody>  
                </table>
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