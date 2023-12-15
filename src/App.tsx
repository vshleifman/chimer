import { useState, useEffect, useRef } from 'react';
import moment from 'moment';

const ChimeApp = () => {
  
  const [startTime, setStartTime] = useState<string>();
  const [endTime, setEndTime] = useState<string>();
  const [interval, setIntervalValue] = useState<string>('0'); // in seconds
  const [nextChimeTime, setNextChimeTime] = useState<moment.Moment | null>();
  
  
  const nextChimeTimeRef = useRef(nextChimeTime);

  useEffect(() => {
    const calculateNextChimeTime = () => {
      const now = moment();
      const start = moment(startTime, 'HH:mm');
      const end = moment(endTime, 'HH:mm');
      if (!now.isBetween(start, end)) {
        return null;
      }
      const minutesSinceStart = now.diff(start, 'minutes');
      const minutesToNextChime = +interval - (minutesSinceStart % +interval);
      const nextChime = now.clone().add(minutesToNextChime, 'minutes').startOf('minute');
      return nextChime;
    };

    nextChimeTimeRef.current = calculateNextChimeTime();
    setNextChimeTime(nextChimeTimeRef.current);
    
    const chimeInterval = setInterval(() => {
      const now = moment();
      if (nextChimeTimeRef.current && now.isSameOrAfter(nextChimeTimeRef.current)) {
        console.log('chime');
        nextChimeTimeRef.current = calculateNextChimeTime();
        setNextChimeTime(nextChimeTimeRef.current);
      }
    }, 1000); // Check every second

    return () => clearInterval(chimeInterval);
  }, [endTime, interval, startTime]);
  
  return (
    <div>
      <h1>Chime App</h1>
      <div>
        <label>Start Time (HH:mm): </label>
        <input
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        />
      </div>
      <div>
        <label>End Time (HH:mm): </label>
        <input
          type="time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
        />
      </div>
      <div>
        <label>Interval (minutes): </label>
        <input
          type="number"
          value={interval}
          onChange={(e) => setIntervalValue(e.target.value)}
        />
      </div>
      <div>Next chime at: {nextChimeTime ? nextChimeTime.format('HH:mm') : 'Outside of chime range'}</div>
    </div>
  );
};

export default ChimeApp;