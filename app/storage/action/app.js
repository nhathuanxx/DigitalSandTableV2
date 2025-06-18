import * as Actions from "../actions";

export function userProfile(user) {
  return { type: Actions.UserProfile, user };
}

export function showScreen(showScreen) {
  return { type: Actions.ShowScreen, showScreen };
}

export function typeRouteInput(typeRouteInput) {
  return { type: Actions.TypeRouteInput, typeRouteInput };
}

export function navigationFrom(navigationFrom) {
  return { type: Actions.NavigationFrom, navigationFrom };
}

export function navigationTo(navigationTo) {
  return { type: Actions.NavigationTo, navigationTo };
}

export function vehicle(vehicle) {
  return { type: Actions.Vehicle, vehicle };
}

export function place(place) {
  return { type: Actions.Place, place };
}

export function myLocation(myLocation) {
  return { type: Actions.MyLocation, myLocation };
}

export function routeResult(routeResult) {
  return { type: Actions.RouteResult, routeResult };
}

export function route(route) {
  return { type: Actions.Route, route };
}

export function mapView(mapView) {
  return { type: Actions.MapView, mapView };
}

export function cameraLocations(cameraLocations = []) {
  return { type: Actions.CameraLocations, cameraLocations };
}

export function cameraLocationSelected(cameraLocationSelected = []) {
  return { type: Actions.CameraLocationSelected, cameraLocationSelected };
}
export function isRouting(isRouting) {
  return { type: Actions.IsRouting, isRouting };
}

export function speed(speed) {
  return { type: Actions.Speed, speed };
}

export function isEndPoint(isEndPoint) {
  return { type: Actions.IsEndPoint, isEndPoint };
}

export function remainingDistance(remainingDistance) {
  return { type: Actions.RemainingDistance, remainingDistance };
}

export function navigationToArray(navigationToArray) {
  return { type: Actions.NavigationToArray, navigationToArray };
}

export function endLocationIndex(endLocationIndex) {
  return { type: Actions.EndLocationIndex, endLocationIndex };
}

export function stepIndex(stepIndex) {
  return { type: Actions.StepIndex, stepIndex };
}

export function isReturn(isReturn) {
  return { type: Actions.IsReturn, isReturn };
}

export function isProgram(isProgram) {
  return { type: Actions.IsProgram, isProgram };
}
export function stepView(stepView) {
  return { type: Actions.StepView, stepView };
}
export function isLoad(isLoad) {
  return { type: Actions.IsLoad, isLoad };
}
export function isDeeplink(isDeeplink) {
  return { type: Actions.IsDeeplink, isDeeplink };
}