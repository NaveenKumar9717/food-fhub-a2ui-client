import { Column, Row, Card, List, Text, Image, Icon, Button, TextField, CheckBox, ChoicePicker, Carousel } from './commonComponents';
import { UserProfile, FoodItem, RefrigeratorGrid, RecipeItem } from './foodComponents';
import { NewsCard } from './newsComponents';
import { Catalog } from '../core/A2uiSurface';

export { Column, Row, Card, List, Text, Image, Icon, Button, TextField, CheckBox, ChoicePicker, Carousel } from './commonComponents';
export { UserProfile, FoodItem, RefrigeratorGrid, RecipeItem } from './foodComponents';
export { NewsCard } from './newsComponents';

export const basicCatalog: Catalog = {
  components: new Map([
    ['Column', Column],
    ['Row', Row],
    ['Card', Card],
    ['List', List],
    ['Text', Text],
    ['Image', Image],
    ['Icon', Icon],
    ['Button', Button],
    ['TextField', TextField],
    ['CheckBox', CheckBox],
    ['ChoicePicker', ChoicePicker],
    ['UserProfile', UserProfile],
    ['FoodItem', FoodItem],
    ['RefrigeratorGrid', RefrigeratorGrid],
    ['RecipeItem', RecipeItem],
    ['NewsCard', NewsCard],
    ['Carousel', Carousel],
  ]),
};
