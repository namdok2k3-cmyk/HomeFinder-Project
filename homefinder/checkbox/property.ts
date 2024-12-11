import { MapPoint } from "../../widgets/MapWidget";

export interface Property extends MapPoint {
    data: {
        id: number;
        address: string;
        price: number;
        bedrooms: number;
        bathrooms: number;
        property_type: string;
        features: string[];
        description: string;
    };
}
