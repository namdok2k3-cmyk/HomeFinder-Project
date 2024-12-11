// Import the necessary modules from SimpleKit
import {
  Layout,
  setSKRoot,
  SKContainer,
  startSimpleKit,
} from "./simplekit/src/imperative-mode";
import { HomeFinder, Property } from "./homefinder/checkbox";

// Initialize the main container
const mainContainer = new SKContainer();
mainContainer.width = 0;
mainContainer.height = 0;
setSKRoot(mainContainer);

// Array to hold the property data
const allProperties: Property[] = [];
const rawJsonData: any[] = [];

// Function to load and process property data
async function fetchAndPrepareProperties() {
  try {
    // Fetch JSON data
    const response = await fetch("fredericton_properties.json");
    const data = await response.json();

    // Map JSON entries to Property objects
    for (const item of data) {
      const property: Property = {
        latitude: item.latitude || 0,
        longitude: item.longitude || 0,
        dataDisplay: "",
        data: {
          id: item.id || 0,
          address: item.address || "Unknown",
          price: item.price || 0,
          bedrooms: item.bedrooms || 0,
          bathrooms: item.bathrooms || 0,
          property_type: item.property_type || "N/A",
          features: item.features || [],
          description: item.description || "No description available",
        },
      };
      allProperties.push(property);
    }
  } catch (err) {
    console.error("Failed to load property data:", err);
  }
}

// Build and display the application
async function initializeApp() {
  await fetchAndPrepareProperties();

  // Create the HomeFinder instance
  const homeFinderUI = new HomeFinder(allProperties);
  mainContainer.addChild(homeFinderUI);

  // Set the layout and start the application
  mainContainer.layoutMethod = Layout.makeFixedLayout();
  startSimpleKit();
}

// Run the application
initializeApp();
