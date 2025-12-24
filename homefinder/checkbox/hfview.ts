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

function dataDisplayCallBack(data) {
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

        // 1. Calculate screen size
        this.initializeLayout();
        
        // 2. Build UI
        this.initializeFilters();
        this.initializeMap(propertiesForSale);

        this.panel.addChild(this.leftPanel);
        this.panel.addChild(this.rightPanel);
        this.addChild(this.panel);

        // --- NEW: RESIZE LISTENERS ---

        // A. Listen for window resize events (if user drags window or rotates screen)
        window.addEventListener("resize", () => {
            this.handleResize();
        });

        // B. Safety Check: Force a resize calculation 50ms after load.
        // This fixes the "doesn't fill screen at first" bug.
        setTimeout(() => {
            this.handleResize();
        }, 50);
    }

    update(): void {
        
    }

    // New helper to recalculate sizes dynamically
    private handleResize() {
        const sidebarWidth = 350;

        // 1. Update Main View
        this.width = window.innerWidth;
        this.height = window.innerHeight;

        // 2. Update Main Panel
        this.panel.width = window.innerWidth;
        this.panel.height = window.innerHeight;

        // 3. Update Sidebar Height
        this.rightPanel.height = this.panel.height;

        // 4. Update Map Panel Size
        this.leftPanel.width = this.panel.width - sidebarWidth;
        this.leftPanel.height = this.panel.height;

        // 5. Update the Map Widget itself
        if (this.map) {
            this.map.width = this.leftPanel.width;
            this.map.height = this.leftPanel.height;
        }
    }

    private initializeLayout() {
        // Initial setup (same logic as handleResize, runs once at start)
        this.width = window.innerWidth;
        this.height = window.innerHeight;

        this.panel.width = window.innerWidth;
        this.panel.height = window.innerHeight;
        this.panel.layoutMethod = Layout.makeWrapRowLayout(); 

        const sidebarWidth = 350; 
        this.rightPanel.width = sidebarWidth;
        this.rightPanel.height = this.panel.height;
        this.rightPanel.fill = "lightblue";
        this.rightPanel.layoutMethod = Layout.makeWrapRowLayout();

        this.leftPanel.width = this.panel.width - sidebarWidth;
        this.leftPanel.height = this.panel.height;
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
            // Container for Label + Slider
            const container = new SKContainer();
            container.width = this.rightPanel.width; 
            container.height = 130; // Height ensures slider fits
            container.layoutMethod = Layout.makeWrapRowLayout();
            
            // Label
            const label = new SKLabel();
            label.font = "20pt consolas";
            label.fontColour = "black";
            label.width = container.width; // Force slider to new line
            label.height = 30;
            label.text = key.charAt(0).toUpperCase() + key.slice(1);
            label.margin = 10; 

            // Slider
            const sliderWidth = (this.rightPanel.width || 350) - 40; 
            const slider = new SKRangeSlider(min, max, sliderWidth);
            slider.margin = 10; 

            this.sliders[key] = slider;
            this.labels[key] = label;

            container.addChild(label);
            container.addChild(slider);
            this.rightPanel.addChild(container);
        });
    }

    public setupRadioButtons() {
        const radioLabels = ["Residential", "Condo", "Recreational", "Vacant Land"];
        
        const container = new SKContainer();
        container.width = this.rightPanel.width;
        container.height = 160; 
        container.layoutMethod = Layout.makeWrapRowLayout();
        
        radioLabels.forEach((labelText) => {
            const radioButton = new SKRadioButton(
                0,
                0,
                (this.rightPanel.width! / 2) - 20, 
                40,
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
        
        const container = new SKContainer();
        container.width = this.rightPanel.width;
        container.height = 100;
        container.layoutMethod = Layout.makeWrapRowLayout();

        checkboxOptions.forEach((label) => {
            const checkbox = new CheckBox(0, 0, 30, 30, "grey", "white", label);
            checkbox.margin = 20;
            this.checkboxes[label.toLowerCase()] = checkbox;
            container.addChild(checkbox); 
        });
        
        this.rightPanel.addChild(container);
    }
    
    private initializeMap(propertiesForSale: Property[]) {
        this.map = new MapWidget(propertiesForSale, {
            width: this.leftPanel.width, 
            height: this.leftPanel.height,
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
                            if (
                              calculateDistance(
                                map.x + x,
                                map.y + y,
                                mouseEvent.x,
                                mouseEvent.y
                              ) <= 5
        
                            ) {
                              let CADDollar = new Intl.NumberFormat("en-CA", {
                                style: "currency",
                                currency: "CAD",
                              });
                              p.dataDisplay = `${CADDollar.format(p.data['price'])}`;
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

        const startX = 0.0 * width; 
        const startY = 0.417 * height; 
        gc.moveTo(startX, startY);

        gc.bezierCurveTo(
            0.1 * width, 0.4 * height, 
            0.25 * width, 0.75 * height, 
            0.375 * width, 0.7 * height 
        );

        gc.bezierCurveTo(
            0.6 * width, 0.8 * height, 
            0.625 * width, height, 
            0.75 * width, 0.75 * height 
        );

        gc.bezierCurveTo(
            0.875 * width, 0.667 * height, 
            0.9375 * width, 0.583 * height, 
            1 * width, 0.6 * height 
        );

        gc.strokeStyle = "blue"; 
        gc.lineWidth = 0.035 * width; 
        gc.globalAlpha = 0.8; 
        gc.stroke();
        gc.restore();
    }
    
  public updateRange(
    costMin:number,costMax:number,bathMin:number,bathMax:number,bedMin:number,bedMax:number
  ): void {
    this.map.updateRange(costMin,costMax,bathMin,bathMax,bedMin,bedMax);
  }
}