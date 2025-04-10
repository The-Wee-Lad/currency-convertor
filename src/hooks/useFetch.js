import { useEffect, useState } from "react";

const debouncingRate = 500
function useFetch(currency, tryAgain, setTryAgain) {
    const [data, setData] = useState({})
    useEffect(() => {
        const debouncer = setTimeout(() => {
            fetch(`https://api.exchangerate-api.com/v4/latest/${currency}`)
                .then((response => {
                    console.log("response", response.status);
                    if (response.status == 404)
                        throw new Error("API Failed, try Again!!!");
                    return response.json();
                }))
                .then((response) => setData(response))
                .catch((err) => {
                    console.log(err);
                    setTryAgain(true);
                });
        }, debouncingRate);
        return () => {clearTimeout(debouncer)}
    }, [currency, tryAgain, setTryAgain]);
    return data;
}
export default useFetch