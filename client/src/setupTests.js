// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/extend-expect'

// This hides the Jest output: Error: Not implemented: window.scrollTo
const emptyFunction = () => {}
Object.defineProperty(window, 'scrollTo', { value: emptyFunction, writable: true })
global.document = { 'className': 'dark' } // default theme if not overwritten by localStorage and/or State

global.console = {
  log: console.log, 
  error: jest.fn(), // to ignore PropTypes warnings
  warn: console.warn,
  info: console.info,
  debug: console.debug,
}