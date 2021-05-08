import axios from "axios";
import { useEffect, useState } from "react";

const TimingAPI = () => {
  const [timings, setTimings] = useState([]);
  const [callback, setCallback] = useState(false);

  useEffect(() => {
    console.log('USEEFFECT TIMING')
    const fetchTimings = async () => {
      const routeConfig = {
        method: "get",
        url: "http://localhost:8888/timings",
        headers: {},
      };

      try {
        const response = await axios(routeConfig);
        setTimings(response.data.timings);
      } catch (err) {
        if (err.response) {
          console.error(err);
        }
      }
    };

    fetchTimings();
  }, [callback]);

  return {
    timings: [timings, setTimings],
    callback: [callback, setCallback],
  };
};

export default TimingAPI;
