import {
    SKContainer,
    SKEvent,
    Layout,
    SKLabel,
    SKMouseEvent,
} from "../../simplekit/src/imperative-mode";
import { HFController } from "./hfcontroller";
import { HFModel } from "./hfmodel";
import { Subscriber } from "../../subscriber";
import { MapWidget,MapWidgetModel } from "../../widgets/MapWidget";
import { Property } from "./property";
import { SKRangeSlider } from "../../widgets/rangeslider/checkbox/rangeslider";
import { SKRadioButton } from "../../widgets/radiobutton/checkbox/radiobutton";
import { RBGroup } from "../../widgets/radiobutton/checkbox/rbgroup";
import { CheckBox } from "../../widgets/checkbox";
function calculateDistance(x1: number, y1: number, x2: number, y2: number): number {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
}
function dataDisplayCallBack(data)
    {
        console.log(data);
    }
export class HFView extends SKContainer implements Subscriber {
    public model!: HFModel;
    public panel: SKContainer;
    public rightPanel: SKContainer;
    public leftPanel: SKContainer;

    public sliders: { [key: string]: SKRangeSlider };
    public labels: { [key: string]: SKLabel };
    public group: RBGroup;
    public checkboxes: { [key: string]: CheckBox };

    public map!: MapWidget;

    constructor(propertiesForSale: Property[]) {
        super();

        this.panel = new SKContainer();
        this.rightPanel = new SKContainer();
        this.leftPanel = new SKContainer();
        this.sliders = {};
        this.labels = {};
        this.group = new RBGroup();
        this.checkboxes = {};

        this.initializeLayout();
        this.initializeFilters();
        this.initializeMap(propertiesForSale);

        this.panel.addChild(this.leftPanel);
        this.panel.addChild(this.rightPanel);
        this.addChild(this.panel);
    }
    update(): void {
        
    }

    private initializeLayout() {
        this.panel.width = 1800;
        this.panel.height = 900;
        this.panel.layoutMethod = Layout.makeWrapRowLayout();

        this.rightPanel.width = 500;
        this.rightPanel.height = 700;
        this.rightPanel.fill = "lightblue";
        this.rightPanel.layoutMethod = Layout.makeWrapRowLayout();

        this.leftPanel.width = 1300;
        this.leftPanel.height = 700;
    }

    private initializeFilters() {
        this.setupSliders();
        this.setupRadioButtons();
        this.setupCheckboxes();
    }

    public setupSliders() {
        const sliderConfigs = [
            { key: "bedroom", min: 1, max: 8 },
            { key: "bathroom", min: 1, max: 8 },
            { key: "cost", min: 50000, max: 1000000 },
        ];

        sliderConfigs.forEach(({ key, min, max }) => {
            const slider = new SKRangeSlider(min, max, 300);
            const label = new SKLabel();
            label.font = "30pt consolas";
            label.fontColour = "black";
            label.margin = this.margin;
            label.width = undefined
            label.height = undefined
            label.text=key.charAt(0).toUpperCase() + key.slice(1);


            this.sliders[key] = slider;
            this.labels[key] = label;

            this.rightPanel.addChild(label);
            //slider.setWidth(this.rightPanel.width! - 2 * this.margin);
            this.rightPanel.addChild(slider);
        });
    }

    public setupRadioButtons() {
        const radioLabels = ["Residential", "Condo", "Recreational", "Vacant Land"];
        const container = new SKContainer();
        container.width=this.rightPanel.width
        container.height=100

        container.layoutMethod = Layout.makeWrapRowLayout();
        radioLabels.forEach((labelText) => {
            const radioButton = new SKRadioButton(
                0,
                0,
                this.rightPanel.width! / 2 - 2 * this.margin,
                50,
                this.group,
                labelText,
                "grey",
                "black"
            );
            container.addChild(radioButton);
        });

        this.rightPanel.addChild(container);
    }

    public setupCheckboxes() {
        const checkboxOptions = ["Waterfront", "Garage", "Pool"];
        checkboxOptions.forEach((label) => {
            const checkbox = new CheckBox(0, 0, 30, 30, "grey", "white",label);
            checkbox.margin=20
            this.checkboxes[label.toLowerCase()] = checkbox;
            this.rightPanel.addChild(checkbox);

        });
    }
    
