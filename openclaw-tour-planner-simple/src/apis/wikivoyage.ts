import axios from 'axios';

export async function getGuide(destination: string): Promise<string> {
  try {
    const url = 'https://en.wikivoyage.org/w/api.php';
    const response = await axios.get(url, {
      params: {
        action: 'query',
        titles: destination,
        prop: 'extracts',
        exintro: true,
        explaintext: true,
        format: 'json',
        origin: '*'
      }
    });
    
    const pages = response.data.query.pages;
    const page = pages[Object.keys(pages)[0]];
    return page.extract || '';
  } catch (error) {
    console.error('Wikivoyage error:', error);
    return '';
  }
}
