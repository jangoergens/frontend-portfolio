import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { Ingredient } from "./Ingredient";
import styles from "./IngredientList.module.css";
import { selectIngredients } from "./ingredientsSlice";
import { addIngredient, removeIngredient } from "./ingredientsSlice";
import { nanoid } from "@reduxjs/toolkit";

export const IngredientList = () => {
  const dispatch = useAppDispatch();
  const ingredients = useAppSelector(selectIngredients);
  const [newIngredient, setNewIngredient] = useState("");

  const handleAddIngredient = () => {
    if (newIngredient.trim() !== "") {
      dispatch(addIngredient({ name: newIngredient.trim(), id: nanoid() }));
      setNewIngredient("");
    }
  };

  return (
    <div className={styles.container}>
      {ingredients.map((ingredient) => (
        <div className={styles.ingredient}>
          <Ingredient key={ingredient.id} name={ingredient.name} />
          <button onClick={() => dispatch(removeIngredient(ingredient.id))}>Remove</button>
        </div>
      ))}
      <div>
        <input
          type="text"
          value={newIngredient}
          onChange={(e) => setNewIngredient(e.target.value)}
        />
        <button onClick={handleAddIngredient}>Add</button>
      </div>
    </div>
  );
};
