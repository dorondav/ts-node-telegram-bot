import express, { Router, Request, Response } from 'express';
import { logger } from '../lib/logger';
import { Article } from '../Types/type';
import scrapeYnet from '../scraper/ynet';
import scrapeWallaNews from '../scraper/wallaNews';
import scrapeOne from '../scraper/one';

const router: Router = express.Router();

router.get('/all', (req: Request, res: Response) => {
  Promise.allSettled([scrapeWallaNews(), scrapeYnet(), scrapeOne()]).then((items) => {
    const allStories = items;
    //Error Handlings
    allStories.forEach((item) => {
      if (item.status === 'rejected') {
        logger.error('News Router Error:', item.reason);
      }
    });

    res.status(200).json({ allStories });
  }).catch((error) => {
    logger.error('News Router Error:', error);
  });
});

router.get('/ynet', (req: Request, res: Response) => {
  scrapeYnet()
    .then((items: { data: Article[] } | undefined) => {
      const stories = items?.data;
      if (stories !== undefined) {
        res.status(200).json({ stories });
      } else {
        res.status(500).json({ error: 'issue showing news articles from Ynet.' });
        logger.error('[Scraper Function] Error: issue showing news articles from Ynet.');
      }
    })
    .catch((error) => {
      logger.error('News Router Error:', error);
    });
});

router.get('/walla_news', (req: Request, res: Response) => {
  scrapeWallaNews()
    .then((items: { data: Article[] } | undefined) => {
      const stories = items?.data;
      if (stories !== undefined) {
        res.status(200).json({ stories });
      } else {
        res.status(500).json({ error: 'issue showing news articles from Walla.' });
        logger.error('[Scraper Function] Error: issue showing news articles from Walla.');
      }
    })
    .catch((error) => {
      logger.error('News Router Error:', error);
    });
});
router.get('/one_sport', (req: Request, res: Response) => {
  scrapeOne()
    .then((items: { data: Article[] } | undefined) => {
      const stories = items?.data;
      if (stories !== undefined) {
        res.status(200).json({ stories });
      } else {
        res.status(500).json({ error: 'issue showing news articles from One.' });
        logger.error('[Scraper Function] Error: issue showing news articles from One.');
      }
    })
    .catch((error) => {
      logger.error('News Router Error:', error);
    });
});
export = router;
