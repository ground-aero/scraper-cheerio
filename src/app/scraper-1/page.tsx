// Test scraper-1. Ajusted for scraping of specific part of html page only: https://www.iata.org/en/events/
// by input of the specific link into browser (example: http://localhost:3000/scraper-1?url=https://example.com)
import * as cheerio from 'cheerio';

interface ParseProps {
  searchParams: { url?: string };
}

const ParsePage = async ({ searchParams }: ParseProps) => {

  const url = searchParams.url;

  if (!url) {
    return (
      <div>
        <h1>Error</h1>
        <p>URL is required.</p>
      </div>
    );
  }

  try {
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    });

const $ = cheerio.load(data);
    const title = $('title').text();
    const description = $('meta[name="description"]').attr('content') || '';
    const selected = $('div.global-event-list-inner').html(); // Извлечение содержимого элемента с классом .footer__auth
    const img = $('img.global-event-list-item-img').html();
    const fullHtml = $.html();
console.log(fullHtml); // Вывод всего HTML в консоль для анализа

    return (
      <div>
        <h1>{title}</h1>
        <p>{description}</p>
        <div>
          <h2>Selected Content:</h2>
          <div dangerouslySetInnerHTML={{ __html: selected || 'No content found for Selected' }} />
          <img src="" alt="" />

        </div>
      </div>
    );
  } catch (error) {
    console.error('Error fetching the URL:', error);
    return (
      <div>
        <h1>Error</h1>
        <p>Could not fetch the URL.</p>
      </div>
    );
  }
};

export default ParsePage;