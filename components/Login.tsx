import { useMetamask } from '@thirdweb-dev/react';
import React from 'react'

function Login() {

    const connectWithMetamask = useMetamask();

    return (
        <div className='bg-[#091818] min-h-screen flex flex-col items-center justify-center text-center'>
            <div className='flex flex-col items-center mb-10'>
                <img className='rounded-full h-56 w-56 mb-10'
                    src='https://th.bing.com/th/id/OIP.IGw_KICGfAoJXHo4cIk2tgHaHa?pid=ImgDet&rs=1'
                    alt=''
                />

                <h1 className='text-6xl text-white font-bold'>The CRYPTO LUCKY DRAW</h1>
                {/* crypto lottery */}
                <h2 className='text-white'>Get Started by logging in with your MetaMask</h2>

                <button
                    onClick={connectWithMetamask}
                    className='bg-white px-8 py-5 mt-10 rounded-lg shadow-lg font-bold'>
                    Login with MetaMask
                </button>
            </div>
        </div>
    )
}

export default Login;


// https://thirdweb.com/mumbai/0xbf8D75028b536F4C6C5A302F6589b284330B8B70/code