import { useEffect, useMemo, useState } from 'react';
import InputDivs from './components/InputDivs.jsx';
import useFetch from './hooks/useFetch.js';

const URLs = ['2.jpg', '3.jpg', '4.jpg', '5.jpg', '1.jpg'

];
const darkURLs = ['7.jpg', '8.jpg', '9.jpg', '10.jpg', '11.jpg', '6.jpg'];
const changeTime = 15000, fadeTime = 500;

function App() {
  const [dark, setDark] = useState(false);
  const [index, setIndex] = useState(Math.floor(Math.random() * URLs.length));
  // const [prevIndex, setPrevIndex] = useState(index);
  const [fade, setFade] = useState(true);
  const [source, setSource] = useState(null);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("INR");
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [tryAgain, setTryAgain] = useState(false);
  const data = useFetch(fromCurrency, tryAgain, setTryAgain);
  const lastUpdate = (new Date(data?.time_last_updated * 1000)).toLocaleString("en-IN");
  const rates = useMemo(() => data?.rates || {}, [data?.rates]);
  function swap() {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  }


  useEffect(() => {
    let t;
    const interval = setInterval(() => {
      setFade(false);
      t =setTimeout(() => {
        const nextIndex = (index + 1) % (dark ? darkURLs.length : URLs.length);
        setIndex(nextIndex);
        setFade(true);
      }, fadeTime);
    }, changeTime);

    return () => { clearInterval(interval); clearTimeout(t) }
  }, [index, dark]);

  useEffect(() => {
    if (!rates) return

    if ((source == "from" || source == "convert")) {
      setToAmount((rates?.[toCurrency] * fromAmount).toFixed(5));
    }
    else if (source == "to")
      setFromAmount((toAmount / rates?.[toCurrency]).toFixed(5));
  }, [toAmount, fromAmount, fromCurrency, toCurrency, rates, source]);

  return (
    <div data-theme={dark ? "dark" : ''} className="h-screen w-screen relative overflow-x-auto">
      <div className={`fixed inset-0 dark:bg-black/90 bg-blue-200/50  -z-20 transition-opacity duration-1000`}/>
      <div
        className={`fixed inset-0 -z-10 transition-opacity duration-500 ${fade ? 'opacity-100' : 'opacity-0'
          }`}
        style={{
          backgroundImage: `url(/${(dark ? darkURLs[index] : URLs[index])})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      <div className='flex flex-row justify-between items-center'>
        <a href="http://github.com/The-Wee-Lad" target='_blank'>
          <div className="dark:hover:text-amber-300 w-fit text-white p-6 text-[1.2rem] hover:text-black font-bold">
            made by Aditya Narayan
          </div>
        </a>
        <button className='w-1/7 h-1/5 max-w-20 p-1 hover:scale-105 active:scale-105'
          onClick={() => {
            setDark(prev => !prev);
          }}>
          <img className='transition-all duration-1000 ease-in-out' src={dark ? "/sun.png" : "/moon.png"} alt="Night/Dark Mode" />
        </button>
      </div>

      <div className='border-t-4 gap-3 w-full h-full flex flex-col items-center'>
        <p className='self-end dark:text-white text-xs font-medium'>Last Updated At : {lastUpdate}</p>
        <div className='min-xl:w-[45%] border flex flex-col justify-center items-center gap-5 p-5 relative mt-20 
        bg-white/30 backdrop-blur-[1px] border-white/40 rounded
        dark:bg-black/30'>
          <InputDivs
            type="from"
            amount={fromAmount}
            currency={fromCurrency}
            options={rates}
            onAmountChange={(amount) => { setFromAmount(Number(amount) || ''); setSource("from"); }}
            onCurrencyChange={(currency) => { setFromCurrency(currency); }}
          />
          <button
            className='
    absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
    z-10 w-8 h-10 flex flex-row items-center justify-center
    text-2xl text-white dark:text-white
    bg-blue-500/90 dark:bg-indigo-500/90
    hover:bg-blue-600/90 focus:bg-blue-600/90
    dark:hover:bg-indigo-600/90 dark:focus:bg-indigo-600/90
    border border-transparent
    hover:border-white focus:border-white
    dark:hover:border-gray-300 dark:focus:border-gray-300
    transition-all duration-300 ease-in-out
    shadow-sm hover:shadow-md focus:shadow-md
    outline-none
    pb-1
    min-md:w-9
    min-md:h-11
    rounded-2xl
  '
            onClick={(e) => {
              setTimeout(() => {
                e.target.blur();
                swap();
              }, 200);
            }}
            aria-label="Swap currencies"
          >
            ⇅
          </button>


          <InputDivs
            type="to"
            amount={toAmount}
            currency={toCurrency}
            onAmountChange={(amount) => { setToAmount(Number(amount) || ''); setSource("to"); }}
            onCurrencyChange={(currency) => { setToCurrency(currency) }}
            options={rates}
          />
        </div>
        <button className='bg-white/70  p-3 text-xl font-medium
            border-1
            hover:bg-black hover:text-white focus:text-white focus:bg-black
            transition-all duration-300 ease-in-out select-none
            dark:bg-black/70
            dark:text-white
            dark:hover:bg-white
            dark:hover:text-black
            dark:focus:bg-white
            dark:focus:text-black
            '
          style={{ backgroundColor: tryAgain ? "Red" : '' }}
          onClick={(e) => {
            setTimeout(() => {
              e.target.blur();
              setSource("convert");
              setTryAgain(false);
            }, 300);
          }}
        >{tryAgain ? "API Failed Click Here To Try Again" : `Convert from ${fromCurrency} to ${toCurrency}`}</button>
      </div>

    </div>

  );
}

export default App;