    private initializeMap(propertiesForSale: Property[]) {
        this.map = new MapWidget(propertiesForSale, {
            width: 1300,
            height: 700,
            fill: "beige",
        });
        this.map.drawMapFeatureFunctions.push(this.drawnRiver);
        this.map.addMapEventHandler(
            function(e:SKEvent, map:MapWidget, model:MapWidgetModel)
            {
                if (e.type === "mousemove")
                {
                    let mouseEvent = e as SKMouseEvent;
        
                    model.points.forEach((p) => {
                            const { x, y } = model.latLonToCanvas(
                                p.latitude,
                                p.longitude,
                                map.width,
                                map.height
                            );
                            // considered a hit if less than 5 pixels away
                            if (
                              calculateDistance(
                                map.x + x,
                                map.y + y,
                                mouseEvent.x,
                                mouseEvent.y
                              ) <= 5
        
                            ) {
                              // Format the price above to USD using the locale, style, and currency.
                              let CADDollar = new Intl.NumberFormat("en-CA", {
                                style: "currency",
                                currency: "CAD",
                              });
                              //demonstrating displaying to the map
                              p.dataDisplay = `${CADDollar.format(p.data['price'])}`;
        
                              //demonstrating call to any function
                              dataDisplayCallBack(p.data);
                            } else {
                              p.dataDisplay = "";
                            }
                    });
                }
            }
        );
        this.leftPanel.addChild(this.map);
    }

    public setModel(model: HFModel) {
        this.model = model;
    }

    public setEvents(controller: HFController) {
        Object.entries(this.sliders).forEach(([key, slider]) => {
            slider.addEventListener("update", () => {
                this.updateRange(
                    this.sliders.cost.currMin,
                    this.sliders.cost.currMax,
                    this.sliders.bathroom.currMin,
                    this.sliders.bathroom.currMax,
                    this.sliders.bedroom.currMin,
                    this.sliders.bedroom.currMax
                );
            });
        });

        this.group.addEventListener("Residential", () => {this.updateType("Residential")});
        this.group.addEventListener("Condo", () => {this.updateType("Condo")});
        this.group.addEventListener("Recreational", () => {this.updateType("Recreational")});
        this.group.addEventListener("Vacant Land", () => {this.updateType("Vacant Land")});
        this.group.addEventListener("none", () => {this.updateType("all")});

        Object.values(this.checkboxes).forEach((checkbox) => {
            checkbox.addEventListener("on", () => this.updateFeatures(checkbox.label,true));
            checkbox.addEventListener("off", () =>
                this.updateFeatures(checkbox.label, false)
            );
        });
    }
    public updateFeatures(label:string, state:boolean){
        this.map.updateFeatures(label, state)
    }
    public updateType(label:string){
        this.map.updateType(label)
    }
    // Function to draw a river path on the canvas with scaling based on canvas size
    private drawnRiver(
        gc: CanvasRenderingContext2D,
        x: number = 0,
        y: number = 0,
        width: number = 400,
        height: number = 400
    ) {
        gc.save();
        gc.translate(x, y);
        gc.beginPath();

        // Define points as percentages of the canvas dimensions for scalability
        const startX = 0.0 * width; // 50 of 800 width
        const startY = 0.417 * height; // 550 of 600 height
        gc.moveTo(startX, startY);

        // Define curves using proportions of the canvas size
        gc.bezierCurveTo(
            0.1 * width,
            0.4 * height, // 100, 500
            0.25 * width,
            0.75 * height, // 200, 450
            0.375 * width,
            0.7 * height // 300, 500
        );

        gc.bezierCurveTo(
            0.6 * width,
            0.8 * height, // 400, 550
            0.625 * width,
            height, // 500, 600
            0.75 * width,
            0.75 * height // 600, 450
        );

        gc.bezierCurveTo(
            0.875 * width,
            0.667 * height, // 700, 400
            0.9375 * width,
            0.583 * height, // 750, 350
            1 * width,
            0.6 * height // 750, 400
        );

        // Style the river
        gc.strokeStyle = "blue"; // River color
        gc.lineWidth = 0.035 * width; // Scale the width of the river based on canvas width
        gc.globalAlpha = 0.8; // Slight transparency
        gc.stroke();
        gc.restore();
    }
    // Update ranges for filtering
  public updateRange(
    costMin:number,costMax:number,bathMin:number,bathMax:number,bedMin:number,bedMax:number
  ): void {
    this.map.updateRange(costMin,costMax,bathMin,bathMax,bedMin,bedMax);
  }
    
    
}
