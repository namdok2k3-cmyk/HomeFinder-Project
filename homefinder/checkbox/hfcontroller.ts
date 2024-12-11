import { SKMouseEvent } from "../../simplekit/src/events";
import { MapWidget, MapWidgetModel } from "../../widgets/MapWidget";
import { HFModel } from "./hfmodel";

export class HFController {
  public model!: HFModel; // Link to the model
    

  set setModel(model: HFModel) {
    this.model = model;
  }

  

  // Add or remove features
  public toggleFeature(feature: string, enable: boolean): void {
    this.model.updateFeatures(feature, enable);
  }

  // Update the property category
  public setCategory(category: string): void {
    this.model.setCategory(category);
  }

  // Handle map interaction
  public handleMapClick(event: SKMouseEvent, mapWidget: MapWidget, mapInfo: MapWidgetModel): void {
    this.model.processMapClick(event, mapWidget, mapInfo);
  }
  
}
