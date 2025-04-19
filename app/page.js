"use client";
import { useState, useEffect } from 'react';
import Header from './Components/Header';
import SearchBar from './Components/SearchBar';
import FilterPanel from './Components/FilterPanel';
import RecipeCard from './Components/RecipeCard';
import styles from './Styles/page.module.css';

// Hardcoded Spoonacular API key
const SPOONACULAR_API_KEY = 'e6cc794ae1da488ab458ef42e4be3338';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState({});
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchRecipes = async (query, filters = {}) => {
    const { vegetarian = false, vegan = false, glutenFree = false } = filters;
    
    let url = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${SPOONACULAR_API_KEY}&query=${encodeURIComponent(query)}&addRecipeInformation=true`;
    
    if (vegetarian) url += '&diet=vegetarian';
    if (vegan) url += '&diet=vegan';
    if (glutenFree) url += '&intolerances=gluten';
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      const data = await response.json();
      
      return data.results?.map(recipe => ({
        id: recipe.id,
        title: recipe.title,
        calories: recipe.nutrition?.nutrients?.find(n => n.name === 'Calories')?.amount || 0,
        image: recipe.image,
        readyInMinutes: recipe.readyInMinutes,
        servings: recipe.servings,
      })) || [];
    } catch (error) {
      console.error('Error fetching recipes:', error);
      throw error; // Re-throw to handle in the calling function
    }
  };

  // Load featured recipes on first render
  useEffect(() => {
    const loadFeaturedRecipes = async () => {
      setLoading(true);
      try {
        const featured = await searchRecipes('healthy');
        setRecipes(featured.slice(0, 4));
      } catch (err) {
        setError('Failed to load featured recipes');
      } finally {
        setLoading(false);
      }
    };
    loadFeaturedRecipes();
  }, []);

  const handleSearch = async (query) => {
    if (!query.trim()) return;
    
    setSearchQuery(query);
    setLoading(true);
    setError(null);
    
    try {
      const results = await searchRecipes(query, activeFilters);
      setRecipes(results);
    } catch (err) {
      setError('Failed to fetch recipes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = async (filters) => {
    setActiveFilters(filters);
    if (searchQuery) {
      // Re-search with new filters if there's an active query
      handleSearch(searchQuery);
    }
  };

  return (
    <div>
      <title>Recipe Finder</title>
      <Header />
      
      <main className={styles.container}>
        <SearchBar onSearch={handleSearch} />
        <FilterPanel onFilterChange={handleFilterChange} />
        
        {loading && <div className={styles.loading}>Loading recipes...</div>}
        {error && <div className={styles.error}>{error}</div>}
        
        <h2>{searchQuery ? `Results for "${searchQuery}"` : 'Featured Recipes'}</h2>
        
        <div className={styles.recipeGrid}>
          {recipes.length > 0 ? (
            recipes.map(recipe => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))
          ) : (
            !loading && <p>No recipes found. Try a different search.</p>
          )}
        </div>
      </main>
    </div>
  );
}