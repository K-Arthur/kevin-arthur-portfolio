import React from 'react';

const CaseStudySummary = ({ problem, solution, role, impact }) => {
  return (
    <div className="my-10 bg-card border-l-4 border-l-primary/60 p-6 md:p-8 rounded-r-xl shadow-sm">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
        <span className="text-primary text-2xl">📋</span> TL;DR Summary
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        <div>
          <h3 className="font-semibold text-primary mb-2 text-sm uppercase tracking-wider">The Problem</h3>
          <p className="text-muted-foreground text-base leading-relaxed">{problem}</p>
        </div>
        <div>
          <h3 className="font-semibold text-primary mb-2 text-sm uppercase tracking-wider">The Solution</h3>
          <p className="text-muted-foreground text-base leading-relaxed">{solution}</p>
        </div>
        <div>
          <h3 className="font-semibold text-primary mb-2 text-sm uppercase tracking-wider">My Role</h3>
          <p className="text-muted-foreground text-base leading-relaxed">{role}</p>
        </div>
        <div>
          <h3 className="font-semibold text-primary mb-2 text-sm uppercase tracking-wider">Business Impact</h3>
          <p className="text-muted-foreground text-base leading-relaxed font-medium">{impact}</p>
        </div>
      </div>
    </div>
  );
};

export default CaseStudySummary;
