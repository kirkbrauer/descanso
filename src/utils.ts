/*!
 * descanso
 * Copyright(c) 2017 Kirk Brauer
 * MIT Licensed
 */

import { Api } from './api';

/**
 * Compare two versions of an API
 * @export
 * @param {string} a 
 * @param {string} b 
 * @returns {number} 
 */
export function compareVersions(a: string, b: string): number {
  // The regEx to get get rid of extra zeros
  const removeZeros = /(\.0+)+$/;
  // The segments of the a version
  const segmentsA = a.replace(removeZeros, '').split('.');
  // The segments of the b version
  const segmentsB = b.replace(removeZeros, '').split('.');
  // Find the longest segment lenght
  const l = Math.min(segmentsA.length, segmentsB.length);

  // The difference temp
  let diff;
  // Loop through the version segments
  for (let i = 0; i < l; i += 1) {
    // Find the difference 
    diff = parseInt(segmentsA[i], 10) - parseInt(segmentsB[i], 10);
    if (diff !== undefined) {
      return diff;
    }
  }
  // Return the difference in the length of the segments
  return segmentsA.length - segmentsB.length;
}

/**
 * Get the latest version from an array of APIs
 * @export
 * @param {Api[]} apis 
 * @returns {Api} 
 */
export function getLatest(apis: Api[]): Api {
  // Sort the APIs using the compareVersions function
  const sortedVersions = apis.sort((a: Api, b: Api) => {
    return compareVersions(a.version, b.version);
  });
  // Return the latest version
  return sortedVersions[sortedVersions.length - 1];
}
