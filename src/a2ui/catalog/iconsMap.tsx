import React from 'react';
import { 
  FaShoppingCart, 
  FaUser, 
  FaRegUser, 
  FaCalendarAlt, 
  FaExchangeAlt, 
  FaChevronLeft, 
  FaChevronRight, 
  FaRegNewspaper, 
  FaRegFileAlt, 
  FaFire, 
  FaWeight, 
  FaRegClock, 
  FaTrash, 
  FaPlus,
  FaSearch,
  FaInfoCircle,
  FaCheckCircle,
  FaExclamationTriangle,
  FaUtensils,
  FaRegStar,
  FaStar,
  FaAppleAlt,
  FaArrowRight
} from 'react-icons/fa';
import { MdKitchen, MdOutlineRestaurantMenu } from 'react-icons/md';

export const LOCAL_ICONS_MAP: Record<string, React.ComponentType<any>> = {
  // Shopping Cart & Buying
  shoppingCart: FaShoppingCart,
  shopping_cart: FaShoppingCart,
  cart: FaShoppingCart,
  
  // Kitchen & Refrigerator
  refrigerator: MdKitchen,
  fridge: MdKitchen,
  kitchen: MdKitchen,
  
  // Profile & User
  user: FaUser,
  profile: FaRegUser,
  
  // Navigation & Directions
  calendar: FaCalendarAlt,
  calendar_today: FaCalendarAlt,
  swap: FaExchangeAlt,
  swap_horiz: FaExchangeAlt,
  exchange: FaExchangeAlt,
  chevronLeft: FaChevronLeft,
  chevron_left: FaChevronLeft,
  chevronRight: FaChevronRight,
  chevron_right: FaChevronRight,
  arrow_right: FaArrowRight,
  
  // News & Documents
  news: FaRegNewspaper,
  article: FaRegFileAlt,
  file: FaRegFileAlt,
  
  // Health Metrics
  fire: FaFire,
  calories: FaFire,
  flame: FaFire,
  weight: FaWeight,
  scale: FaWeight,
  metrics: FaWeight,
  clock: FaRegClock,
  timer: FaRegClock,
  schedule: FaRegClock,
  
  // Modifiers
  trash: FaTrash,
  remove: FaTrash,
  delete: FaTrash,
  plus: FaPlus,
  add: FaPlus,
  
  // Indicators & UI
  search: FaSearch,
  info: FaInfoCircle,
  check: FaCheckCircle,
  warning: FaExclamationTriangle,
  utensils: FaUtensils,
  food: FaUtensils,
  restaurant: MdOutlineRestaurantMenu,
  chefHat: MdOutlineRestaurantMenu,
  starOutline: FaRegStar,
  star_outline: FaRegStar,
  star: FaStar,
  apple: FaAppleAlt,
  ingredient: FaAppleAlt,
};
