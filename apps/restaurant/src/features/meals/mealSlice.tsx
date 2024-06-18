import { createSlice, nanoid, type PayloadAction } from "@reduxjs/toolkit";
import type { MealProps } from "./Meal";

type Meal = MealProps & { id: string };

export interface MealSliceState {
  meals: Meal[];
}

const initialState: MealSliceState = {
  meals: [
    {
      name: "Burger",
      id: nanoid(),
      ingredients: ["Bun", "Cheese", "Sausage"],
    },
    {
      name: "Omelette",
      id: nanoid(),
      ingredients: ["Egg", "Milk", "Butter"],
    },
    {
      name: "Salad",
      id: nanoid(),
      ingredients: ["Tomato", "Potato", "Carrot"],
    },
  ],
};

export const mealSlice = createSlice({
  name: "meals",
  initialState,
  reducers: (create) => ({
    addMeal: create.reducer((state, action: PayloadAction<Meal>) => {
      state.meals.push(action.payload);
    }),
    removeMeal: create.reducer((state, action: PayloadAction<string>) => {
      state.meals = state.meals.filter((meal) => meal.id !== action.payload);
    }),
  }),
  selectors: {
    selectMeals: (state) => state.meals,
    selectMealById: (state, id: string) => state.meals.find((meal) => meal.id === id),
    selectMealsByName: (state, ...names: string[]) =>
      state.meals.filter((meal) => names.includes(meal.name)),
  },
});

export const { addMeal, removeMeal } = mealSlice.actions;

export const { selectMeals, selectMealById, selectMealsByName } = mealSlice.selectors;
