import { Images } from "@app/theme";

export function getRouteDetailsIcon(icon) {
    switch (icon) {
        case "left":
            return Images.turnLeft;
        case "right":
            return Images.turnRight;
        case "slight left":
            return Images.slightLeft;
        case "slight right":
            return Images.slightRight;
        case "uturn":
            return Images.turning;
        case "sharp left":
            return Images.slightLeft;
        case "sharp right":
            return Images.slightRight;
        case "straight":
            return Images.goStraight;
        case "":
            return Images.arriveStart;

        default:
            return null;
    }
}