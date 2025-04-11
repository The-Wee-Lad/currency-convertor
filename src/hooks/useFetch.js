import { useEffect, useState } from "react";

const debouncingRate = 300;
function useFetch(currency,retry) {
    const [data, setData] = useState({})
    const [fetchStatus, setFetchStatus] = useState("Fetching");
    // const [fetchStatus, setFetchStatus] = useState("Fetching")
    useEffect(() => {
        setFetchStatus("Fetching");
        const debouncer = setTimeout(() => {
            console.log("fetching,",currency);
            fetch(`https://api.exchangerate-api.com/v4/latest/${currency}`)
                    .then((response => {
                        console.log("response", response.status);
                        if (response.status == 404)
                            throw new Error("API Failed, try Again!!!");
                        setFetchStatus("Success");
                        return response.json();
                    }))
                    .then((response) => setData(response))
                    .catch((err) => {
                        console.log(err);
                        setFetchStatus("Error");
                    });
        }, debouncingRate);
        return () => { clearTimeout(debouncer) }
    }, [currency,retry]);
    return { data, fetchStatus, setFetchStatus };
}
export default useFetch