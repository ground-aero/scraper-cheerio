// src/app/scrape2/page.tsx - this option is for input of the specific url into browser, after launching npm run dev
// example: http://localhost:3000/scraper-2?url=https://example.com
// Ajusted for scraping of specific part of html page only: https://www.iata.org/en/events/
import axios from 'axios';
import * as cheerio from 'cheerio';
import styles from '../page.module.css'

interface ScrapePageProps {
  searchParams: { url?: string };
}

const ScrapePage = async ({ searchParams }: ScrapePageProps) => {
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

    // Извлечение всех элементов <div> с классом 'global-event-list-item-wrapper'
    const eventItems = $('.global-event-list-item-wrapper').map((_, element) => {
      const wrapper = $(element);

      // Извлечение <a> с классом 'global-event-list-item'
      const link = wrapper.find('.global-event-list-item');
      const linkHref = link.attr('href') || '';
      
      // Извлечение <img> с классом 'global-event-list-item-img'
      const img = link.find('.global-event-list-item-img');
      const imgSrc = img.attr('src') || '';
      const imgAlt = img.attr('alt') || '';

      // Извлечение <div> с классом 'global-event-list-item-content'
      const content = link.find('.global-event-list-item-content').html() || '';

      return {
        linkHref,
        imgSrc,
        imgAlt,
        content,
      };
    }).get(); // Преобразование результата в массив

    return (
      <div>
        <h1>Event Items</h1>
        {eventItems.length > 0 ? (
          <div className={styles.box__center}>
            <ul>
              {eventItems.map((item, index) => (
                <li key={index} className={styles.list_style_type_events}>
                  <a href={item.linkHref}>
                    <img src={`https://www.iata.org${item.imgSrc}`} className={styles.imgCard} alt={item.imgAlt} />
                    <div dangerouslySetInnerHTML={{ __html: item.content }} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
        ) : (
          <p>No event items found.</p>
        )}
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

export default ScrapePage;
