"use strict";

const recipe = {
  baseServings: 1,
  ingredients: [
    { id: "eggs", name: "Large eggs", min: 2, max: 3, unit: "pcs", note: "" },
    { id: "salt", name: "Salt", min: null, max: null, unit: "", note: "to taste" },
    { id: "pepper", name: "Pepper", min: null, max: null, unit: "", note: "to taste" },
    { id: "fat", name: "Butter or oil", min: 1, max: 1, unit: "tbsp", note: "" },
    { id: "fillings", name: "Optional fillings", min: null, max: null, unit: "", note: "cheese, diced vegetables, cooked meats, herbs" }
  ]
};

const CALORIES_PER_SERVING = 277;

function validateServings(value) {
  return Number.isInteger(value) && value >= 1 && value <= 10;
}

function scaleRecipe(source, count) {
  if (!validateServings(count)) return null;
  const factor = count / source.baseServings;
  return source.ingredients.map((item) => ({
    ...item,
    min: item.min === null ? null : item.min * factor,
    max: item.max === null ? null : item.max * factor
  }));
}

function calculateTotalCalories(count) {
  return validateServings(count) ? CALORIES_PER_SERVING * count : null;
}

let servings = recipe.baseServings;
const $ = (sel) => document.querySelector(sel);

const servingsCount = $("#servings-count");
const servingsInput = $("#servings-input");
const servingsError = $("#servings-error");
const decreaseButton = $("#decrease-servings");
const increaseButton = $("#increase-servings");
const applyButton = $("#apply-servings");
const checks = document.querySelectorAll(".ingredient-check");
const progress = $("#ingredients-progress");
const resetButton = $("#reset-ingredients");
const shoppingList = $("#shopping-list");
const totalCalories = $("#total-calories");

const formatQuantity = (item) => (item.min === item.max ? String(item.min) : `${item.min}-${item.max}`);
const formatIngredient = (item) => (item.min === null ? `${item.name}: ${item.note}` : `${item.name}: ${formatQuantity(item)} ${item.unit}`);

function getPendingIngredients() {
  const preparedIds = [...checks].filter((c) => c.checked).map((c) => c.closest(".ingredient").dataset.id);
  const scaled = scaleRecipe(recipe, servings);
  return scaled ? scaled.filter((item) => !preparedIds.includes(item.id)) : [];
}

function updateShoppingList() {
  const lines = getPendingIngredients().map(formatIngredient);
  shoppingList.textContent = lines.length === 0 ? "All ingredients are ready!" : lines.join("\n");
}

function updateServings() {
  const scaled = scaleRecipe(recipe, servings);
  if (!scaled) return;

  servingsCount.textContent = servings;
  servingsInput.value = servings;
  decreaseButton.disabled = servings === 1;
  increaseButton.disabled = servings === 10;

  scaled.forEach((item) => {
    if (item.min !== null) {
      document.querySelector(`.ingredient[data-id="${item.id}"] .ingredient-quantity`).textContent = formatQuantity(item);
    }
  });

  updateShoppingList();
  updateLab5Extra();
}

function setServings(value) {
  if (!validateServings(value)) return;
  servings = value;
  servingsError.textContent = "";
  servingsInput.removeAttribute("aria-invalid");
  updateServings();
}

function applyInput() {
  const raw = servingsInput.value.trim();
  const value = Number(raw);
  if (raw === "" || !validateServings(value)) {
    servingsError.textContent = "Enter a whole number from 1 to 10.";
    servingsInput.setAttribute("aria-invalid", "true");
    return;
  }
  setServings(value);
}

function decreaseServings() { if (servings > 1) setServings(servings - 1); }
function increaseServings() { if (servings < 10) setServings(servings + 1); }

function updateIngredients() {
  let prepared = 0;
  checks.forEach((check) => {
    check.closest(".ingredient").classList.toggle("is-prepared", check.checked);
    if (check.checked) prepared += 1;
  });
  progress.textContent = `Prepared ${prepared} of ${checks.length}`;
  updateShoppingList();
  updateLab5Extra();
}

function resetIngredients() {
  checks.forEach((check) => { check.checked = false; });
  updateIngredients();
}

function updateLab5Extra() {
  const calories = calculateTotalCalories(servings);
  if (calories !== null && totalCalories) totalCalories.textContent = `${calories} kcal`;
}

decreaseButton.addEventListener("click", decreaseServings);
increaseButton.addEventListener("click", increaseServings);
applyButton.addEventListener("click", applyInput);
servingsInput.addEventListener("keydown", (e) => { if (e.key === "Enter") applyInput(); });
checks.forEach((check) => check.addEventListener("change", updateIngredients));
resetButton.addEventListener("click", resetIngredients);

updateServings();
resetIngredients();