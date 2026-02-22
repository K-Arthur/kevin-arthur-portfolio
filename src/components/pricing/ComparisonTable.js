'use client';

import { Fragment } from 'react';
import { motion } from 'framer-motion';
import { FaCheck, FaMinus } from 'react-icons/fa';

const ComparisonTable = () => {
    // Feature categories and data
    const features = [
        {
            category: "Strategy & Research",
            items: [
                { name: "User Research", discovery: true, design: true, partnership: true },
                { name: "Competitive Analysis", discovery: true, design: true, partnership: true },
                { name: "Journey Mapping", discovery: true, design: true, partnership: true },
            ]
        },
        {
            category: "Design Execution",
            items: [
                { name: "Wireframing", discovery: "Lo-fi", design: "Hi-fi", partnership: "Advanced" },
                { name: "Interactive Prototype", discovery: false, design: true, partnership: true },
                { name: "Design System", discovery: false, design: "Basic", partnership: "Complete" },
            ]
        },
        {
            category: "Development & Scale",
            items: [
                { name: "React/Next.js Build", discovery: false, design: false, partnership: true },
                { name: "CMS Integration", discovery: false, design: false, partnership: true },
                { name: "Analytics Setup", discovery: false, design: false, partnership: true },
            ]
        }
    ];

    // Outcome-focused tier info
    const tierOutcomes = [
        { id: 'discovery', bestFor: 'Validate idea', timeline: '2-3 weeks' },
        { id: 'design', bestFor: 'Raise funding', timeline: '4-6 weeks' },
        { id: 'partnership', bestFor: 'Scale product', timeline: 'Ongoing' }
    ];

    return (
        <div className="w-full overflow-x-auto pb-4">
            <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                    <tr className="border-b border-white/10">
                        <th className="py-4 px-4 text-sm font-semibold text-muted-foreground w-1/3">Features</th>
                        <th className="py-4 px-4 text-sm font-semibold text-center w-1/6">Strategy</th>
                        <th className="py-4 px-4 text-sm font-semibold text-center text-primary w-1/6">MVP Design</th>
                        <th className="py-4 px-4 text-sm font-semibold text-center w-1/6">Team Extension</th>
                    </tr>
                    {/* Outcome row */}
                    <tr className="border-b border-white/5 bg-primary/5">
                        <td className="py-3 px-4 text-xs font-medium text-muted-foreground">Best for</td>
                        <td className="py-3 px-4 text-center text-xs font-semibold text-primary">Validate idea</td>
                        <td className="py-3 px-4 text-center text-xs font-semibold text-primary">Raise funding</td>
                        <td className="py-3 px-4 text-center text-xs font-semibold text-primary">Scale product</td>
                    </tr>
                    <tr className="border-b border-white/5">
                        <td className="py-3 px-4 text-xs font-medium text-muted-foreground">Timeline</td>
                        <td className="py-3 px-4 text-center text-xs text-muted-foreground">2-3 weeks</td>
                        <td className="py-3 px-4 text-center text-xs text-muted-foreground">4-6 weeks</td>
                        <td className="py-3 px-4 text-center text-xs text-muted-foreground">Ongoing</td>
                    </tr>
                </thead>
                <tbody>
                    {features.map((section, idx) => (
                        <Fragment key={`section-${idx}`}>
                            <tr className="bg-white/5">
                                <td colSpan="4" className="py-2 px-4 text-xs font-bold uppercase tracking-wider text-muted-foreground/70 bg-secondary/30">
                                    {section.category}
                                </td>
                            </tr>
                            {section.items.map((item, itemIdx) => (
                                <tr key={`item-${idx}-${itemIdx}`} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                    <td className="py-4 px-4 text-sm font-medium text-foreground">{item.name}</td>

                                    {/* Helper to render check or text */}
                                    {[item.discovery, item.design, item.partnership].map((val, colIdx) => (
                                        <td key={colIdx} className="py-4 px-4 text-center">
                                            {val === true ? (
                                                <FaCheck className="inline w-3 h-3 text-primary" />
                                            ) : val === false ? (
                                                <FaMinus className="inline w-3 h-3 text-muted-foreground/30" />
                                            ) : (
                                                <span className="text-xs font-medium text-foreground">{val}</span>
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ComparisonTable;
