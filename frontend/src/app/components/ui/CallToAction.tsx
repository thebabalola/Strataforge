'use client';
import Image from 'next/image';

// Fixed empty interface issue
type CallToActionProps = Record<string, never>;

const CallToAction: React.FC<CallToActionProps> = () => {
  return (
    <section className='py-16 px-6 md:px-12 lg:px-16 bg-black/90 relative overflow-hidden'>
      <div className='max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between relative z-10'>
        {/* Left Section - Text and Buttons */}
        <div className='text-white space-y-6 lg:w-1/2'>
          <h2
            className='text-[56px] font-medium leading-[1.2] md:leading-tight'
            style={{
              fontFamily: 'Poppins, sans-serif',
              letterSpacing: '-2px',
            }}
          >
            Ready to forge tokens <br /> without code?
          </h2>

          <p
            className='text-gray-300 text-[18px] font-normal leading-[1.7]'
            style={{
              fontFamily: 'Be Vietnam, sans-serif',
              letterSpacing: '0px',
            }}
          >
            Reserve your spot for early access and unlock <br /> eexclusive token templates,
            advanced campaign analytics, <br />  and priority marketplace placement.
          </p>

          <div className='flex space-x-4'>
            <button
              className='text-white rounded-[46px] relative overflow-hidden'
              style={{
                background: 'linear-gradient(270deg, #C44DFF 0%, #0AACE6 100%)',
                width: '157px',
                height: '50px',
                padding: '16px 20px',
              }}
            >
              <span className="relative z-10">Get Started</span>
            </button>

            <button className='text-white border border-gray-500 rounded-[46px] px-6 py-3 hover:bg-gray-700'>
              Join Waitlist
            </button>
          </div>
        </div>

        {/* Right Section - Image with Web3 animations */}
        <div className='mt-8 lg:mt-0 lg:w-1/2 flex justify-center relative'>
          {/* Static glow effect behind image */}
          <div
            className="absolute rounded-full bg-gradient-to-r from-purple-500 to-blue-500 blur-3xl opacity-50"
            style={{ width: '70%', height: '70%', top: '15%', left: '15%' }}
          />
          
          {/* Static circular rings */}
          <div className="absolute w-full h-full border-2 border-purple-500 rounded-full opacity-20" />
          
          <div className="absolute w-full h-full border border-cyan-400 rounded-full opacity-10" />
          
          {/* The image */}
          <div className='relative z-10'>
            <Image
              src='/3d-rendering-1.png'
              alt='Token Illustration'
              width={450}
              height={512}
              priority
              className="drop-shadow-2xl"
            />
            
            {/* Small static particles around image */}
            <div className="absolute top-1/4 -left-4 w-3 h-3 bg-blue-400 rounded-full opacity-70" />
            
            <div className="absolute bottom-1/4 -right-2 w-2 h-2 bg-purple-500 rounded-full opacity-50" />
            
            <div className="absolute top-1/2 -right-4 w-4 h-4 bg-cyan-400 rounded-full opacity-60" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
