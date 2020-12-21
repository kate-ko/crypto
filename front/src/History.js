import React, { useState, useEffect } from 'react';
import API from './API'

function History() {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        API.get_history().then((data) => {
            setRows(data)
            setLoading(false)
        }).catch(err => {
            console.log(err)
        })
    }, [])

    return <div className={`container history ${loading ? 'loading' : ''}`}>
        {loading ? <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
        </div> :

            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">Currency</th>
                        <th scope="col">Price</th>
                        <th scope="col">Source</th>
                        <th scope="col">Created</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, i) => <tr key={i}>
                        <td>{row.ticker.toUpperCase()}</td>
                        <td>{row.price}</td>
                        <td>{row.source}</td>
                        <td>{row.created}</td>
                    </tr>)
                    }
                </tbody>
            </table>

        }
    </div>;;
}

export default History;