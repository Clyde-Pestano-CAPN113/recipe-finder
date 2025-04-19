"use client";
import { useEffect } from 'react';
import styles from '../Styles/page.module.css';

export default function RecipeDetails({ recipe, onClose }) {
  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (event.target.classList.contains(styles.modalOverlay)) {
        onClose();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  if (!recipe) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        
        <h2>{recipe.title}</h2>
        
        <div className={styles.recipeDetails}>
          <div className={styles.recipeImage}>
            <img src={recipe.image} alt={recipe.title} />
            <p>Ready in: {recipe.readyInMinutes} minutes | Servings: {recipe.servings}</p>
          </div>
          
          <div className={styles.ingredientsSection}>
            <h3>Ingredients</h3>
            <ul>
              {recipe.extendedIngredients?.map((ingredient, index) => (
                <li key={index}>
                  {ingredient.original}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}