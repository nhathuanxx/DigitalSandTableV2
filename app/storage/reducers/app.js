import { cameraLocationSelected } from "../action/app";
import * as Actions from "../actions";
import { appReducer } from "react-universal-ui";

const initialState = {
  user: {},
  showScreen: "overview",
  typeRouteInput: "from",
  navigationFrom: null,
  navigationTo: null,
  vehicle: "car",
  place: null,
  myLocation: null,
  routeResult: null,
  route: null,
  mapView: {},
  cameraLocations: [],
  cameraLocationSelected: [],
  isRouting: false,
  speed: 0,
  isEndPoint: false,
  remainingDistance: 0,
  navigationToArray: [],
  endLocationIndex: -1,
  stepIndex: 0,
  isReturn: true,
  isProgram: false,
  stepView: null,
  isLoad: false,
  isDeepLink: false,
};

export default appReducer((state = initialState, action) => {
  switch (action.type) {
    case Actions.UserProfile:
      return { ...state, user: action.user };
    case Actions.ShowScreen:
      return { ...state, showScreen: action.showScreen };
    case Actions.TypeRouteInput:
      return { ...state, typeRouteInput: action.typeRouteInput };
    case Actions.NavigationFrom:
      return { ...state, navigationFrom: action.navigationFrom };
    case Actions.NavigationTo:
      return { ...state, navigationTo: action.navigationTo };
    case Actions.Vehicle:
      return { ...state, vehicle: action.vehicle };
    case Actions.Place:
      return { ...state, place: action.place };
    case Actions.MyLocation:
      return { ...state, myLocation: action.myLocation };
    case Actions.RouteResult:
      return { ...state, routeResult: action.routeResult };
    case Actions.Route:
      return { ...state, route: action.route };
    case Actions.MapView:
      return { ...state, mapView: action.mapView };
    case Actions.CameraLocations:
      return { ...state, cameraLocations: action.cameraLocations };
    case Actions.CameraLocationSelected:
      return { ...state, cameraLocationSelected: action.cameraLocationSelected };
    case Actions.IsRouting:
      return { ...state, isRouting: action.isRouting };
    case Actions.Speed:
      return { ...state, speed: action.speed };
    case Actions.IsEndPoint:
      return { ...state, isEndPoint: action.isEndPoint };
    case Actions.RemainingDistance:
      return { ...state, remainingDistance: action.remainingDistance };
    case Actions.NavigationToArray:
      return { ...state, navigationToArray: action.navigationToArray };
    case Actions.EndLocationIndex:
      return { ...state, endLocationIndex: action.endLocationIndex };
    case Actions.StepIndex:
      return { ...state, stepIndex: action.stepIndex };
    case Actions.IsReturn:
      return { ...state, isReturn: action.isReturn };
    case Actions.IsProgram:
      return { ...state, isProgram: action.isProgram };
    case Actions.StepView:
      return { ...state, stepView: action.stepView };
    case Actions.IsLoad:
      return { ...state, isLoad: action.isLoad };
    case Actions.IsDeeplink:
      return { ...state, isDeeplink: action.isDeeplink };
    default:
      return state;
  }
});
