import { createSlice, nanoid, type PayloadAction } from "@reduxjs/toolkit";
import type { IngredientProps } from "./Ingredient";

type Ingredient = IngredientProps & { id: string };
export interface IngredientsSliceState {
  ingredients: Ingredient[];
}

const initialState: IngredientsSliceState = {
  ingredients: [
    { name: "Carrot", id: nanoid() },
    { name: "Cheese", id: nanoid() },
    { name: "Sausage", id: nanoid() },
    { name: "Bun", id: nanoid() },
    { name: "Egg", id: nanoid() },
    { name: "Milk", id: nanoid() },
    { name: "Butter", id: nanoid() },
    { name: "Tomato", id: nanoid() },
    { name: "Potato", id: nanoid() },
  ],
};

export const ingredientsSlice = createSlice({
  name: "ingredients",
  initialState,
  reducers: (create) => ({
    addIngredient: create.reducer((state, action: PayloadAction<Ingredient>) => {
      state.ingredients.push(action.payload);
    }),
    removeIngredient: create.reducer((state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(
        (ingredient) => ingredient.id !== action.payload,
      );
    }),
  }),
  selectors: {
    selectIngredients: (state) => state.ingredients,
  },
});

export const { addIngredient, removeIngredient } = ingredientsSlice.actions;

export const { selectIngredients } = ingredientsSlice.selectors;
