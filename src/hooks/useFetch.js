import { useCallback, useState } from "react";
function useFetch(currency) {
    const [data, setData] = useState({})
    const [isError, setIsError] = useState(false);

    const fetchRates = useCallback(async () => {
        await fetch(`https://api.exchangerate-api.com/v4/latest/${currency}`)
            .then((response => {
                console.log("response", response.status);
                if (response.status == 404)
                    throw new Error("API Failed, try Again!!!");
                return response.json();
            }))
            .then((response) => setData(response))
            .catch((err) => {
                console.log(err);
                setIsError(true);
            });

    }, [currency]);
    return { data, fetchRates, isError };
}
export default useFetch