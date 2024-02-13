import React, {useEffect, useState} from "react";
import LotteryContract from '../../abis/lottery.json';
import Web3 from "web3";
import Menu from '../include/menu';
import Footer from '../include/footer';
const Hero = () => {
  
  return (
    <>
      <section className="padSection  h100vh textblack">
        <div className="container">
          <h2 className='cBlack '>Rules</h2>
          <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum. </p>
        </div>
      </section>
      <Footer />
    </>
  );
};
export default Hero;