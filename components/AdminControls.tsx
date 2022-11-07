import { ArrowPathIcon, ArrowUturnDownIcon, CurrencyDollarIcon, StarIcon } from '@heroicons/react/24/solid';
import React from 'react';
import { useContract, useMetamask, useDisconnect, useAddress, useContractRead, useContractWrite } from '@thirdweb-dev/react';
import { ethers } from 'ethers';
import { currency } from '../constants';
import toast from 'react-hot-toast';

function AdminControls() {

    const {contract, isLoading} = useContract(process.env.NEXT_PUBLIC_LOTTERY_CONTRACT_ADDRESS);

    const {data: totalCommission} = useContractRead(contract, "operatorTotalCommission");

    const {mutateAsync: DrawWinnerTicket} = useContractWrite(contract, "DrawWinnerTicket");
    
    const { mutateAsync: RefundAll } = useContractWrite(contract, "RefundAll");
    
    const { mutateAsync: restartDraw } = useContractWrite(contract, "restartDraw");
    
    const { mutateAsync: WithdrawCommission } = useContractWrite(contract, "WithdrawCommission");

    const drawWinner = async () => {

        const notification = toast.loading("Picking a Lucky Winner...");

        try {
            const data = await DrawWinnerTicket([{}]);

            toast.success("Winner Picked!", {
                id: notification,
            });

            console.info("Contract call success", data);
        }
        catch (err) {
            toast.error("Whoops something went wrong!", {
                id: notification,
            });

            console.error("Contract call failed", err);
        }
    }


    const onWithdrawCommission = async () => {
        const notification = toast.loading("Withdrawing the commission...");

        try {
            const data = await WithdrawCommission([{}]);

            toast.success("Commission has been withdrawn successfully!", {
                id: notification,
            });

            console.info("Contract call success", data);
        }
        catch (err) {
            toast.error("Whoops, something went wrong!", {
                id: notification,
            });

            console.error("Contract call failed", err);
        }
    }


    const onRestartDraw = async () => {
        const notification = toast.loading("Restarting the draw...");

        try {
            const data = await restartDraw([{}]);

            toast.success("Draw restarted successfully!", {
                id: notification,
            });

            console.info("Contract call success", data);
        }
        catch (err) {
            toast.error("Whoops, something went wrong!", {
                id: notification,
            });

            console.error("Contract call failed", err);
        }
    }


    const onRefundAll = async () => {
        const notification = toast.loading("Refunding all...");

        try {
            const data = await RefundAll([{}]);

            toast.success("All refunded successfully!", {
                id: notification,
            });

            console.info("Contract call success", data);
        }
        catch (err) {
            toast.error("Whoops, something went wrong!", {
                id: notification,
            });

            console.error("Contract call failed", err);
        }
    };



    
    return (
        <div className='text-white text-center px-5 py-3 rounded-md border-emerald-300/20 border'>
            <h2 className='font-bold'>Admin Controls</h2>
            <p className='mb-5'>Total Commission to be withdrawn:{" "}
                {totalCommission && ethers.utils.formatEther(totalCommission?.toString())}
                {" "}{currency}</p>
            <div className='flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2'>
                <button
                    onClick={drawWinner}
                    className='admin-button'>
                    <StarIcon className='h-6 mx-auto mb-2' />
                    Draw Winner
                </button>
                <button
                    onClick={onWithdrawCommission}
                    className='admin-button'>
                    <CurrencyDollarIcon className='h-6 mx-auto mb-2' />
                    Withdraw Commission
                </button>
                <button
                    onClick={onRestartDraw}
                    className='admin-button'>
                    <ArrowPathIcon className='h-6 mx-auto mb-2' />
                    Restart Draw
                </button>
                <button
                    onClick={onRefundAll}
                    className='admin-button'>
                    <ArrowUturnDownIcon className='h-6 mx-auto mb-2' />
                    Refund All
                </button>
            </div>
        </div>
    )
}

export default AdminControls