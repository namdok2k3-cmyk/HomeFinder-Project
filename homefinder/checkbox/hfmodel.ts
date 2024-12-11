import { SKMouseEvent } from "../../simplekit/src/events";
import { MapWidget, MapWidgetModel } from "../../widgets/MapWidget";
import { Property } from "./property"; // Ensure correct path to Property interface
import { Subscriber } from "../../subscriber"

export class HFModel {
  public addSubscriber(subscriber: Subscriber): void {
    this.subscribers.push(subscriber);
    this.notifySubscribers();
}
private subscribers: Subscriber[] = [];
  public properties: Property[]; // Original property data
  public filteredProperties: Property[]; // Filtered query result
  public selectedFeatures: string[] = [];
  public propertyType: string = "";
  public priceRange: [number, number] = [0, Infinity];
  public bedroomRange: [number, number] = [0, Infinity];
  public bathroomRange: [number, number] = [0, Infinity];

  constructor(properties: Property[]) {
    this.properties = properties;
    this.filteredProperties = [...properties]; // Initialize with all properties
  }

  private notifySubscribers(): void {
    this.subscribers.forEach((subscriber) => subscriber.update());
}

  // Update the filter ranges
  public filterData(filters: {
    priceRange?: [number, number];
    bedrooms?: [number, number];
    bathrooms?: [number, number];
  }): void {
    if (filters.priceRange) this.priceRange = filters.priceRange;
    if (filters.bedrooms) this.bedroomRange = filters.bedrooms;
    if (filters.bathrooms) this.bathroomRange = filters.bathrooms;

    this.applyFilters();
  }

  // Toggle features for filtering
  public updateFeatures(feature: string, enable: boolean): void {
    if (enable && !this.selectedFeatures.includes(feature)) {
      this.selectedFeatures.push(feature);
    } else {
      this.selectedFeatures = this.selectedFeatures.filter((f) => f !== feature);
    }
    this.applyFilters();
  }

  // Set property type category
  public setCategory(category: string): void {
    this.propertyType = category;
    this.applyFilters();
  }

  // Apply all filters to properties
  private applyFilters(): void {
    this.filteredProperties = this.properties.filter((property) => {
      const { price, bedrooms, bathrooms, property_type, features } = property.data;

      return (
        price >= this.priceRange[0] &&
        price <= this.priceRange[1] &&
        bedrooms >= this.bedroomRange[0] &&
        bedrooms <= this.bedroomRange[1] &&
        bathrooms >= this.bathroomRange[0] &&
        bathrooms <= this.bathroomRange[1] &&
        (this.propertyType === "" || property_type === this.propertyType) &&
        this.selectedFeatures.every((f) => features.includes(f))
      );
    });

    this.notifySubscribers();
  }

  // Handle map interactions
  public processMapClick(event: SKMouseEvent, map: MapWidget, model: MapWidgetModel): void {
    model.points.forEach((point) => {
      const { x, y } = model.latLonToCanvas(point.latitude, point.longitude, map.width, map.height);

      if (this.calculateDistance(map.x + x, map.y + y, event.x, event.y) <= 5) {
        point.dataDisplay = new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" }).format(point.data.price);
      } else {
        point.dataDisplay = "";
      }
    });
  }

  // Utility to calculate distance
  private calculateDistance(x1: number, y1: number, x2: number, y2: number): number {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  }
}
