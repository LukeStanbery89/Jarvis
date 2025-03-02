// // Mock console.info globally
global.console.info = jest.fn();
global.console.debug = jest.fn();
global.console.error = jest.fn();
setTimeout = jest.fn();