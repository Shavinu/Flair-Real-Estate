import * as ListingService from '../../../Services/ListingService';
import { useEffect, useState } from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis } from 'recharts';

const Frontpage = () => {

    const [listings, setlistings] = useState([])

    useEffect(() => {
        ListingService.getAllListings()
            .then((response) => {
                setlistings(response);
            })
    }, []);

    //const filteredData = listings.filter(item => item.listingName && item.type && item.status);

    return (
        <div>
            <h1>Filtered Data:</h1>
            <ul>
                {listings.map(item => (
                    <li key={item.listingName}>{item.type}</li>
                ))}
            </ul>
            <br></br>
            <br></br>
            <br></br>
            <div>
                <LineChart width={600} height={300} data={listings}>
                    <Line type="monotone" dataKey="listingName" stroke="#8884d8" />
                    <CartesianGrid stroke="#ccc" />
                    <XAxis dataKey="type" />
                    <YAxis />
                </LineChart>
            </div>
        </div>
    );
}

export default Frontpage;