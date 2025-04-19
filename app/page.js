// app/page.js
"use client";
import { useState, useEffect } from 'react';
import Header from './Components/Header';
import SearchBar from './Components/SearchBar';
import FilterPanel from './Components/FilterPanel';
import RecipeCard from './Components/RecipeCard';
import styles from './styles/page.module.css';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    vegetarian: false,
    vegan: false,
    glutenFree: false,
  });
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem('favoriteRecipes')) || [];
    setFavorites(savedFavorites);
  }, []);

  const handleSearch = async (query) => {
    if (!query.trim()) return;
    
    setSearchQuery(query);
    setLoading(true);
    setError(null);
    
    try {
      const { vegetarian, vegan, glutenFree } = filters;
      let url = `https://api.spoonacular.com/recipes/complexSearch?apiKey=e6cc794ae1da488ab458ef42e4be3338&query=${encodeURIComponent(query)}&addRecipeInformation=true`;
      
      if (vegetarian) url += '&diet=vegetarian';
      if (vegan) url += '&diet=vegan';
      if (glutenFree) url += '&intolerances=gluten';
      
      const response = await fetch(url);
      const data = await response.json();
      
      const formattedRecipes = data.results?.map(recipe => ({
        id: recipe.id,
        title: recipe.title,
        calories: recipe.nutrition?.nutrients?.find(n => n.name === 'Calories')?.amount || 0,
        image: recipe.image,
        readyInMinutes: recipe.readyInMinutes,
        servings: recipe.servings,
      })) || [];
      
      setRecipes(formattedRecipes);
    } catch (err) {
      console.error('Error fetching recipes:', err);
      setError('Failed to fetch recipes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = (recipe) => {
    const isFavorite = favorites.some(fav => fav.id === recipe.id);
    let updatedFavorites;
    
    if (isFavorite) {
      updatedFavorites = favorites.filter(fav => fav.id !== recipe.id);
    } else {
      updatedFavorites = [...favorites, recipe];
    }
    
    setFavorites(updatedFavorites);
    localStorage.setItem('favoriteRecipes', JSON.stringify(updatedFavorites));
  };

  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>
        <h1>Find Your Perfect Recipe</h1>
        
        <SearchBar onSearch={handleSearch} />
        <FilterPanel onFilterChange={setFilters} />
        
        {loading && <p>Loading recipes...</p>}
        {error && <p className={styles.error}>{error}</p>}
        
        <div className={styles.recipeGrid}>
          {recipes.map(recipe => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              isFavorite={favorites.some(fav => fav.id === recipe.id)}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      </main>
    </div>
  );
}