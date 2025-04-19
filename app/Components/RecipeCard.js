"use client";
import { useState } from 'react';
import styles from '../Styles/page.module.css';
import RecipeDetails from '../Components/RecipeDetails';

export default function RecipeCard({ 
  recipe, 
  isFavorite = false, 
  onToggleFavorite = () => {}
}) {
  const [showDetails, setShowDetails] = useState(false);
  const [detailedRecipe, setDetailedRecipe] = useState(null);
  const [calories, setCalories] = useState(recipe.calories || 0);

  const toggleFavorite = (e) => {
    e.stopPropagation();
    if (typeof onToggleFavorite === 'function') {
      onToggleFavorite(recipe);
    }
  };

  const fetchRecipeDetails = async (id) => {
    try {
      const response = await fetch(
        `https://api.spoonacular.com/recipes/${id}/information?apiKey=e6cc794ae1da488ab458ef42e4be3338&includeNutrition=true`
      );
      const data = await response.json();
      
      // Extract calories from nutrition data if available
      const recipeCalories = data.nutrition?.nutrients?.find(
        nutrient => nutrient.name === "Calories"
      )?.amount || 0;
      
      setCalories(Math.round(recipeCalories));
      setDetailedRecipe(data);
      setShowDetails(true);
    } catch (error) {
      console.error('Error fetching recipe details:', error);
    }
  };

  return (
    <>
      <div className={styles.recipeCard} onClick={() => fetchRecipeDetails(recipe.id)}>
        <img src={recipe.image} alt={recipe.title} />
        <h3>{recipe.title}</h3>
        <p>Calories: {calories}</p>
        <div className={styles.cardActions}>
          <button 
            className={styles.viewButton}
            onClick={(e) => {
              e.stopPropagation();
              fetchRecipeDetails(recipe.id);
            }}
          >
            View Recipe
          </button>
          <button 
            className={`${styles.favoriteButton} ${isFavorite ? styles.favorited : ''}`}
            onClick={toggleFavorite}
          >
            {isFavorite ? '❤️' : '🤍'}
          </button>
        </div>
      </div>
      
      {showDetails && detailedRecipe && (
        <RecipeDetails 
          recipe={detailedRecipe} 
          onClose={() => setShowDetails(false)}
          onToggleFavorite={toggleFavorite}
          isFavorite={isFavorite}
        />
      )}
    </>
  );
}