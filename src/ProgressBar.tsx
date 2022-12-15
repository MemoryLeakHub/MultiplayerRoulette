import * as React from 'react';
import LinearProgress, { LinearProgressProps } from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { time } from 'console';

function LinearProgressWithLabel(props: LinearProgressProps & { time: number, value: number }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">{`${Math.round(
            props.value - props.time,
        )}`}</Typography>
      </Box>
    </Box>
  );
}

let LinearWithValueLabel = function (props: { currentTime: number, endTime: number}) {

  const [progress, setProgress] = React.useState(props.endTime);
  const [time, setTime] = React.useState(props.currentTime);
  React.useEffect(() => {
    var time = props.currentTime;
    console.log(" currentTime : " + props.currentTime);
    console.log(props.endTime);
    const timer = setInterval(() => {
        console.log(time);
        time++
        setTime(time);
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <Box sx={{ width: '100%' }}>
      <LinearProgressWithLabel time={time} value={time/progress*100} />
    </Box>
  );
}
export default LinearWithValueLabel;
