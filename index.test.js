import { fireEvent, getByText } from '@testing-library/dom';
import '@testing-library/jest-dom/extend-expect';
import { JSDOM } from 'jsdom';
import fs from 'fs';
import path from 'path';

const html = fs.readFileSync(path.resolve(__dirname, './index.html'), 'utf8');

let dom;
let container;

describe('index.html', () => {
  beforeEach(() => {
    // Constructing a new JSDOM with this option is the key
    // to getting the code in the script tag to execute.
    // This is indeed dangerous and should only be done with trusted content.
    // https://github.com/jsdom/jsdom#executing-scripts
    dom = new JSDOM(html, { runScripts: 'dangerously' });
    container = dom.window.document.body;
  });

  it('Check whether the index.html has a heading eleemnt', () => {
    const headingElements = [
      container.querySelector('h1'),
      container.querySelector('h2'),
      container.querySelector('h3'),
      container.querySelector('h4'),
      container.querySelector('h5'),
    ];
    expect(headingElements.some((elem) => !!elem)).toBeTruthy();
  });

  it('Check whether the index.html has a valid image', () => {
    const element = container.querySelector('img');
    expect(element).not.toBeNull();
    expect(element.hasAttribute('src')).toBeTruthy();
    expect(element.hasAttribute('alt')).toBeTruthy();
    const imageSrc = element.getAttribute('src');
    try {
      fs.readFileSync(path.resolve(__dirname, imageSrc), 'utf8');
    } catch (err) {
      fail(err);
    }
  });

  it('Check whether the index.html has a ul element', () => {
    const element = container.querySelector('ul');
    expect(element).not.toBeNull();
  });

  it('Check whether the index.html has a link for a social network page', () => {
    const aElements = container.querySelectorAll('a');
    const hasLinkToSocialNetwork = [...aElements].some(
      (element) =>
        element.hasAttribute('href') &&
        (element.getAttribute('href').indexOf('instagram') >= 0 ||
          element.getAttribute('href').indexOf('facebook') >= 0 ||
          element.getAttribute('href').indexOf('twitter') >= 0 ||
          element.getAttribute('href').indexOf('linkedin') >= 0)
    );
    expect(hasLinkToSocialNetwork).toBeTruthy();
  });
});
