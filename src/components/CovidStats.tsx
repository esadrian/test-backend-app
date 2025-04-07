import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  // CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import * as Switch from '@radix-ui/react-switch';

import Card from './common/Card';
import Title from './common/Title';

interface CovidData {
  date: string;
  cases: {
    total: {
      value: number;
    };
  };
  testing: {
    total: {
      value: number;
    };
  };
  outcomes: {
    death: {
      total: {
        value: number;
      };
    };
  };
}

const CUTOFF_DATE = new Date('2021-03-07');

// Helper function to parse date from API
const parseDate = (dateStr: string): Date => {
  return new Date(dateStr);
};

const CovidStats: React.FC = () => {
  const [data, setData] = useState<CovidData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showLast90Days, setShowLast90Days] = useState(true);

  // Function to filter data based on date range
  const getFilteredData = (rawData: CovidData[]) => {
    return rawData.filter((item) => {
      try {
        const itemDate = parseDate(item.date);

        // First ensure the date is not after the cutoff date
        if (itemDate > CUTOFF_DATE) {
          return false;
        }

        if (showLast90Days) {
          const ninetyDaysAgo = new Date(CUTOFF_DATE);
          ninetyDaysAgo.setDate(CUTOFF_DATE.getDate() - 90);
          return itemDate >= ninetyDaysAgo;
        }

        return true;
      } catch (err) {
        console.error('Error parsing date:', item.date, err);
        return false;
      }
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          'http://localhost:3200/api/covid/historical'
        );
        // console.log('Raw API response:', response.data);

        if (!response.data || !Array.isArray(response.data)) {
          console.error('Invalid API response structure:', response.data);
          setError('Invalid data format received from API');
          return;
        }

        // Transform the data to match our interface
        const transformedData = response.data.map((item: CovidData) => ({
          date: item.date,
          cases: {
            total: {
              value: item.cases?.total?.value || 0,
            },
          },
          testing: {
            total: {
              value: item.testing?.total?.value || 0,
            },
          },
          outcomes: {
            death: {
              total: {
                value: item.outcomes?.death?.total?.value || 0,
              },
            },
          },
        }));

        setData(transformedData);
      } catch (err) {
        console.error('API Error:', err);
        if (axios.isAxiosError(err)) {
          console.error('Axios error details:', {
            message: err.message,
            response: err.response?.data,
            status: err.response?.status,
          });
          setError('Error fetching COVID data. Please try again later.');
        } else {
          setError('Error fetching COVID data. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="my-6 w-full text-center text-gray-600 dark:text-gray-400">
        Loading COVID data...
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
        <p className="text-red-600 dark:text-red-400">{error}</p>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          If this error persists, please try refreshing the page or check back
          later.
        </p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="my-6 text-center text-gray-600 dark:text-gray-400">
        No COVID data available.
      </div>
    );
  }

  const filteredData = getFilteredData(data);

  if (filteredData.length === 0) {
    return (
      <div className="my-6 text-center text-gray-600 dark:text-gray-400">
        No data available for the selected date range.
      </div>
    );
  }

  const latestData = filteredData[0];
  const compareData = showLast90Days
    ? filteredData[filteredData.length - 1] // Get the oldest data point in the 90-day window
    : filteredData[filteredData.length - 1]; // Get the oldest data point overall

  // Calculate differences
  const newCases =
    (latestData.cases?.total?.value || 0) -
    (compareData.cases?.total?.value || 0);
  const newTests =
    (latestData.testing?.total?.value || 0) -
    (compareData.testing?.total?.value || 0);
  const newDeaths =
    (latestData.outcomes?.death?.total?.value || 0) -
    (compareData.outcomes?.death?.total?.value || 0);

  const formattedData = [...filteredData]
    .reverse() // Reverse the array to show oldest dates first
    .map((item) => {
      try {
        const formatted = {
          date: parseDate(item.date).toLocaleDateString(),
          cases: item.cases?.total?.value || 0,
          tests: item.testing?.total?.value || 0,
          deaths: item.outcomes?.death?.total?.value || 0,
        };
        return formatted;
      } catch (err) {
        console.error('Error formatting item:', item, err);
        return null;
      }
    })
    .filter(Boolean);

  const formatChange = (value: number) => {
    return `${value.toLocaleString()}`;
  };

  const calculatePercentageChange = (current: number, previous: number) => {
    if (previous === 0) return null;
    const percentChange = ((current - previous) / previous) * 100;
    const arrow = percentChange > 0 ? '↑' : percentChange < 0 ? '↓' : '';
    return `${Math.abs(percentChange).toFixed(1)}% ${arrow}`;
  };

  return (
    <div className="w-full space-y-[--gap] [--gap:theme(spacing.6)]">
      <div className="mb-10 text-center">
        <Title className="mb-4">COVID-19 Stats</Title>
        <p className="mx-auto max-w-prose text-balance">
          Data shown is for the United States and includes information up to
          March 7, 2021, when the COVID Tracking Project stopped collecting new
          data.
        </p>
      </div>

      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Showing data from {parseDate(compareData.date).toLocaleDateString()}{' '}
            to {parseDate(latestData.date).toLocaleDateString()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <label
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
            htmlFor="90-days-toggle"
          >
            Show last 90 days only
          </label>
          <Switch.Root
            id="90-days-toggle"
            checked={showLast90Days}
            onCheckedChange={setShowLast90Days}
            className="relative h-[24px] w-[44px] cursor-default rounded-full bg-gray-200 outline-none transition-colors focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 data-[state=checked]:bg-blue-600 dark:bg-gray-700 dark:data-[state=checked]:bg-blue-500"
          >
            <Switch.Thumb className="block h-[20px] w-[20px] translate-x-[2px] rounded-full bg-white transition-transform data-[state=checked]:translate-x-[22px]" />
          </Switch.Root>
        </div>
      </div>

      {/* Latest Data Summary */}
      <div className="grid grid-cols-1 gap-[--gap] md:grid-cols-3">
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <Title level={2}>Cases</Title>
            {showLast90Days && (
              <div className="rounded-xl bg-gray-200 px-2 py-1 text-xs font-medium leading-tight text-gray-600 dark:text-gray-300">
                {calculatePercentageChange(
                  latestData.cases?.total?.value || 0,
                  compareData.cases?.total?.value || 0
                )}
              </div>
            )}
          </div>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            {formatChange(newCases)}
          </p>
        </Card>
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <Title level={2}>Tests</Title>
            {showLast90Days && (
              <div className="rounded-xl bg-gray-200 px-2 py-1 text-xs font-medium leading-tight text-gray-600 dark:text-gray-300">
                {calculatePercentageChange(
                  latestData.testing?.total?.value || 0,
                  compareData.testing?.total?.value || 0
                )}
              </div>
            )}
          </div>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">
            {formatChange(newTests)}
          </p>
        </Card>
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <Title level={2}>Deaths</Title>
            {showLast90Days && (
              <div className="rounded-xl bg-gray-200 px-2 py-1 text-xs font-medium leading-tight text-gray-600 dark:text-gray-300">
                {calculatePercentageChange(
                  latestData.outcomes?.death?.total?.value || 0,
                  compareData.outcomes?.death?.total?.value || 0
                )}
              </div>
            )}
          </div>
          <p className="text-3xl font-bold text-red-600 dark:text-red-400">
            {formatChange(newDeaths)}
          </p>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-[--gap] md:grid-cols-2">
        <Card title="Daily Cases and Testing">
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={formattedData}>
                {/* <CartesianGrid strokeDasharray="3 3" /> */}
                <XAxis dataKey="date" minTickGap={75} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="cases"
                  stroke="#3B82F6"
                  name="Cases"
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="tests"
                  stroke="#10B981"
                  name="Tests"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Daily Deaths">
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={formattedData}>
                {/* <CartesianGrid strokeDasharray="3 3" /> */}
                <XAxis dataKey="date" tickCount={4} minTickGap={75} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="deaths"
                  stroke="#EF4444"
                  name="Deaths"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CovidStats;
