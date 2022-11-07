import type { NextPage } from 'next';
import Head from 'next/head';
import Header from '../components/Header';
import { useContract, useMetamask, useDisconnect, useAddress, useContractRead, useContractWrite } from '@thirdweb-dev/react';
import Login from '../components/Login';
import Loading from '../components/Loading';
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { currency } from '../constants';
import CountDownTimer from '../components/CountDownTimer';
import toast from 'react-hot-toast';
import Marquee from 'react-fast-marquee';
import AdminControls from '../components/AdminControls';


const Home: NextPage = () => {

  const address = useAddress();
  const [quantity, setQuantity] = useState<number>(1);
  const { contract, isLoading } = useContract(process.env.NEXT_PUBLIC_LOTTERY_CONTRACT_ADDRESS);
  const [userTickets, setUserTickets] = useState(0);


  const { data: expiration } = useContractRead(contract, "expiration");

  const { data: remainingTickets } = useContractRead(contract, "RemainingTickets");

  const { data: currentWinningReward } = useContractRead(contract, "CurrentWinningReward");

  const { data: ticketPrice } = useContractRead(contract, "ticketPrice");

  const { data: ticketCommission } = useContractRead(contract, "ticketCommission");

  const { mutateAsync: BuyTickets } = useContractWrite(contract, "BuyTickets");

  const { data: tickets } = useContractRead(contract, "getTickets");

  const { data: winnings } = useContractRead(contract, "getWinningsForAddress", address);
  
  const { mutateAsync: WithdrawWinnings } = useContractWrite(contract, "WithdrawWinnings");

  const { data: lastWinner } = useContractRead(contract, "lastWinner");
  
  const {data: lastWinnerAmount} = useContractRead(contract, "lastWinnerAmount");
  
  const {data: isLotteryOperator} = useContractRead(contract, "lotteryOperator");

  useEffect(() => {
    if (!tickets) return;

    const totalTickets: string[] = tickets;
    const noOfUserTickets = totalTickets.reduce(
      (total, ticketAddress) => (ticketAddress === address ? total + 1 : total),
      0
    );
    setUserTickets(noOfUserTickets);
  }, [tickets, address])
  // console.log(userTickets);

  const handleClick = async () => {
    if (!ticketPrice) return;

    const notification = toast.loading('Buying your tickets...');

    try {
      const data = await BuyTickets(
        [
          {
            value: ethers.utils.parseEther(
              (
                Number(ethers.utils.formatEther(ticketPrice)) * quantity).toString()
            ),
          },
        ]
      );
      
      toast.success("Tickets Purchased Successfully!", {
        id: notification,
      })
      console.info("Contract call success", data);
    }

    
    catch (err) {
      toast.error("Whoops, something went wrong!", {
        id: notification,
      });

      console.error('Contract call failure', err);
    }
  };

  const onWithdrawWinnings = async () => {
    const notification = toast.loading('Withdrawing your winnings...');

    try {
      const data = await WithdrawWinnings([{}]);
      
      toast.success("Winnings Withdrawn Successfully!", {
        id: notification,
      });
    }

    catch (err) {
      toast.error("Whoops, something went wrong!", {
        id: notification,
      });

      console.error('Contract call failure', err);
    }
  };

  if (isLoading) return <Loading />

  if (!address) return <Login />;

  return (
    <div className="bg-[#091818] min-h-screen flex flex-col">
      <Head>
        <title>CRYPTO LOTTERY DRAW</title>
      </Head>

      <div className='flex-1'>

        <Header />

        <Marquee className='bg-[#0A1F1C] p-5 mb-5' gradient={false} speed={100}>
          <div className='flex space-x-2 mx-10'>
            <h4 className='text-white font-bold'>Last Winner: {lastWinner?.toString()}</h4>
            <h4 className='text-white font-bold'>Previous Winnings: {lastWinnerAmount && ethers.utils.formatEther(lastWinnerAmount?.toString())}{" "}{currency}{" "}</h4>
          </div>
        </Marquee>

        {isLotteryOperator === address && (
        <div className='flex justify-center'>
          <AdminControls/>
        </div>
        )}

        {winnings > 0 && (
          <div onClick={onWithdrawWinnings} className='max-w-md md:max-w-2xl lg:max-w-4xl mx-auto mt-5'>
            <button className='p-5 bg-gradient-to-b from-orange-500 to-emerald-600 animate-pulse text-center rounded-xl w-full'>
              <p className='font-bold'>Winner Winner Chicken Dinner!</p>
              <p>Total Winnings: {ethers.utils.formatEther(winnings.toString())}{" "}
                {currency}
              </p>
              <br />
              <p className='font-semibold'>Click here to withdraw</p>
            </button>
          </div>
        )}

        {/* the next draw box */}
        <div className='space-y-5 ms:space-y-0 m-5 md:flex md:flex-row items-start justify-center md:space-x-5'>
          <div className='stats-container'>
          <h1 className='text-5xl text-white font-semibold text-center'>The Next Draw</h1>
          <div className='flex justify-between p-2 space-x-2'>
            <div className='stats'>
              <h2 className='text-sm'>Total Pool</h2>
              <p className='text-xl'>
                {currentWinningReward && ethers.utils.formatEther(
                  currentWinningReward.toString()
                )}{" "}
                {currency}
              </p>
            </div>
            <div className="stats">
              <h2 className='text-sm'>Tickets Remaining</h2>
              <p className='text-xl'>{remainingTickets?.toNumber()}</p>
            </div>
          </div>


          {/* countdown timer */}

          <div className='mt-5 mb-3'>
            <CountDownTimer/>
            
            </div>

        </div>

        <div className='stats-container space-y-2'>
          <div className="stats-container">
            <div className='flex justify-between items-center text-white pb-2'>
              <h2>Price per ticket</h2>
              <p>
                {ticketPrice && ethers.utils.formatEther(
                  ticketPrice.toString()
                )}{" "}
                {currency}
              </p>
            </div>
            <div className='flex text-white items-center space-x-2 bg-[#091818] border-[#004337] border p-4'>
              <p>TICKETS</p>
              <input className='flex w-full bg-transparent text-right outline-none'
                type="number"
                min={1}
                max={10}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
              />

            </div>

            <div className='space-y-2 mt-5'>
              <div className='flex items-center justify-between text-emerald-300 text-sm italic font-extrabold'>
                <p>Total cost of tickets</p>
                <p>
                  {ticketPrice &&
                    Number(ethers.utils.formatEther(ticketPrice.toString()))
                    * quantity}{" "}
                  {currency}
                </p>
              </div>
              <div className='flex items-center justify-between text-emerald-300 text-xs italic'>
                <p>Service fees</p>
                <p>
                  {ticketCommission && ethers.utils.formatEther(
                    ticketCommission.toString()
                  )}{" "}
                  {currency}
                </p>
              </div>
              <div className='flex items-center justify-between text-emerald-300 text-xs italic'>
                <p>+ Network Fees</p>
                <p>TBC</p>
              </div>
            </div>
            <button
              disabled={
                expiration?.toString() < Date.now().toString() ||
                remainingTickets?.toNumber() === 0
              }
              onClick={handleClick}
              className='mt-5 w-full bg-gradient-to-br from-orange-500 to-emerald-600 px-10 py-5 
              rounded-md text-white shadow-xl disabled:from-gray-600 disabled:text-gray-100 disabled:to-gray-600
              disabled:cursor-not-allowed'>
                Buy {quantity} ticket(s) for {ticketPrice &&
                  Number(ethers.utils.formatEther(ticketPrice.toString())) * quantity}
                {' '}
                {currency}
            </button>
            </div>
            {userTickets > 0 && (
              <div className="stats">
                <p className='text-lg mb-2'>
                  You have {userTickets} Tickets in this draw
                </p>
                <div className='flex max-w-sm flex-wrap gap-x-2 gap-y-2'>
                  {Array(userTickets)
                    .fill("")
                    .map((_, index) => (
                      <p
                        className='text-emerald-300 h-20 w-12 bg-emerald-500/30 rounded-lg flex flex-shrink-0 items-center justify-center text-xs italic'
                        key={index}
                      >{index + 1}</p>
                  ))}
                </div>
              </div>
            )}
        </div>
      </div>

      {/* the price per ticket box
      <div>

      </div> */}
      </div>

      <footer className='border-t border-emerald-500/20 flex items-center text-white justify-between p-5'>
        <img
          className='h-10 w-10 filter hue-rotate-90 opacity-20 rounded-full'
          src='https://th.bing.com/th/id/OIP.IGw_KICGfAoJXHo4cIk2tgHaHa?pid=ImgDet&rs=1'
          alt='logo'
        />

        <p className='text-xs text-emerald-900 pl-5'>
          DISCLAIMER: The website is published by Priyanshu Pandey, the operator of Lottery Draw.
          The developer takes all reasonable measures to make sure the information is accurate but gives no representation
          or warranty (express or implied) about this site including the accuracy or completeness of its contents.
          You are responsible for any decision made by you based on information on this site. The developer and its directors,
          employees or agents accept no liability for loss or damage (including, without limitation, any special, direct,
          indirect or consequential loss or damage or other losses or damage of whatever kind) that arise out of or
          relate to the use of this site or its contents. If there is any conflict between the information on this site
          and the Rules and Procedures for National Lottery games (as amended from time to time), the Rules and Procedures will take priority.
        </p>

      </footer>
    </div>

  );
}

export default Home;
