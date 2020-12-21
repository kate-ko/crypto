import React, { useState, useEffect } from 'react';
import API from './API'
let timer = 0;
const timeout = 10000;

function Rates() {
    const [currency, setCurrency] = useState({ btc: '', eth: '', ltc: '' });

    useEffect(() => {
        getLastRates()

        function getLastRates(time = 0) {
            timer = setTimeout(() => {
                API.get_rates().then((data) => {
                    setCurrency(data)
                }).catch(err => {
                    console.log(err)
                })

                getLastRates(timeout)
            }, time)
        }

        return () => clearTimeout(timer)
    }, [])

    return <div className="container">

        <table className="table">
            <thead>
                <tr>
                    <th scope="col">BTC</th>
                    <th scope="col">ETH</th>
                    <th scope="col">LTC</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>{currency.btc}</td>
                    <td>{currency.eth}</td>
                    <td>{currency.ltc}</td>
                </tr>
            </tbody>
        </table>
    </div>;
}

export default Rates;