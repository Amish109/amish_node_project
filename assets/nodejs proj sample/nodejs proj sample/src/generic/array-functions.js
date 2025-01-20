// @author: Manish Jain
// Created on: 2018-12-13 05:10 PM
// Description: Array utility functions.

// Modified by: Manish Jain
// On: 2022-01-18 10:00
// Reason: function syntax generalization

// Modified by: Manish Jain
// On: 2021-12-24 15:00
// Reason: Migrating from ECMA5 to ECMA6.
"use strict";

let intersect = function (arrA, arrB) {
	return arrA.filter(x => arrB.includes(x));
};

let difference = function (a1, a2) {
	let a = [], diff = [];

	for (let i = 0; i < a1.length; i++) {
		a[a1[i]] = true;
	}

	for (let i = 0; i < a2.length; i++) {
		if (a[a2[i]]) {
			delete a[a2[i]];
		} else {
			a[a2[i]] = true;
		}
	}

	for (let k in a) {
		diff.push(k);
	}

	return diff;
};

let mergeArray = function (array1, array2) {
	let result_array = [];
	let arr = array1.concat(array2);
	let len = arr.length;
	let assoc = {};

	while (len--) {
		let item = arr[len];

		if (!assoc[item]) {
			result_array.unshift(item);
			assoc[item] = true;
		}
	}

	return result_array;
};

let arrayUnique = function (array) {
	let a = JSON.parse(JSON.stringify(array));
	for (let i = 0; i < a.length; ++i) {
		for (let j = i + 1; j < a.length; ++j) {
			if (a[i] === a[j])
				a.splice(j--, 1);
		}
	}

	return a;
};

let excludeIfInOther = function (arr, othr) {
	let temp_array = [];

	for (let i = 0; i < arr.length; i++) {
		if (!othr.includes(arr[i])) {
			temp_array.push(arr[i]);
		}
	}

	return temp_array;
};

let getMaxDepth = function (object) {
	let level = 1;

	for (let key in object) {
		if (!object.hasOwnProperty(key)) continue;

		if (typeof object[key] == 'object') {
			let depth = getMaxDepth(object[key]) + 1;
			level = Math.max(depth, level);
		}
	}

	return level;
};

function hasCommonElements(arr1, arr2) {

	return arr1.some(item => arr2.includes(item)); //returns boolean value
}

function isSubsetOf(arr1, arr2) { //arr1 is subset of arr2, returns boolean value

	return arr1.every(val => arr2.includes(val));
}

module.exports = {
	intersect: intersect,
	difference: difference,
	mergeArray: mergeArray,
	arrayUnique: arrayUnique,
	excludeIfInOther: excludeIfInOther,
	getMaxDepth: getMaxDepth,
	hasCommonElements: hasCommonElements,
	isSubsetOf: isSubsetOf
};