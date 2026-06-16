export interface MockTemplate {
  name: string;
  description: string;
  messages: any[];
}

export const mockTemplates: MockTemplate[] = [
  {
    name: "Restaurant Finder",
    description:
      "Renders a list of popular local restaurants with ratings and booking action triggers.",
    messages: [
      {
        version: "v0.9",
        createSurface: { surfaceId: "main-surface", catalogId: "basic" },
      },
      {
        version: "v0.9",
        updateComponents: {
          surfaceId: "main-surface",
          components: [
            {
              id: "root",
              component: "Column",
              children: ["header", "subtitle", "restaurant-list"],
              gap: 16,
            },
            {
              id: "header",
              component: "Text",
              text: "Find Your Next Meal",
              variant: "h1",
            },
            {
              id: "subtitle",
              component: "Text",
              text: "Explore curated dining options recommended by FoodAI. Click **Book Now** to schedule a table.",
              variant: "body",
            },
            {
              id: "restaurant-list",
              component: "List",
              children: ["rest-1", "rest-2", "rest-3"],
            },
            // Restaurant 1
            {
              id: "rest-1",
              component: "Card",
              child: "rest-1-col",
            },
            {
              id: "rest-1-col",
              component: "Column",
              children: [
                "rest-1-img",
                "rest-1-title-row",
                "rest-1-desc",
                "rest-1-btn-row",
              ],
              gap: 8,
            },
            {
              id: "rest-1-img",
              component: "Image",
              src: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80",
              alt: "The Bistro Garden",
              height: 150,
            },
            {
              id: "rest-1-title-row",
              component: "Row",
              children: ["rest-1-title", "rest-1-rating"],
              justify: "spaceBetween",
              align: "center",
            },
            {
              id: "rest-1-title",
              component: "Text",
              text: "The Bistro Garden",
              variant: "h2",
            },
            {
              id: "rest-1-rating",
              component: "Text",
              text: "⭐ 4.8 (120 reviews)",
              variant: "caption",
            },
            {
              id: "rest-1-desc",
              component: "Text",
              text: "Charming French-inspired bistro with an outdoor terrace. Famous for coq au vin and local wines.",
            },
            {
              id: "rest-1-btn-row",
              component: "Row",
              children: ["rest-1-spacer", "rest-1-btn"],
              justify: "end",
            },
            {
              id: "rest-1-spacer",
              component: "Text",
              text: "",
            },
            {
              id: "rest-1-btn",
              component: "Button",
              child: "rest-1-btn-text",
              variant: "primary",
              action: {
                name: "select_restaurant",
                context: {
                  restaurantId: "1",
                  name: "The Bistro Garden",
                  image:
                    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80",
                },
              },
            },
            {
              id: "rest-1-btn-text",
              component: "Text",
              text: "Book Now",
            },
            // Restaurant 2
            {
              id: "rest-2",
              component: "Card",
              child: "rest-2-col",
            },
            {
              id: "rest-2-col",
              component: "Column",
              children: [
                "rest-2-img",
                "rest-2-title-row",
                "rest-2-desc",
                "rest-2-btn-row",
              ],
              gap: 8,
            },
            {
              id: "rest-2-img",
              component: "Image",
              src: "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=600&q=80",
              alt: "Sakura Sushi Bar",
              height: 150,
            },
            {
              id: "rest-2-title-row",
              component: "Row",
              children: ["rest-2-title", "rest-2-rating"],
              justify: "spaceBetween",
              align: "center",
            },
            {
              id: "rest-2-title",
              component: "Text",
              text: "Sakura Sushi Bar",
              variant: "h2",
            },
            {
              id: "rest-2-rating",
              component: "Text",
              text: "⭐ 4.6 (94 reviews)",
              variant: "caption",
            },
            {
              id: "rest-2-desc",
              component: "Text",
              text: "Authentic Edo-style sushi and fresh sashimi sourced daily. Minimalist interior with counter seating.",
            },
            {
              id: "rest-2-btn-row",
              component: "Row",
              children: ["rest-2-spacer", "rest-2-btn"],
              justify: "end",
            },
            {
              id: "rest-2-spacer",
              component: "Text",
              text: "",
            },
            {
              id: "rest-2-btn",
              component: "Button",
              child: "rest-2-btn-text",
              variant: "primary",
              action: {
                name: "select_restaurant",
                context: {
                  restaurantId: "2",
                  name: "Sakura Sushi Bar",
                  image:
                    "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=600&q=80",
                },
              },
            },
            {
              id: "rest-2-btn-text",
              component: "Text",
              text: "Book Now",
            },
            // Restaurant 3
            {
              id: "rest-3",
              component: "Card",
              child: "rest-3-col",
            },
            {
              id: "rest-3-col",
              component: "Column",
              children: [
                "rest-3-img",
                "rest-3-title-row",
                "rest-3-desc",
                "rest-3-btn-row",
              ],
              gap: 8,
            },
            {
              id: "rest-3-img",
              component: "Image",
              src: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80",
              alt: "Fire & Hearth Pizza",
              height: 150,
            },
            {
              id: "rest-3-title-row",
              component: "Row",
              children: ["rest-3-title", "rest-3-rating"],
              justify: "spaceBetween",
              align: "center",
            },
            {
              id: "rest-3-title",
              component: "Text",
              text: "Fire & Hearth Pizza",
              variant: "h2",
            },
            {
              id: "rest-3-rating",
              component: "Text",
              text: "⭐ 4.7 (184 reviews)",
              variant: "caption",
            },
            {
              id: "rest-3-desc",
              component: "Text",
              text: "Wood-fired Neapolitan sourdough pizza. Cozy family atmosphere with artisanal ingredients.",
            },
            {
              id: "rest-3-btn-row",
              component: "Row",
              children: ["rest-3-spacer", "rest-3-btn"],
              justify: "end",
            },
            {
              id: "rest-3-spacer",
              component: "Text",
              text: "",
            },
            {
              id: "rest-3-btn",
              component: "Button",
              child: "rest-3-btn-text",
              variant: "primary",
              action: {
                name: "select_restaurant",
                context: {
                  restaurantId: "3",
                  name: "Fire & Hearth Pizza",
                  image:
                    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80",
                },
              },
            },
            {
              id: "rest-3-btn-text",
              component: "Text",
              text: "Book Now",
            },
          ],
        },
      },
    ],
  },
  {
    name: "Interactive Booking Form",
    description:
      "Demonstrates two-way data model synchronization, action callbacks, and dynamic validation checks.",
    messages: [
      {
        version: "v0.9",
        createSurface: { surfaceId: "main-surface", catalogId: "basic" },
      },
      {
        version: "v0.9",
        updateComponents: {
          surfaceId: "main-surface",
          components: [
            {
              id: "root",
              component: "Column",
              children: ["form-card"],
              gap: 16,
            },
            {
              id: "form-card",
              component: "Card",
              child: "form-content",
            },
            {
              id: "form-content",
              component: "Column",
              children: [
                "form-title",
                "restaurant-indicator",
                "input-name",
                "input-time",
                "input-size-row",
                "input-dietary",
                "input-agree",
                "submit-btn",
              ],
              gap: 12,
            },
            {
              id: "form-title",
              component: "Text",
              text: "Table Reservation",
              variant: "h2",
            },
            {
              id: "restaurant-indicator",
              component: "Text",
              text: "Booking a table at **The Bistro Garden**",
              variant: "body",
            },
            {
              id: "input-name",
              component: "TextField",
              label: "Guest Full Name",
              placeholder: "Enter your first and last name",
              value: { path: "/booking/name" },
              checks: [
                {
                  name: "required",
                  args: { message: "Name is required to make a booking." },
                },
              ],
            },
            {
              id: "input-time",
              component: "ChoicePicker",
              label: "Reservation Time",
              value: { path: "/booking/time" },
              options: [
                { value: "18:00", label: "6:00 PM" },
                { value: "19:00", label: "7:00 PM" },
                { value: "20:00", label: "8:00 PM" },
                { value: "21:00", label: "9:00 PM" },
              ],
            },
            {
              id: "input-size-row",
              component: "Row",
              children: ["input-size", "input-requests-toggle"],
              justify: "spaceBetween",
              align: "center",
            },
            {
              id: "input-size",
              component: "ChoicePicker",
              label: "Party Size",
              value: { path: "/booking/partySize" },
              options: [
                { value: "2", label: "2 Guests" },
                { value: "3", label: "3 Guests" },
                { value: "4", label: "4 Guests" },
                { value: "5", label: "5 Guests" },
                { value: "6+", label: "6+ Guests" },
              ],
            },
            {
              id: "input-requests-toggle",
              component: "CheckBox",
              label: "Special Requests?",
              checked: { path: "/booking/hasSpecialRequests" },
            },
            {
              id: "input-dietary",
              component: "TextField",
              label: "Dietary Notes / Special Requests",
              placeholder: "Allergies, high chair, window seat...",
              variant: "longText",
              value: { path: "/booking/dietary" },
            },
            {
              id: "input-agree",
              component: "CheckBox",
              label: "I agree to the cancellation policy",
              checked: { path: "/booking/agreed" },
              checks: [
                {
                  name: "required",
                  args: { message: "You must accept the terms to book." },
                },
              ],
            },
            {
              id: "submit-btn",
              component: "Button",
              child: "submit-btn-text",
              variant: "primary",
              action: {
                name: "submit_booking",
                context: {
                  guestName: { path: "/booking/name" },
                  time: { path: "/booking/time" },
                  partySize: { path: "/booking/partySize" },
                  dietaryNotes: { path: "/booking/dietary" },
                  policyAgreed: { path: "/booking/agreed" },
                },
              },
            },
            {
              id: "submit-btn-text",
              component: "Text",
              text: "Confirm Reservation",
            },
          ],
        },
      },
      {
        version: "v0.9",
        updateDataModel: {
          surfaceId: "main-surface",
          path: "/booking",
          value: {
            name: "",
            time: "19:00",
            partySize: "2",
            hasSpecialRequests: false,
            dietary: "",
            agreed: false,
          },
        },
      },
    ],
  },
  {
    name: "Booking Confirmed",
    description:
      "A dynamic confirmation screen rendering details resolved from the state model.",
    messages: [
      {
        version: "v0.9",
        createSurface: { surfaceId: "main-surface", catalogId: "basic" },
      },
      {
        version: "v0.9",
        updateComponents: {
          surfaceId: "main-surface",
          components: [
            {
              id: "root",
              component: "Column",
              children: ["conf-card"],
              gap: 16,
            },
            {
              id: "conf-card",
              component: "Card",
              child: "conf-content",
            },
            {
              id: "conf-content",
              component: "Column",
              children: [
                "success-icon",
                "conf-title",
                "conf-message",
                "divider",
                "summary-title",
                "summary-details",
                "done-btn",
              ],
              gap: 12,
              align: "center",
            },
            {
              id: "success-icon",
              component: "Icon",
              name: "checkCircle",
              size: 48,
            },
            {
              id: "conf-title",
              component: "Text",
              text: "Reservation Confirmed!",
              variant: "h2",
            },
            {
              id: "conf-message",
              component: "Text",
              text: "Your table is ready! A calendar invite and email confirmation has been sent to your inbox.",
              variant: "body",
            },
            {
              id: "divider",
              component: "Card",
              child: "spacer",
            },
            {
              id: "spacer",
              component: "Text",
              text: "",
            },
            {
              id: "summary-title",
              component: "Text",
              text: "Booking Summary",
              variant: "h3",
            },
            {
              id: "summary-details",
              component: "Text",
              text: '**Restaurant**: The Bistro Garden  \n**Guest**: { path: "/booking/name" }  \n**Time**: { path: "/booking/time" }  \n**Party Size**: { path: "/booking/partySize" } Guests  \n**Notes**: { path: "/booking/dietary" }',
              variant: "body",
            },
            {
              id: "done-btn",
              component: "Button",
              child: "done-btn-text",
              variant: "primary",
              action: {
                name: "reset_flow",
                context: {},
              },
            },
            {
              id: "done-btn-text",
              component: "Text",
              text: "Find Another Restaurant",
            },
          ],
        },
      },
    ],
  },
  {
    name: "Food AI Agent Dashboard",
    description:
      "Features a personalized user profile, a refrigerator grid with add/remove actions, and recommended recipes with quick-buy buttons.",
    messages: [
      {
        version: "v0.9",
        createSurface: { surfaceId: "main-surface", catalogId: "basic" },
      },
      {
        version: "v0.9",
        updateComponents: {
          surfaceId: "main-surface",
          components: [
            {
              id: "root",
              component: "Column",
              children: [
                "profile-section",
                "fridge-title",
                "fridge-grid",
                "fridge-shelf-title",
                "fridge-shelf",
                "recipes-section-title",
                "recipe-1-row",
                "recipe-2-card",
              ],
              gap: 16,
            },
            // Profile Card
            {
              id: "profile-section",
              component: "UserProfile",
              name: "Naveen Kr",
              avatar:
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
              dietGoal: "Keto Plan • Cut Phase",
              metrics: "75 kg | 180 cm",
              maintenanceCalories: "2,450 kcal/day",
            },
            // Refrigerator Title & Grid
            {
              id: "fridge-title",
              component: "Text",
              text: "❄️ Inside Refrigerator",
              variant: "h2",
            },
            {
              id: "fridge-grid",
              component: "RefrigeratorGrid",
              items: { path: "/refrigerator/items" },
              removeAction: {
                name: "remove_from_refrigerator",
              },
            },
            // Add shelf title & grid
            {
              id: "fridge-shelf-title",
              component: "Text",
              text: "🛒 Add to Refrigerator",
              variant: "h2",
            },
            {
              id: "fridge-shelf",
              component: "Row",
              wrap: true,
              children: [
                "shelf-avocado",
                "shelf-spinach",
                "shelf-chicken",
                "shelf-lemon",
                "shelf-broccoli",
                "shelf-cherry",
              ],
              gap: 12,
            },
            {
              id: "shelf-avocado",
              component: "FoodItem",
              name: "Avocado",
              image:
                "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=150&q=80",
              calories: "160 kcal",
              quantity: "1 pc",
              action: {
                name: "add_to_refrigerator",
                context: {
                  itemName: "Avocado",
                  calories: "160 kcal",
                  image:
                    "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=150&q=80",
                },
              },
            },
            {
              id: "shelf-spinach",
              component: "FoodItem",
              name: "Spinach",
              image:
                "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=150&q=80",
              calories: "23 kcal",
              quantity: "250 g",
              action: {
                name: "add_to_refrigerator",
                context: {
                  itemName: "Spinach",
                  calories: "23 kcal",
                  image:
                    "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=150&q=80",
                },
              },
            },
            {
              id: "shelf-chicken",
              component: "FoodItem",
              name: "Chicken Breast",
              image:
                "https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=150&q=80",
              calories: "165 kcal",
              quantity: "500 g",
              action: {
                name: "add_to_refrigerator",
                context: {
                  itemName: "Chicken Breast",
                  calories: "165 kcal",
                  image:
                    "https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=150&q=80",
                },
              },
            },
            {
              id: "shelf-lemon",
              component: "FoodItem",
              name: "Lemon",
              image:
                "https://images.unsplash.com/photo-1590502593747-42a996133562?auto=format&fit=crop&w=150&q=80",
              calories: "29 kcal",
              quantity: "250 g",
              action: {
                name: "add_to_refrigerator",
                context: {
                  itemName: "Lemon",
                  calories: "29 kcal",
                  image:
                    "https://images.unsplash.com/photo-1590502593747-42a996133562?auto=format&fit=crop&w=150&q=80",
                },
              },
            },
            {
              id: "shelf-broccoli",
              component: "FoodItem",
              name: "Broccoli",
              image:
                "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=150&q=80",
              calories: "34 kcal",
              quantity: "1 pc",
              action: {
                name: "add_to_refrigerator",
                context: {
                  itemName: "Broccoli",
                  calories: "34 kcal",
                  image:
                    "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=150&q=80",
                },
              },
            },
            {
              id: "shelf-cherry",
              component: "FoodItem",
              name: "Cherry",
              image:
                "https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=150&q=80",
              calories: "50 kcal",
              quantity: "100 g",
              action: {
                name: "add_to_refrigerator",
                context: {
                  itemName: "Cherry",
                  calories: "50 kcal",
                  image:
                    "https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=150&q=80",
                },
              },
            },
            // Recipes recommendations title
            {
              id: "recipes-section-title",
              component: "Text",
              text: "🍲 Recommended Recipes",
              variant: "h2",
            },
            // Recipe 1 (row variant)
            {
              id: "recipe-1-row",
              component: "RecipeItem",
              variant: "row",
              title: "Keto Avocado Salad",
              image:
                "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=150&q=80",
              category: "Lunch / Keto",
              calories: "350 kcal",
              prepTime: "10 mins",
            },
            // Recipe 2 (card variant with buy buttons)
            {
              id: "recipe-2-card",
              component: "RecipeItem",
              variant: "card",
              title: "Beef and Broccoli Stir-Fry",
              image:
                "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=600&q=80",
              authorName: "Chef Natasha",
              authorAvatar:
                "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=64&q=80",
              communityName: "Recipe added in KetoDiet",
              description:
                "A delicious, high-protein stir-fry loaded with nutrient-rich broccoli and lean beef tenderloin. Perfect for a quick Keto dinner.",
              calories: "450 kcal",
              prepTime: "20 mins",
              zeptoAction: {
                name: "buy_ingredients",
                context: {
                  store: "zepto",
                  recipe: "Beef and Broccoli Stir-Fry",
                  ingredients: [
                    "Beef tenderloin",
                    "Broccoli",
                    "Soy sauce",
                    "Sesame seeds",
                  ],
                },
              },
              blinkitAction: {
                name: "buy_ingredients",
                context: {
                  store: "blinkit",
                  recipe: "Beef and Broccoli Stir-Fry",
                  ingredients: [
                    "Beef tenderloin",
                    "Broccoli",
                    "Soy sauce",
                    "Sesame seeds",
                  ],
                },
              },
            },
          ],
        },
      },
      {
        version: "v0.9",
        updateDataModel: {
          surfaceId: "main-surface",
          path: "/",
          value: {
            refrigerator: {
              items: [
                {
                  name: "Organic Eggs",
                  calories: "70 kcal",
                  image:
                    "https://images.unsplash.com/photo-1516448424440-9dbca97779c1?auto=format&fit=crop&w=150&q=80",
                  quantity: "6 pcs",
                },
                {
                  name: "Whole Milk",
                  calories: "150 kcal",
                  image:
                    "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=150&q=80",
                  quantity: "1L",
                },
              ],
            },
          },
        },
      },
    ],
  },
];
export const defaultMockJson = JSON.stringify(
  mockTemplates[0].messages,
  null,
  2,
);
