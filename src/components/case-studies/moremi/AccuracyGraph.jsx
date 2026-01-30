"use client";
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
    {
        name: 'Pleural Effusion',
        Radiologist: 80, // Average of 75-86%
        MoremiAI: 97,
    },
    {
        name: 'Cardiomegaly',
        Radiologist: 82, // Average of 77-87%
        MoremiAI: 90,
    },
    {
        name: 'Edema',
        Radiologist: 76,
        MoremiAI: 94,
    },
    {
        name: 'Consolidation',
        Radiologist: 79,
        MoremiAI: 92,
    },
];

export default function AccuracyGraph() {
    return (
        <div className="w-full max-w-4xl mx-auto my-12 bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-6 md:p-8 shadow-xl">
            <div className="mb-8">
                <h3 className="text-xl md:text-2xl font-bold text-foreground">Performance Benchmarks</h3>
                <p className="text-muted-foreground mt-2">
                    Comparative analysis of diagnostic accuracy (AUC-ROC) between Moremi AI and board-certified radiologists.
                    Data derived from the validation study published broadly.
                </p>
            </div>
            <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}
                        margin={{
                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                        barGap={8}
                    >
                        <CartesianGrid strokeDasharray="3 3" opacity={0.15} vertical={false} />
                        <XAxis
                            dataKey="name"
                            tick={{ fontSize: 12, fill: 'currentColor' }}
                            axisLine={false}
                            tickLine={false}
                            dy={10}
                        />
                        <YAxis
                            domain={[50, 100]}
                            unit="%"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: 'currentColor' }}
                        />
                        <Tooltip
                            cursor={{ fill: 'hsl(var(--muted))', opacity: 0.1 }}
                            contentStyle={{
                                borderRadius: '12px',
                                border: '1px solid hsl(var(--border))',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                backgroundColor: 'hsl(var(--card))',
                                color: 'hsl(var(--foreground))'
                            }}
                            labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: 600 }}
                            itemStyle={{ color: 'hsl(var(--foreground))' }}
                        />
                        <Legend
                            wrapperStyle={{ paddingTop: '24px' }}
                            iconType="circle"
                            formatter={(value) => <span className="text-foreground">{value}</span>}
                        />
                        <Bar
                            dataKey="Radiologist"
                            name="Human Radiologist (Avg)"
                            fill="#94a3b8"
                            radius={[4, 4, 0, 0]}
                            animationDuration={1500}
                        />
                        <Bar
                            dataKey="MoremiAI"
                            name="Moremi AI Model"
                            fill="#3b82f6"
                            radius={[4, 4, 0, 0]}
                            animationDuration={1500}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
