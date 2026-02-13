export const sleepData = [
  { date: '2023-05-01', duration: 7.5, quality: 85, bedtime: '22:30', wakeup: '06:00' },
  { date: '2023-05-02', duration: 6.8, quality: 75, bedtime: '23:00', wakeup: '05:45' },
  { date: '2023-05-03', duration: 8.1, quality: 90, bedtime: '22:00', wakeup: '06:06' },
  { date: '2023-05-04', duration: 7.2, quality: 80, bedtime: '22:45', wakeup: '06:00' },
  { date: '2023-05-05', duration: 6.5, quality: 70, bedtime: '23:30', wakeup: '06:00' },
  { date: '2023-05-06', duration: 8.2, quality: 90, bedtime: '22:15', wakeup: '06:30' },
  { date: '2023-05-07', duration: 7.8, quality: 88, bedtime: '22:30', wakeup: '06:15' },
];

export const hydrationData = [
  { date: '2023-05-01', amount: 1.8 },
  { date: '2023-05-02', amount: 2.0 },
  { date: '2023-05-03', amount: 2.3 },
  { date: '2023-05-04', amount: 1.9 },
  { date: '2023-05-05', amount: 2.5 },
  { date: '2023-05-06', amount: 2.2 },
  { date: '2023-05-07', amount: 2.4 },
];

export const activityData = {
  sunlight: [
    { date: '2023-05-01', duration: 25 },
    { date: '2023-05-02', duration: 30 },
    { date: '2023-05-03', duration: 35 },
    { date: '2023-05-04', duration: 28 },
    { date: '2023-05-05', duration: 40 },
    { date: '2023-05-06', duration: 45 },
    { date: '2023-05-07', duration: 38 },
  ],
  screenTime: [
    { date: '2023-05-01', duration: 4.2 },
    { date: '2023-05-02', duration: 3.8 },
    { date: '2023-05-03', duration: 3.5 },
    { date: '2023-05-04', duration: 4.1 },
    { date: '2023-05-05', duration: 3.0 },
    { date: '2023-05-06', duration: 2.9 },
    { date: '2023-05-07', duration: 3.3 },
  ],
};

export const healthScoreData = {
  today: 85,
  yesterday: 78,
  trend: 'up',
};

export const metricData = {
  sleep: {
    value: '7h 30m',
    unit: 'hours',
    target: '8h',
    progress: 94,
  },
  hydration: {
    value: '1.5L',
    unit: 'liters',
    target: '2.5L',
    progress: 60,
  },
  sunlight: {
    value: '25 min',
    unit: 'minutes',
    target: '30 min',
    progress: 83,
  },
  screenTime: {
    value: '4h 15m',
    unit: 'hours',
    target: '2h',
    progress: 47,
  },
};

export const weeklyScoreData = [
  { date: 'Mon', score: 78 },
  { date: 'Tue', score: 82 },
  { date: 'Wed', score: 75 },
  { date: 'Thu', score: 88 },
  { date: 'Fri', score: 85 },
  { date: 'Sat', score: 90 },
  { date: 'Sun', score: 85 },
];
