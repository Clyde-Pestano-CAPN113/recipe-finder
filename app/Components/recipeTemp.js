"use client";
import { useEffect, useState } from 'react';
import { searchRecipes } from '../util/api';
import styles from '../../Styles/RecipeDetail.module.css';
"use client";
import { useState, useEffect } from 'react';
import Header from './Components/Header';
import SearchBar from './Components/SearchBar';
import FilterPanel from './Components/FilterPanel';
import RecipeCard from './Components/RecipeCard';
import styles from './Styles/page.module.css';

// Hardcoded API key (remove before committing to GitHub!)
const SPOONACULAR_API_KEY = 'your_api_key_here';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState({});
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchRecipes = async (query, filters = {}) => {
    const { vegetarian = false, vegan = false, glutenFree = false } = filters;
    
    let url = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${e6cc794ae1da488ab458ef42e4be3338}&query=${encodeURIComponent(query)}&addRecipeInformation=true`;
    
    if (vegetarian) url += '&diet=vegetarian';
    if (vegan) url += '&diet=vegan';
    if (glutenFree) url += '&intolerances=gluten';
    
    try {
      const response = await fetch(url);
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
      return [];
    }
  };

  // ... rest of your component code (useEffect, handleSearch, etc.) ...
}
export default function RecipeDetail({ params }) {
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        
        const results = await searchRecipes('');
        const foundRecipe = results.find(r => r.id === params.id);
        if (foundRecipe) {
          setRecipe(foundRecipe);
        } else {
          setError('Recipe not found');
        }
      } catch (err) {
        setError('Failed to load recipe');
      } finally {
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [params.id]);

  if (loading) return <div className={styles.loading}>Loading recipe...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!recipe) return <div>Recipe not found</div>;

  return (
    <div className={styles.container}>
      <h1>{recipe.title}</h1>
      
      <div className={styles.recipeContainer}>
        <div className={styles.imageContainer}>
          <img src={recipe.image} alt={recipe.title} />
        </div>
        
        <div className={styles.details}>
          <h2>Ingredients</h2>
          <ul>
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>
          
          <a 
            href={recipe.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.originalButton}
          >
            View Original Recipe
          </a>
        </div>
      </div>
    </div>
  );
}