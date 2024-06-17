import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { IngredientProps } from "./Ingredient";

export interface IngredientsSliceState {
  ingredients: IngredientProps[];
}

const initialState: IngredientsSliceState = {
  ingredients: [],
};

export const ingredientsSlice = createSlice({
  name: "ingredients",
  initialState,
  reducers: (create) => ({
    addIngredient: create.reducer((state, action: PayloadAction<IngredientProps>) => {
      state.ingredients.push(action.payload);
    }),
    removeIngredient: create.reducer((state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(
        (ingredient) => ingredient.name !== action.payload,
      );
    }),
  }),
  selectors: {
    selectIngredients: (state) => state.ingredients,
  },
});

export const { addIngredient, removeIngredient } = ingredientsSlice.actions;

export const { selectIngredients } = ingredientsSlice.selectors;
