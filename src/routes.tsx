import React from 'react';

// Import all .tsx files in the pages folder
const pages = import.meta.glob('./pages/**/*.tsx');

// Function to convert path to URL
function pathToRoute(path: string) {
  return path
    .replace('./pages', '')
    .replace(/\.tsx$/, '')
    .replace(/\/index$/, '/');
}

// Create array of route objects
export const routes = Object.keys(pages).map((path) => {
  const Component = React.lazy(
    pages[path] as () => Promise<{
      default: React.ComponentType;
    }>,
  );
  return {
    path: pathToRoute(path),
    Component,
  };
});
