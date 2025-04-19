// app/favorites/page.js
"use client";
import { useEffect, useState } from 'react';
import Header from '../Components/Header';
import RecipeCard from '../Components/RecipeCard';
import styles from '../styles/page.module.css';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem('favoriteRecipes')) || [];
    setFavorites(savedFavorites);
    setLoading(false);
  }, []);

  const removeFavorite = (recipe) => {
    const updatedFavorites = favorites.filter(fav => fav.id !== recipe.id);
    setFavorites(updatedFavorites);
    localStorage.setItem('favoriteRecipes', JSON.stringify(updatedFavorites));
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <Header />
        <main className={styles.main}>
          <p>Loading your favorites...</p>
        </main>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>
        <h1>Your Favorite Recipes</h1>
        
        <div className={styles.recipeGrid}>
          {favorites.length > 0 ? (
            favorites.map(recipe => (
              <RecipeCard 
                key={recipe.id} 
                recipe={recipe} 
                isFavorite={true}
                onToggleFavorite={removeFavorite}
              />
            ))
          ) : (
            <div className={styles.emptyState}>
              <p>No favorite recipes yet!</p>
              <p>Search for recipes and click the ❤️ icon to save them here.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}