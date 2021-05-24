import Map from './Components/Map';
import Header from './Components/Header';
import Loader from './Components/Loader';
import Search from './Components/Search';
import {useState, useEffect} from 'react';
//Main Context
import {useMainContext} from './Context/Context'

function App() {
  const { setEventData, reRenderMarkers} = useMainContext();
  const [loading, setLoading] = useState(false);
  //Event to render
  const [renderEvent, setRenderEvent] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      const res = await fetch("https://eonet.sci.gsfc.nasa.gov/api/v2.1/events");
      //Extract the Array contained in the 'events' field.
      const {events} = await res.json();
      //Event data is globally accessible. But 'renderEvent' is just to render out the MAP with the markers
      setEventData(events);
      setRenderEvent(events);
      setLoading(false);
    }
    fetchEvents();
  }, [])

  useEffect(() => {
    if(reRenderMarkers !== null){
      setRenderEvent(reRenderMarkers);
    }
  }, [reRenderMarkers])


  return (
    <div>
    <Header />
      {!loading ? <Map eventData={renderEvent} /> : <Loader />}
    {!loading && <Search />}
    </div>
  );
}

export default App;
