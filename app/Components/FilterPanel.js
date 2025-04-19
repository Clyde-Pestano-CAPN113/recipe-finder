import { useState } from 'react';

export default function FilterPanel({ onFilterChange }) {
  const [filters, setFilters] = useState({
    vegetarian: false,
    vegan: false,
    glutenFree: false,
  });

  const handleChange = (e) => {
    const newFilters = {
      ...filters,
      [e.target.name]: e.target.checked,
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div>
      <label>
        <input
          type="checkbox"
          name="vegetarian"
          checked={filters.vegetarian}
          onChange={handleChange}
        />
        Vegetarian
      </label>
      <label>
        <input
          type="checkbox"
          name="vegan"
          checked={filters.vegan}
          onChange={handleChange}
        />
        Vegan
      </label>
      <label>
        <input
          type="checkbox"
          name="glutenFree"
          checked={filters.glutenFree}
          onChange={handleChange}
        />
        Gluten-Free
      </label>
    </div>
  );
}