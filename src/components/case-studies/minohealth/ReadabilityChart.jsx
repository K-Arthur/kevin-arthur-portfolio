"use client";
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';

const data = [
    {
        name: 'Academic Paper',
        Complexity: 90,
        Readability: 30,
    },
    {
        name: 'Minohealth Blog',
        Complexity: 40,
        Readability: 95,
    },
];

export default function ReadabilityChart() {
    return (
        <div className="w-full max-w-2xl mx-auto bg-card/50 backdrop-blur-sm p-6 rounded-xl border border-border shadow-sm my-12">
            <div className="mb-6">
                <h3 className="text-lg font-bold text-foreground">Accessibility Metrics</h3>
                <p className="text-sm text-muted-foreground">Comparative analysis of content density and user comprehension.</p>
            </div>
            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        layout="vertical"
                        data={data}
                        margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                        barCategoryGap={20}
                    >
                        <XAxis type="number" domain={[0, 100]} hide />
                        <YAxis
                            dataKey="name"
                            type="category"
                            width={110}
                            tick={{ fill: 'currentColor', fontSize: 13, fontWeight: 500 }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <Tooltip
                            cursor={{ fill: 'hsl(var(--muted))', opacity: 0.1 }}
                            contentStyle={{
                                backgroundColor: 'hsl(var(--card))',
                                borderColor: 'hsl(var(--border))',
                                borderRadius: '8px',
                                color: 'hsl(var(--foreground))'
                            }}
                            labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: 600 }}
                            itemStyle={{ color: 'hsl(var(--foreground))' }}
                        />
                        <Legend
                            wrapperStyle={{ paddingTop: '20px' }}
                            formatter={(value) => <span className="text-foreground">{value}</span>}
                        />
                        <Bar dataKey="Complexity" name="Jargon Density" radius={[0, 4, 4, 0]} barSize={24}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-complexity-${index}`} fill={index === 0 ? '#ef4444' : '#22c55e'} fillOpacity={0.8} />
                            ))}
                        </Bar>
                        <Bar dataKey="Readability" name="Readability Score" radius={[0, 4, 4, 0]} barSize={24}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-readability-${index}`} fill={index === 0 ? '#94a3b8' : '#3b82f6'} fillOpacity={0.9} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
