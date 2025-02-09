// NavigationService.utils.ts

import * as React from 'react';
import {
  CommonActions,
  NavigationContainerRef,
  StackActions,
} from '@react-navigation/native';

export const navigationRef = React.createRef<NavigationContainerRef<any>>();

/**
 * Check if navigation can go back.
 * @returns {boolean}
 */
function canGoBack(): boolean {
  return navigationRef.current?.canGoBack() || false;
}

/**
 * Navigate back.
 */
function goBack(): void {
  if (canGoBack()) {
    navigationRef.current?.goBack();
  }
}

/**
 * Navigate to a specific route.
 * @param {string} name - The name of the route to navigate to.
 * @param {object} params - Route parameters.
 */
function navigate(name: string, params?: object): void {
  navigationRef.current?.navigate(name, params);
}

/**
 * Replace the current route with a new one.
 * @param {string} name - The name of the route to replace with.
 * @param {object} params - Route parameters.
 */
function replace(name: string, params?: object): void {
  navigationRef.current?.dispatch(StackActions.replace(name, params));
}

/**
 * Push a new route onto the stack.
 * @param {string} name - The name of the route to push.
 * @param {object} params - Route parameters.
 */
function dispatchPush(name: string, params?: object): void {
  navigationRef.current?.dispatch(StackActions.push(name, params));
}

/**
 * Pop routes from the stack.
 * @param {number} count - Number of routes to pop.
 */
function dispatchPop(count: number = 1): void {
  navigationRef.current?.dispatch(StackActions.pop(count));
}

/**
 * Navigate to a route and reset the navigation stack.
 * @param {string} name - The name of the route to navigate to.
 * @param {object} params - Route parameters.
 */
function navigateAndReset(name: string, params?: object): void {
  navigationRef.current?.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [{name, params}],
    }),
  );
}

/**
 * Navigate and reset with custom parameters.
 * @param {object} params - Custom reset parameters.
 */
function navigateAndResetCustom(params: object): void {
  navigationRef.current?.dispatch(CommonActions.reset(params));
}

/**
 * Replace the current route with a new one using dispatch.
 * @param {string} name - The name of the route to replace with.
 * @param {object} params - Route parameters.
 */
function dispatchReplace(name: string, params?: object): void {
  navigationRef.current?.dispatch(StackActions.replace(name, params));
}

export default {
  navigationRef,
  canGoBack,
  goBack,
  navigate,
  replace,
  dispatchPush,
  dispatchPop,
  navigateAndReset,
  navigateAndResetCustom,
  dispatchReplace,
};
