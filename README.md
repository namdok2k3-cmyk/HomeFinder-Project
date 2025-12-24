HomeFinder Project

A Fredericton real estate property visualizer HCI project built with TypeScript and the SimpleKit UI framework. This application allows users to filter and explore real estate properties on an interactive map based on specific criteria like price, amenities, and property type.

🚀 Features

Interactive Map Visualization: visualizes property locations relative to Fredericton, NB, on a canvas-based map.

Dynamic Filtering:

Price Range: Adjustable slider to filter properties by cost.

Bedrooms & Bathrooms: Sliders to filter by room count.

Property Type: Radio buttons to select between Residential, Condo, Recreational, and Vacant Land.

Amenities: Checkboxes to filter for specific features like Waterfront, Garage, and Pool.

Responsive Layout: Automatically adapts to fit the full screen of any device (Laptop, Desktop, etc.).

Real-time Updates: The map updates instantly as filters are adjusted.

🛠️ Technologies Used

Language: TypeScript

Framework: SimpleKit (Custom Canvas UI Library)

Rendering: HTML5 Canvas API

📦 Installation & Setup

Follow these steps to get the project running on your local machine.

Prerequisites

Node.js installed on your computer.

A code editor (like VS Code).

1. Clone the Repository

git clone [https://github.com/namdok2k3-cmyk/HomeFinder-Project.git](https://github.com/namdok2k3-cmyk/HomeFinder-Project.git)
cd HomeFinder-Project


2. Install Dependencies

npm install


▶️ How to Run

To start the development server:

npm run dev


This will likely provide a local URL (e.g., http://localhost:5173 or http://localhost:3000).

Open that link in your browser to view the application.

📖 Usage Guide

The Map (Left Panel): Shows all available properties as points.

Hover over a point to see the property price in CAD.

Click on a point to select it (if applicable).

The Controls (Right Panel):

Sliders: Drag the knobs to set a minimum and maximum range for Cost, Bedrooms, and Bathrooms.

Radio Buttons: Click to switch between different property categories (e.g., "Condo").

Checkboxes: Toggle specific requirements like "Pool" or "Garage".

📸 Screenshots

(Optional: You can add screenshots of your app here later by uploading them to the repo and linking them like this: ![App Screenshot](path/to/image.png)) - This is great for your portfolio!

Created by Nhat Nam Do - namdok2k3@gmail.com
