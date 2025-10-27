'use client';

type HowItWorksProps = Record<string, never>;

interface Step {
  number: number;
  title: string;
  description: string;
}

const HowItWorks: React.FC<HowItWorksProps> = () => {
  const steps: Step[] = [
    {
      number: 1,
      title: 'Connect Wallet',
      description: 'Connect your Web3 wallet to securely access the platform with your blockchain identity.',
    },
    {
      number: 2,
      title: 'Configure Token',
      description: 'Set up your token parameters with our intuitive interface - no coding required.',
    },
    {
      number: 3,
      title: 'One-Click Deploy',
      description: 'Deploy your token to the blockchain with a single click and automatic verification.',
    },
    {
      number: 4,
      title: 'Manage Campaigns',
      description: 'Run airdrops, marketing campaigns, and track analytics from your dashboard.',
    },
  ];

  return (
    <section className="py-20 bg-black/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2
            className="text-3xl md:text-4xl font-semibold mb-4"
            style={{
              background: 'linear-gradient(to right, #C44DFF, #0AACE6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            How It Works
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Experience a seamless token deployment journey powered by StrataForge
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-black/90 rounded-xl p-6 relative"
            >
              {/* Connected line between steps */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-full w-full h-[2px] z-0">
                  <div
                    className="h-full"
                    style={{
                      background: 'linear-gradient(to right, #C44DFF, #0AACE6)',
                      width: '100%',
                    }}
                  ></div>
                </div>
              )}

              <div className="flex flex-col items-center text-center">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl mb-4 z-10"
                  style={{
                    background: 'linear-gradient(to right, #C44DFF, #0AACE6)',
                  }}
                >
                  {step.number}
                </div>
                <h3 className="text-white text-lg font-medium mb-2">{step.title}</h3>
                <p className="text-gray-400 text-sm">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;