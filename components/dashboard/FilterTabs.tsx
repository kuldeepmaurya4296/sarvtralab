'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';

interface FilterTabsProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
}

const FilterTabs = ({ options, value, onChange }: FilterTabsProps) => {
  return (
    <div className="inline-flex p-1 bg-muted rounded-lg">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => onChange(option)}
          className={`filter-tab ${value === option ? 'active' : ''}`}
        >
          {option}
        </button>
      ))}
    </div>
  );
};

export default FilterTabs;


