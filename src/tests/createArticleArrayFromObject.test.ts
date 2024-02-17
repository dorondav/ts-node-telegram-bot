import { createArticleArrayFromObject } from '../utils/functions';
import { Article, ScraperPageData } from '../Types/type';

// Mocking the scraper function
jest.mock('../../dist/scraper/wallaNews', () => ({
  scraper: jest.fn(), // Mocking the scraper function
}));

describe('createArticleArrayFromObject', () => {
  it('transforms parameters into an array of type Article', () => {
    // Define a sample scrape object
    const scrapeObject: ScraperPageData = {
      title: ['title1', 'title2'],
      url: ['url1', 'url2'],
      body: ['body1', 'body2'],
    };

    // Define a sample source string
    const source = 'source';

    // Call the createArticleArrayFromObject function
    const result = createArticleArrayFromObject(scrapeObject, source);

    // Assert that the result is an array
    expect(Array.isArray(result)).toBe(true);

    // Assert that each item in the array is of type Article
    result.forEach((item: Article) => {
      expect(typeof item.title).toBe('string'); // Assuming title is a string
      expect(typeof item.url).toBe('string'); // Assuming url is a string
      expect(typeof item.body).toBe('string'); // Assuming body is a string
      // Add more specific checks for properties or types if needed
    });
  });
});
