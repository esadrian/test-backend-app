import React, { useState } from 'react';
import axios from 'axios';
import Card from './common/Card';
import Title from './common/Title';
// import * as Switch from '@radix-ui/react-switch';
import { Switch } from 'radix-ui';

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';

interface GenderData {
  gender: string;
  probability: number;
}

interface Country {
  country_id: string;
  probability: number;
}

interface NationalityData {
  country: Country[];
}

interface AgeData {
  age: number;
  count: number;
}

const NameAnalysis: React.FC = () => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [advancedView, setAdvancedView] = useState(false);
  const [results, setResults] = useState<{
    gender?: GenderData;
    nationality?: NationalityData;
    age?: AgeData;
  } | null>(null);

  // Add color array for the pie chart
  const COLORS = [
    '#0088FE',
    '#00C49F',
    '#FFBB28',
    '#FF8042',
    '#8884D8',
    '#A8A8A8',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const [genderResponse, nationalityResponse, ageResponse] =
        await Promise.all([
          axios.get<GenderData>(`http://localhost:3200/api/genderize/${name}`),
          axios.get<NationalityData>(
            `http://localhost:3200/api/nationalize/${name}`
          ),
          axios.get<AgeData>(`http://localhost:3200/api/agify/${name}`),
        ]);

      setResults({
        gender: genderResponse.data,
        nationality: nationalityResponse.data,
        age: ageResponse.data,
      });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 429) {
          setError(
            'Sorry, we have reached the API request limit. Please try again in a few minutes.'
          );
        } else {
          setError(
            'Error: Unable to analyze the name. Please try again later.'
          );
        }
      } else {
        setError('An unexpected error occurred while analyzing the name.');
      }
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const prepareChartData = (nationalityData?: NationalityData) => {
    if (!nationalityData?.country || nationalityData.country.length === 0) {
      return [];
    }

    const total = nationalityData.country.reduce(
      (sum, country) => sum + country.probability,
      0
    );

    const chartData = [...nationalityData.country];

    // If probabilities don't sum to 1 (100%), add "Others"
    if (total < 0.99) {
      // Using 0.99 to account for floating point imprecision
      chartData.push({
        country_id: 'Others',
        probability: 1 - total,
      });
    }

    return chartData;
  };

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="mb-10 text-center">
        <Title className="mb-4">Name Analysis</Title>
        <p className="mx-auto max-w-prose text-balance">
          Quickly identify gender, age and nationality by probability.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Enter a name:
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-green-500 focus:ring-2 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-green-400 dark:focus:ring-green-400"
          />
        </div>
        <button
          type="submit"
          disabled={!name.trim()}
          className="w-full rounded-md bg-green-600 px-4 py-3 text-white transition-colors hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-green-700 dark:hover:bg-green-800 dark:focus:ring-green-400 dark:focus:ring-offset-gray-800"
        >
          Analyze Name
        </button>
      </form>

      <div className="relative">
        {results && (
          <div className="mt-10">
            <div className="mb-10">
              <div className="mb-4 flex items-center justify-end">
                <label
                  className="pr-4 text-sm font-medium leading-none text-gray-700 dark:text-gray-300"
                  htmlFor="summary-mode"
                >
                  Advanced view
                </label>
                <Switch.Root
                  className="relative h-6 w-11 cursor-default rounded-full bg-gray-300 outline-none focus:shadow-green-500 data-[state=checked]:bg-green-600 dark:bg-gray-600 dark:data-[state=checked]:bg-green-500"
                  id="summary-mode"
                  checked={advancedView}
                  onCheckedChange={setAdvancedView}
                >
                  <Switch.Thumb className="block h-5 w-5 translate-x-0.5 rounded-full bg-white transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-5" />
                </Switch.Root>
              </div>
            </div>

            {advancedView ? (
              <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
                <Card title="Gender" className="col-span-1">
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">
                      {results?.gender?.gender === 'male'
                        ? '👨'
                        : results?.gender?.gender === 'female'
                          ? '👩'
                          : '❓'}
                    </span>
                    <div className="grow">
                      <p className="mb-1 text-2xl font-bold">
                        {results?.gender?.gender === 'male'
                          ? 'Male'
                          : results?.gender?.gender === 'female'
                            ? 'Female'
                            : 'Unknown'}
                      </p>
                      <p className="text-sm">
                        Probability:{' '}
                        {results?.gender
                          ? (results.gender.probability * 100).toFixed(1)
                          : '0'}
                        %
                      </p>
                    </div>
                  </div>
                </Card>

                <Card title="Age" className="col-span-1">
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">👤</span>
                    <div className="grow">
                      <p className="mb-1 text-2xl font-bold">
                        {results?.age?.age || '0'} years
                      </p>
                      <p className="text-sm">
                        Based on {results?.age?.count || '0'} samples
                      </p>
                    </div>
                  </div>
                </Card>

                <Card title="Nationality" className="col-span-1 md:col-span-2">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="min-h-[5lh] space-y-3">
                      {results?.nationality?.country &&
                      results.nationality.country.length > 0 ? (
                        results.nationality.country.map((country) => (
                          <div
                            key={country.country_id}
                            className="flex items-center space-x-3"
                          >
                            <img
                              src={`https://flagcdn.com/24x18/${country.country_id.toLowerCase()}.png`}
                              srcSet={`https://flagcdn.com/48x36/${country.country_id.toLowerCase()}.png 2x`}
                              width="24"
                              height="18"
                              alt={`${country.country_id} flag`}
                              className="rounded-sm"
                            />
                            <span>
                              {country.country_id}:{' '}
                              {(country.probability * 100).toFixed(1)}%
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="text-gray-500 dark:text-gray-400">
                          No nationality data available
                        </div>
                      )}
                    </div>
                    {results?.nationality?.country &&
                      results.nationality.country.length > 0 && (
                        <div className="h-[200px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={prepareChartData(results.nationality)}
                                dataKey="probability"
                                nameKey="country_id"
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={3}
                              >
                                {prepareChartData(results.nationality).map(
                                  (entry, index) => (
                                    <Cell
                                      key={`cell-${index}`}
                                      fill={COLORS[index % COLORS.length]}
                                    />
                                  )
                                )}
                              </Pie>
                              <Tooltip
                                formatter={(value: number) =>
                                  `${(value * 100).toFixed(1)}%`
                                }
                              />
                              <Legend />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      )}
                  </div>
                </Card>
              </div>
            ) : (
              <div className="flex justify-center">
                <div className="mb-6 inline-flex flex-wrap items-end justify-center gap-1 text-center text-lg text-gray-800 dark:text-gray-200">
                  <span className="font-bold">{name}</span> is probably a{' '}
                  <span className="font-bold">{results.age?.age || '?'}</span>{' '}
                  year old{' '}
                  <span className="font-bold">
                    {results.gender?.gender
                      ? results.gender.gender === 'male'
                        ? 'male'
                        : 'female'
                      : '?'}
                  </span>{' '}
                  from{' '}
                  {results.nationality?.country &&
                  results.nationality.country.length > 0 ? (
                    <span className="inline-flex items-center gap-2">
                      <img
                        src={`https://flagcdn.com/24x18/${results.nationality.country[0].country_id.toLowerCase()}.png`}
                        srcSet={`https://flagcdn.com/48x36/${results.nationality.country[0].country_id.toLowerCase()}.png 2x`}
                        width="24"
                        height="18"
                        alt={`${results.nationality.country[0].country_id} flag`}
                        className="ml-2"
                      />
                      <span className="font-bold">
                        {results.nationality.country[0].country_id}
                      </span>
                    </span>
                  ) : (
                    <span className="font-bold">?</span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {loading && (
          <div className="mt-10">
            <div className="text-center text-gray-600 dark:text-gray-400">
              Analyzing name...
            </div>
          </div>
        )}

        {error && (
          <div className="mt-10">
            <div className="rounded-md border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
              <p className="text-red-600 dark:text-red-400">{error}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NameAnalysis;
