import React from 'react';

import clsx from 'clsx';
import dayjs from 'dayjs';

// import relativeTime from 'dayjs/plugin/relativeTime';
// dayjs.extend(relativeTime);
type Props = {
  hideAgo?: boolean;
  timestamp: Date | string;
  className?: string;
};
export const classes = {
  root: 'NEXYTimeAgo',
};

// TODO: For whatever reason extending the dayjs relativeTime plugin doesn't work
// The only work around I could have figured out was to hard code the plugin partial section
// here and use it as a separate function.
// There was no github issue related to this.
// For the sake of speed, I keep it this way, but we should come back to it
// and find a proper solution to.
function relativeTime(input, withoutSuffix) {
  const loc = {
    future: 'in %s',
    past: '%s ago',
    s: 'seconds',
    m: 'a minute',
    mm: '%d minutes',
    h: 'an hour',
    hh: '%d hours',
    d: 'a day',
    dd: '%d days',
    M: 'a month',
    MM: '%d months',
    y: 'a year',
    yy: '%d years',
  };
  const T = [
    {
      l: 's',
      r: 44,
      d: 'second',
    },
    {
      l: 'm',
      r: 89,
    },
    {
      l: 'mm',
      r: 44,
      d: 'minute',
    },
    {
      l: 'h',
      r: 89,
    },
    {
      l: 'hh',
      r: 21,
      d: 'hour',
    },
    {
      l: 'd',
      r: 35,
    },
    {
      l: 'dd',
      r: 25,
      d: 'day',
    },
    {
      l: 'M',
      r: 45,
    },
    {
      l: 'MM',
      r: 10,
      d: 'month',
    },
    {
      l: 'y',
      r: 17,
    },
    {
      l: 'yy',
      d: 'year',
    },
  ];
  const Tl = T.length;
  let result;
  let out;

  for (let i = 0; i < Tl; i += 1) {
    let t = T[i];

    if (t.d) {
      result = input.diff(dayjs(), t.d, true);
    }

    const abs = Math.round(Math.abs(result));

    if (abs <= t.r || !t.r) {
      if (abs === 1 && i > 0) t = T[i - 1]; // 1 minutes -> a minute

      out = loc[t.l].replace('%d', abs);
      break;
    }
  }

  if (withoutSuffix) {
    return out;
  }

  return (result > 0 ? loc.future : loc.past).replace('%s', out);
}

const TimeAgo = React.forwardRef<Props, any>(function TimeAgo(props, ref) {
  const { timestamp, hideAgo = false, className, ...rest } = props;
  return (
    <span ref={ref} className={clsx(className, classes.root)} {...rest}>
      {!timestamp ? 'no date' : relativeTime(dayjs(timestamp), hideAgo)}
    </span>
  );
});
export default TimeAgo;
