import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import SearchBar from './searchbar.js'
import RecordsGrid from './recordsGrid.js'
import React, { useState, useEffect } from 'react';
import axios from 'axios';



export default function Main() {
    const [pattern, setPattern] = useState('');
    const [records, setRecords] = useState([]);
    const [page, setPage] = useState(1);
    const [direction, setDirection] = useState(0);
    const [disabled, setDisabled] = useState(false);

    useEffect(() => {
        updateRecords();
    }, []);

    useEffect(() => {
        updateRecords();
    }, [page, pattern]);

    function updateRecords() {        
        // axios.get(`http://localhost:4000/records/?query=${pattern}&page=${page}`)
        var lastSeenID = 0;
        if (direction === -1) {
            lastSeenID = records[0].personid
            // lastSeenID = records[(records.length - 1)].personid
        } else if (direction === 1) {
            lastSeenID = records[(records.length - 1)].personid
        }
        axios.get(`http://localhost:4000/records/?query=${pattern}&lastSeenID=${lastSeenID}&dir=${direction}`)
        .then(response => {
            setRecords(response.data)
            setDisabled(false);
        })
        .catch(err => {
            console.log(err);
        })
    };

    function handlePatternChange(pattern){
        setPattern(pattern)
        setPage(1);
        setDirection(0)
    }

    function handlePageChange(event, factor){
        event.stopPropagation();
        if (records.length > 0 && ((factor === -1 && page !== 1 ) || (factor === 1 && (numItemsShown() < records[0].totalrows)))) {
            setDisabled(true);
            setPage(page+factor);
            setDirection(factor);
        }
    }


    function numItemsShown(){
        return (30 * (page-1)) + records.length;
    }

    return (
        <div className="justify-center p-10">
            <h2 className="text-5xl font-bold text-center py-10">Search Records</h2>

            <div className="flex justify-center">
                <SearchBar handlePatternChange={handlePatternChange}/>
            </div>
            <RecordsGrid records={records}/> 


            <div className="flex items-center items-stretch justify-center align-center">
                <button disabled={disabled} onClick={(event) => handlePageChange(event, -1)} type="button" className="bg-gray-800 text-white rounded-md py-2 border-gray-200 hover:bg-red-700 hover:text-white px-3">
                    <div className="flex flex-row align-middle">
                        <svg className="w-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd"></path>
                        </svg>
                        <span className="mr-2">Back</span>
                    </div>
                </button>
                
                {records.length > 0 ? 
                    <div className="px-5 my-5">Page: {page} ({numItemsShown()} / {records[0].totalrows})</div>
                    : <div className="px-5">No Results</div>
                }
                {/* <button onClick={(event) => handlePageChange(event, 1)}>Next Page</button> */}
                <button disabled={disabled} onClick={(event) => handlePageChange(event, 1)} type="button" className="bg-gray-800 text-white rounded-md py-2 border-gray-200 hover:bg-red-700 hover:text-white px-3">
                    <div className="flex flex-row align-middle">
                        <span className="mr-2">Next</span>
                        <svg className="w-5 ml-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
                        </svg>
                    </div>
                </button>
            </div>
        </div>
    );

}
