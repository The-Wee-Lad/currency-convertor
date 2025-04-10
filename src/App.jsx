/* eslint-disable no-unused-vars */
import { useEffect, useMemo, useState, useRef } from 'react';
import InputDivs from './components/InputDivs.jsx';
import useFetch from './hooks/useFetch.js';

const URLs = ['2.jpg', '3.jpg', '4.jpg', '6.jpg', '5.jpg', '2.jpg', '1.jpg'];
const changeTime = 10000, fadeTime = 500;

function App() {
  const [index, setIndex] = useState(Math.floor(Math.random() * URLs.length));
  const [fade, setFade] = useState(true);
  const [source, setSource] = useState(null);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("INR");
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');

  const { data, fetchRates, isError } = useFetch(fromCurrency);
  const lastUpdate = (new Date(data?.time_last_updated * 1000)).toLocaleString("en-IN");
  const rates = useMemo(() => data?.rates || {}, [data?.rates]);

  useEffect(() => {
    fetchRates(fromCurrency)
  }, [fromCurrency, fetchRates]);

  function swap() {
    setToAmount(fromAmount);
    setFromAmount(toAmount);
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % URLs.length);
        setFade(true);
      }, fadeTime);
    }, changeTime);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {

    if (!rates)
      return;

    if ((source == "from" || source == "convert")) {
      console.log("from : ", (rates?.[toCurrency] * fromAmount).toFixed(2));
    }
    else if (source == "to") {
      console.log(" to ", (rates?.[toCurrency] * fromAmount).toFixed(2));
      setFromAmount((toAmount / rates?.[toCurrency]).toFixed(2));
    }
  }, [toAmount, fromAmount, fromCurrency, toCurrency, rates, source]);

  return (
    <div className="h-screen w-screen relative overflow-x-auto">
      <div
        className={`fixed inset-0 -z-10 transition-opacity duration-1000 ${fade ? 'opacity-100' : 'opacity-0'
          }`}
        style={{
          backgroundImage: `url(/${URLs[index]})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      ></div>

      <a href="http://github.com/The-Wee-Lad" target='_blank'>
        <div className="w-fit text-white p-8 text-1xl hover:text-black font-bold">
          made by Aditya Narayan
        </div>
      </a>

      <div className='border-t-4 gap-3 w-full h-full flex flex-col items-center'>
        <p className='self-end text-xs font-medium'>Last Updated At : {lastUpdate}</p>
        <div className='min-xl:w-[45%] border flex flex-col justify-center items-center gap-5 p-5 relative mt-20 bg-white/30 backdrop-blur-[1px] border-white/40 rounded '>
          <InputDivs
            type="from"
            amount={fromAmount}
            currency={fromCurrency}
            options={rates}
            onAmountChange={(amount) => {
              setFromAmount(Number(amount) || '');
              setToAmount((rates?.[toCurrency] * fromAmount).toFixed(2));
            }}
            onCurrencyChange={(currency) => { setFromCurrency(currency); }}
          />
          <button
            className='
          min-xl:text-2xl
          absolute flex flex-row 
          justify-center items-center text-lg
          font-medium top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 z-1 p-1 
          hover:bg-blue-700/100 bg-blue-500/80
          text-white
          focus:bg-blue-700/100
          transition-all duration-100 ease-in
          rounded-xl border-black border-x-2 hover:border-2
          disabled:bg-white/60
          '
            onClick={(e) => {
              setTimeout(() => {
                e.target.blur();
                swap();
              }, 200);
            }}
          >
            Swap
          </button>
          <InputDivs
            type="to"
            amount={toAmount}
            currency={toCurrency}
            onAmountChange={
              (amount) => {
                setToAmount(Number(amount) || '');
                setFromAmount((toAmount / rates?.[toCurrency]).toFixed(2));
              }}
            onCurrencyChange={
              (currency) => { setToCurrency(currency) }
              
            }
            options={rates}
          />
        </div>
        <button className='bg-white/70  p-3 text-xl font-medium
            border-1
            hover:bg-black hover:text-white focus:text-white focus:bg-black
            transition-all duration-300 ease-in-out select-none'
          style={{ backgroundColor: isError ? "Red" : '' }}
          onClick={(e) => {
            setTimeout(() => {
              e.target.blur();
              if (isError)
                fetchRates(fromCurrency);
              else
                setSource("convert");
            }, 300);
          }}
        >{isError ? "API Failed Click Here To Try Again" : `Convert from ${fromCurrency} to ${toCurrency}`}</button>
      </div>

    </div>

  );
}

export default App;
