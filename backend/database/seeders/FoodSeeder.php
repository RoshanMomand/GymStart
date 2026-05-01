<?php

namespace Database\Seeders;

use App\Models\Food;
use Illuminate\Database\Seeder;

// All values are per 100g — sourced from USDA FoodData Central
class FoodSeeder extends Seeder
{
    public function run(): void
    {
        $foods = [

            // ── Poultry ───────────────────────────────────────────────────
            ['name' => 'Chicken Breast',   'calories' => 165, 'protein' => 31, 'carbs' => 0,  'fats' => 4],
            ['name' => 'Chicken Thigh',    'calories' => 177, 'protein' => 24, 'carbs' => 0,  'fats' => 9],
            ['name' => 'Ground Chicken',   'calories' => 143, 'protein' => 17, 'carbs' => 0,  'fats' => 8],
            ['name' => 'Turkey',           'calories' => 135, 'protein' => 30, 'carbs' => 0,  'fats' => 1],
            ['name' => 'Turkey Mince',     'calories' => 149, 'protein' => 21, 'carbs' => 0,  'fats' => 7],

            // ── Red meat ─────────────────────────────────────────────────
            ['name' => 'Beef',             'calories' => 217, 'protein' => 26, 'carbs' => 0,  'fats' => 12],
            ['name' => 'Ground Beef',      'calories' => 215, 'protein' => 26, 'carbs' => 0,  'fats' => 12],
            ['name' => 'Pork Tenderloin',  'calories' => 143, 'protein' => 26, 'carbs' => 0,  'fats' => 3],
            ['name' => 'Lamb',             'calories' => 258, 'protein' => 26, 'carbs' => 0,  'fats' => 17],

            // ── Fish & seafood ────────────────────────────────────────────
            ['name' => 'Salmon',           'calories' => 208, 'protein' => 20, 'carbs' => 0,  'fats' => 13],
            ['name' => 'Tuna',             'calories' => 144, 'protein' => 30, 'carbs' => 0,  'fats' => 1],
            ['name' => 'Canned Tuna',      'calories' => 116, 'protein' => 26, 'carbs' => 0,  'fats' => 1],
            ['name' => 'Cod',              'calories' => 82,  'protein' => 18, 'carbs' => 0,  'fats' => 1],
            ['name' => 'Tilapia',          'calories' => 128, 'protein' => 26, 'carbs' => 0,  'fats' => 3],
            ['name' => 'Mackerel',         'calories' => 205, 'protein' => 19, 'carbs' => 0,  'fats' => 14],
            ['name' => 'Sardines',         'calories' => 208, 'protein' => 25, 'carbs' => 0,  'fats' => 11],
            ['name' => 'Shrimp',           'calories' => 85,  'protein' => 18, 'carbs' => 0,  'fats' => 1],
            ['name' => 'Haddock',          'calories' => 87,  'protein' => 19, 'carbs' => 0,  'fats' => 1],

            // ── Eggs & dairy ──────────────────────────────────────────────
            ['name' => 'Eggs',             'calories' => 155, 'protein' => 13, 'carbs' => 1,  'fats' => 11],
            ['name' => 'Egg Whites',       'calories' => 52,  'protein' => 11, 'carbs' => 1,  'fats' => 0],
            ['name' => 'Greek Yogurt',     'calories' => 97,  'protein' => 9,  'carbs' => 4,  'fats' => 5],
            ['name' => 'Skyr',             'calories' => 63,  'protein' => 11, 'carbs' => 4,  'fats' => 0],
            ['name' => 'Cottage Cheese',   'calories' => 98,  'protein' => 11, 'carbs' => 3,  'fats' => 4],
            ['name' => 'Ricotta',          'calories' => 174, 'protein' => 11, 'carbs' => 3,  'fats' => 13],
            ['name' => 'Mozzarella',       'calories' => 280, 'protein' => 28, 'carbs' => 2,  'fats' => 17],
            ['name' => 'Cheddar',          'calories' => 402, 'protein' => 25, 'carbs' => 1,  'fats' => 33],
            ['name' => 'Milk',             'calories' => 61,  'protein' => 3,  'carbs' => 5,  'fats' => 3],
            ['name' => 'Kefir',            'calories' => 61,  'protein' => 3,  'carbs' => 5,  'fats' => 3],
            ['name' => 'Protein Pudding',  'calories' => 80,  'protein' => 15, 'carbs' => 6,  'fats' => 1],
            ['name' => 'Whey Protein',     'calories' => 374, 'protein' => 80, 'carbs' => 8,  'fats' => 4],

            // ── Plant proteins ────────────────────────────────────────────
            ['name' => 'Tofu',             'calories' => 76,  'protein' => 8,  'carbs' => 2,  'fats' => 4],
            ['name' => 'Tempeh',           'calories' => 195, 'protein' => 19, 'carbs' => 9,  'fats' => 11],
            ['name' => 'Edamame',          'calories' => 121, 'protein' => 11, 'carbs' => 9,  'fats' => 5],
            ['name' => 'Seitan',           'calories' => 370, 'protein' => 75, 'carbs' => 14, 'fats' => 2],
            ['name' => 'Lentils',          'calories' => 116, 'protein' => 9,  'carbs' => 20, 'fats' => 0],
            ['name' => 'Chickpeas',        'calories' => 164, 'protein' => 9,  'carbs' => 27, 'fats' => 3],
            ['name' => 'Black Beans',      'calories' => 132, 'protein' => 9,  'carbs' => 24, 'fats' => 1],
            ['name' => 'Kidney Beans',     'calories' => 127, 'protein' => 9,  'carbs' => 23, 'fats' => 0],
            ['name' => 'Peas',             'calories' => 81,  'protein' => 5,  'carbs' => 14, 'fats' => 0],

            // ── Nut butters ───────────────────────────────────────────────
            ['name' => 'Peanut Butter',    'calories' => 588, 'protein' => 25, 'carbs' => 20, 'fats' => 50],
            ['name' => 'Almond Butter',    'calories' => 614, 'protein' => 21, 'carbs' => 19, 'fats' => 56],

            // ── Grains & carbs ────────────────────────────────────────────
            ['name' => 'Rice',             'calories' => 130, 'protein' => 3,  'carbs' => 28, 'fats' => 0],
            ['name' => 'Brown Rice',       'calories' => 111, 'protein' => 3,  'carbs' => 23, 'fats' => 1],
            ['name' => 'Basmati Rice',     'calories' => 130, 'protein' => 3,  'carbs' => 28, 'fats' => 0],
            ['name' => 'Pasta',            'calories' => 131, 'protein' => 5,  'carbs' => 25, 'fats' => 1],
            ['name' => 'Oatmeal',          'calories' => 389, 'protein' => 17, 'carbs' => 66, 'fats' => 7],
            ['name' => 'Quinoa',           'calories' => 120, 'protein' => 4,  'carbs' => 21, 'fats' => 2],
            ['name' => 'Couscous',         'calories' => 112, 'protein' => 4,  'carbs' => 23, 'fats' => 0],
            ['name' => 'Bulgur',           'calories' => 83,  'protein' => 3,  'carbs' => 18, 'fats' => 0],
            ['name' => 'Potatoes',         'calories' => 87,  'protein' => 2,  'carbs' => 20, 'fats' => 0],
            ['name' => 'Sweet Potato',     'calories' => 86,  'protein' => 2,  'carbs' => 20, 'fats' => 0],
            ['name' => 'Bread',            'calories' => 247, 'protein' => 13, 'carbs' => 41, 'fats' => 4],
            ['name' => 'Sourdough Bread',  'calories' => 289, 'protein' => 11, 'carbs' => 55, 'fats' => 3],
            ['name' => 'Whole Wheat Wraps','calories' => 270, 'protein' => 9,  'carbs' => 42, 'fats' => 6],
            ['name' => 'Pita Bread',       'calories' => 275, 'protein' => 9,  'carbs' => 54, 'fats' => 1],
            ['name' => 'Corn Tortilla',    'calories' => 218, 'protein' => 5,  'carbs' => 46, 'fats' => 3],
            ['name' => 'Granola',          'calories' => 471, 'protein' => 10, 'carbs' => 64, 'fats' => 20],
            ['name' => 'Muesli',           'calories' => 363, 'protein' => 11, 'carbs' => 66, 'fats' => 7],

            // ── Vegetables ────────────────────────────────────────────────
            ['name' => 'Broccoli',         'calories' => 34, 'protein' => 3, 'carbs' => 7,  'fats' => 0],
            ['name' => 'Spinach',          'calories' => 23, 'protein' => 3, 'carbs' => 4,  'fats' => 0],
            ['name' => 'Kale',             'calories' => 49, 'protein' => 4, 'carbs' => 9,  'fats' => 1],
            ['name' => 'Bell Pepper',      'calories' => 31, 'protein' => 1, 'carbs' => 6,  'fats' => 0],
            ['name' => 'Tomato',           'calories' => 18, 'protein' => 1, 'carbs' => 4,  'fats' => 0],
            ['name' => 'Cucumber',         'calories' => 16, 'protein' => 1, 'carbs' => 4,  'fats' => 0],
            ['name' => 'Zucchini',         'calories' => 17, 'protein' => 1, 'carbs' => 3,  'fats' => 0],
            ['name' => 'Cauliflower',      'calories' => 25, 'protein' => 2, 'carbs' => 5,  'fats' => 0],
            ['name' => 'Carrot',           'calories' => 41, 'protein' => 1, 'carbs' => 10, 'fats' => 0],
            ['name' => 'Asparagus',        'calories' => 20, 'protein' => 2, 'carbs' => 4,  'fats' => 0],
            ['name' => 'Green Beans',      'calories' => 31, 'protein' => 2, 'carbs' => 7,  'fats' => 0],
            ['name' => 'Mushrooms',        'calories' => 22, 'protein' => 3, 'carbs' => 3,  'fats' => 0],
            ['name' => 'Brussels Sprouts', 'calories' => 43, 'protein' => 3, 'carbs' => 9,  'fats' => 0],
            ['name' => 'Lettuce',          'calories' => 14, 'protein' => 1, 'carbs' => 2,  'fats' => 0],
            ['name' => 'Beetroot',         'calories' => 43, 'protein' => 2, 'carbs' => 10, 'fats' => 0],
            ['name' => 'Onion',            'calories' => 40, 'protein' => 1, 'carbs' => 9,  'fats' => 0],
            ['name' => 'Garlic',           'calories' => 149,'protein' => 6, 'carbs' => 33, 'fats' => 1],
            ['name' => 'Celery',           'calories' => 14, 'protein' => 1, 'carbs' => 3,  'fats' => 0],
            ['name' => 'Leek',             'calories' => 61, 'protein' => 1, 'carbs' => 14, 'fats' => 0],
            ['name' => 'Arugula',          'calories' => 25, 'protein' => 3, 'carbs' => 4,  'fats' => 1],
            ['name' => 'Corn',             'calories' => 86, 'protein' => 3, 'carbs' => 19, 'fats' => 1],
            ['name' => 'Eggplant',         'calories' => 25, 'protein' => 1, 'carbs' => 6,  'fats' => 0],

            // ── Fruits ────────────────────────────────────────────────────
            ['name' => 'Banana',           'calories' => 89,  'protein' => 1, 'carbs' => 23, 'fats' => 0],
            ['name' => 'Apple',            'calories' => 52,  'protein' => 0, 'carbs' => 14, 'fats' => 0],
            ['name' => 'Orange',           'calories' => 47,  'protein' => 1, 'carbs' => 12, 'fats' => 0],
            ['name' => 'Mango',            'calories' => 60,  'protein' => 1, 'carbs' => 15, 'fats' => 0],
            ['name' => 'Strawberry',       'calories' => 32,  'protein' => 1, 'carbs' => 8,  'fats' => 0],
            ['name' => 'Blueberry',        'calories' => 57,  'protein' => 1, 'carbs' => 14, 'fats' => 0],
            ['name' => 'Pineapple',        'calories' => 50,  'protein' => 1, 'carbs' => 13, 'fats' => 0],
            ['name' => 'Grapes',           'calories' => 69,  'protein' => 1, 'carbs' => 18, 'fats' => 0],
            ['name' => 'Kiwi',             'calories' => 61,  'protein' => 1, 'carbs' => 15, 'fats' => 1],
            ['name' => 'Dates',            'calories' => 277, 'protein' => 2, 'carbs' => 75, 'fats' => 0],
            ['name' => 'Watermelon',       'calories' => 30,  'protein' => 1, 'carbs' => 8,  'fats' => 0],
            ['name' => 'Pear',             'calories' => 57,  'protein' => 0, 'carbs' => 15, 'fats' => 0],
            ['name' => 'Peach',            'calories' => 39,  'protein' => 1, 'carbs' => 10, 'fats' => 0],
            ['name' => 'Raspberries',      'calories' => 52,  'protein' => 1, 'carbs' => 12, 'fats' => 1],

            // ── Nuts & seeds ──────────────────────────────────────────────
            ['name' => 'Almonds',          'calories' => 579, 'protein' => 21, 'carbs' => 22, 'fats' => 50],
            ['name' => 'Walnuts',          'calories' => 654, 'protein' => 15, 'carbs' => 14, 'fats' => 65],
            ['name' => 'Cashews',          'calories' => 553, 'protein' => 18, 'carbs' => 30, 'fats' => 44],
            ['name' => 'Peanuts',          'calories' => 567, 'protein' => 26, 'carbs' => 16, 'fats' => 49],
            ['name' => 'Pumpkin Seeds',    'calories' => 559, 'protein' => 30, 'carbs' => 11, 'fats' => 49],
            ['name' => 'Sunflower Seeds',  'calories' => 584, 'protein' => 21, 'carbs' => 20, 'fats' => 51],
            ['name' => 'Chia Seeds',       'calories' => 486, 'protein' => 17, 'carbs' => 42, 'fats' => 31],
            ['name' => 'Flaxseed',         'calories' => 534, 'protein' => 18, 'carbs' => 29, 'fats' => 42],
            ['name' => 'Hemp Seeds',       'calories' => 553, 'protein' => 32, 'carbs' => 9,  'fats' => 49],

            // ── Oils & fats ───────────────────────────────────────────────
            ['name' => 'Avocado',          'calories' => 160, 'protein' => 2,  'carbs' => 9,  'fats' => 15],
            ['name' => 'Olive Oil',        'calories' => 884, 'protein' => 0,  'carbs' => 0,  'fats' => 100],
            ['name' => 'Coconut Oil',      'calories' => 862, 'protein' => 0,  'carbs' => 0,  'fats' => 100],
            ['name' => 'Butter',           'calories' => 717, 'protein' => 1,  'carbs' => 0,  'fats' => 81],

            // ── Other common foods ────────────────────────────────────────
            ['name' => 'Dark Chocolate',   'calories' => 598, 'protein' => 8,  'carbs' => 46, 'fats' => 43],
            ['name' => 'Honey',            'calories' => 304, 'protein' => 0,  'carbs' => 82, 'fats' => 0],
            ['name' => 'Hummus',           'calories' => 177, 'protein' => 8,  'carbs' => 14, 'fats' => 10],
            ['name' => 'Protein Bar',      'calories' => 380, 'protein' => 30, 'carbs' => 40, 'fats' => 10],
        ];

        foreach ($foods as $food) {
            Food::firstOrCreate(
                ['name' => $food['name']],
                array_merge($food, ['source' => 'seed'])
            );
        }

        // Mark any pre-existing records that lack a source
        Food::whereNull('source')->orWhere('source', '')->update(['source' => 'seed']);
    }
}
