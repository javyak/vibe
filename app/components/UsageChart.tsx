"use client";
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps
} from 'recharts';

interface ApiKeyUsage {
  name: string;
  usage: number;
}

interface UsageChartProps {
  data: ApiKeyUsage[];
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-100">
        <p className="text-sm text-gray-600">{label}</p>
        <p className="text-sm font-semibold text-blue-600">
          {payload[0].value} requests
        </p>
      </div>
    );
  }
  return null;
};

export default function UsageChart({ data }: UsageChartProps) {
  // Ensure we always have 10 data points, filling empty slots with null values
  const paddedData = [...data]
    .sort((a, b) => b.usage - a.usage) // Sort by usage in descending order
    .slice(0, 10); // Take top 10

  while (paddedData.length < 10) {
    paddedData.push({ name: `Slot ${paddedData.length + 1}`, usage: 0 });
  }

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={paddedData}
          margin={{ top: 10, right: 0, left: 0, bottom: 20 }}
          barSize={24}
        >
          <CartesianGrid vertical={false} stroke="#f0f0f0" />
          <XAxis 
            dataKey="name" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#666', fontSize: 12 }}
            padding={{ left: 10, right: 10 }}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#666', fontSize: 12 }}
            width={40}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="usage"
            fill="#2563eb"
            radius={[4, 4, 0, 0]}
            maxBarSize={48}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
} 