import React, {useRef, useState, useEffect} from 'react';
//Main Context
import {useMainContext} from '../Context/Context';

function Search(props) {
    const {eventData, setSelectedEvent, setReRenderMarkers} = useMainContext();
    const searchBox = useRef();
    const optionBox = useRef();
    //Matching results
    const [matchEvent, setMatchEvent] = useState(eventData);
    //Handle dropDown
    const [storeSelection, setStoreSelection] = useState("All");

    //Filter eventData
    const filterEventData = eventData => {
        //Spread operator so we don't overwrite Reference data
        let filteredEventData = [...eventData];
        if(storeSelection !== "All"){
                filteredEventData = filteredEventData.filter(event => event.categories[0].title === storeSelection);
        }
        return filteredEventData;
    }

    const userSearch = (searchQuery, eventData) => {
        let eventMatch = [];
        let filterdEventData = filterEventData(eventData);
        if(searchQuery.length > 0 && filterdEventData){
            for(const event in eventData){
                let eventTitle = filterdEventData[event].title.toLowerCase();
                if(eventTitle.indexOf(searchQuery) !== -1){
                    eventMatch.push(filterdEventData[event]);
                }
            }
            //If they have typed in something but it didn't match
            if(eventMatch.length === 0){
                eventMatch = [{title: "No Results!", categories: [{title:""}]}]
            }
            setMatchEvent(eventMatch);
        }else{
            setMatchEvent(filterdEventData);
        }
    }

    //They have changed their filter option. We want the markers to change aswell
    useEffect(() => {
        //First we want to sort out the Markers
        let filterdEventData = filterEventData(eventData);
        setReRenderMarkers(filterdEventData);
        //Now we want to sort out the search results
        userSearch(searchBox.current.value.toLowerCase(), filterdEventData);
    }, [storeSelection])
    


    return (
        <>
            <section className="option-container">
            <p>Type:</p>
            <select ref={optionBox}
            onChange={() => {setStoreSelection(optionBox.current.value)
                }}>
                <option value="All">All</option>
                <option value="Wildfires">Wildfires</option>
                <option value="Severe Storms">Severe Storms</option>
                <option value="Volcanoes">Volcanoes</option>
                <option value="Sea and Lake Ice">Sea and Lake Ice</option>
            </select>
            </section>
            <section className="search-container">
                <p>Search:</p>
                <input type="text" onKeyUp={() => {
                    let searchQuery = searchBox.current.value.toLowerCase();
                    //Want to wait for the user to finish typing before sending method
                    setTimeout(() => {
                        if(searchQuery === searchBox.current.value.toLowerCase()){
                            userSearch(searchQuery, eventData);
                        }
                    }, 300)

                }
                } ref={searchBox} />
            </section>

            <table className="search-table">
                <tr>
                    <th style={{width: "60%"}}>Title</th>
                    <th >Type</th>
                    <th>Location</th>
                </tr>
                {matchEvent.map(ev => {
                    return(<tr key={ev.id}>
                        <td>{ev.title}</td>
                        <td>{ev.categories[0].title}</td>
                        {ev.categories[0].title ? <td><a href="#" 
                        onClick={() => {setSelectedEvent(ev)}}>Click Here</a></td> : <td></td>}
                    </tr>)
                })}
            </table>
        </>
    );
}

export default Search;