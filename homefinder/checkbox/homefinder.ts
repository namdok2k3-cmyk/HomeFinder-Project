import {
  SKContainer,
  Layout,
  SKEvent,
} from "../../simplekit/src/imperative-mode";
import { HFController } from "./hfcontroller";
import { HFModel } from "./hfmodel";
import { HFView } from "./hfview";
import { Property } from "./property";

export class HomeFinder extends SKContainer {
  private view: HFView;
  private model: HFModel;
  private controller: HFController;

  constructor(properties: Property[]) {
      super();

      // Initialize components
      this.model = new HFModel(properties);
      this.controller = new HFController();
      this.view = new HFView(properties);

      // Assign relationships
      this.controller.model = this.model;
      this.view.model = this.model;

      // Set up the layout and appearance
      this.layoutMethod = Layout.makeFixedLayout();
      this.fill = "transparent";

      // Register view as a subscriber to the model
      this.model.addSubscriber(this.view);

      // Configure the view to handle user interactions
      this.view.setEvents(this.controller);

      // Add the view to the container
      this.addChild(this.view);
  }

  draw(gc: CanvasRenderingContext2D): void {
      this.view.draw(gc);
  }
}
