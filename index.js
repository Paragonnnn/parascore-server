import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 8000;

app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello World');
});

async function getTransfers() {
    try {
        const response = await fetch('https://www.fotmob.com/api/transfers?page=1');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching transfers:', error);
        throw error;
    }
}
async function getTransfersOrderByFee() {
    try {
        const response = await fetch('https://www.fotmob.com/api/transfers?orderBy=fee&page=1');
        const data = await response.json();
        return data;
    }
    catch (error) {
        console.error('Error fetching transfers:', error);
        throw error;
    }
}
async function getTransfersOrderByMarketValue() {
    try {
        const response = await fetch('https://www.fotmob.com/api/transfers?orderBy=value&page=1');
        const data = await response.json();
        return data;
    }
    catch (error) {
        console.error('Error fetching transfers:', error);
        throw error;
    }
    
}

async function getTopTransfers() {
    try {
        const response = await fetch('https://www.fotmob.com/api/transfers?showTop=true&page=1');
        const data = await response.json();
        return data;
    }
    catch (error) {
        console.error('Error fetching transfers:', error);
        throw error;
    }
}

async function getTransfersByLeagueId(id) {
    try {
        const response = await fetch(`https://www.fotmob.com/api/transfers?leagueIds=${id}&page=1`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching transfers:', error);
        throw error;
    }
}

async function getNews(page) {
    try {
        const response = await fetch(`https://www.fotmob.com/api/worldnews?lang=en&page=${page}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching news:', error);
        throw error;
    }
}

async function getNewsById(id) {
    try {
        const response = await fetch(`https://www.fotmob.com/api/news/news?id=${id}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching news:', error);
        throw error;
    }
}

app.get('/transfers', async (req, res) => {
    const { showTop } = req.query;
    const { orderBy } = req.query;
    const { leagueIds } = req.query;
    console.log('orderBy:', orderBy);
    console.log('showTop:', showTop);
    console.log('leagueIds:', leagueIds);
    
    try {
        const transfers = await getTransfers(); 
        const orderByFee = await getTransfersOrderByFee();
        const orderByMarketValue = await getTransfersOrderByMarketValue();
        const topTransfers = await getTopTransfers();
        const transfersByLeagueId = await getTransfersByLeagueId(leagueIds);
        let response;
        
        if (orderBy === 'fee') {
            response = orderByFee;
        } else if (orderBy === 'value') {
            response = orderByMarketValue;
        } else {
            response = transfers;
        }
        
        if (showTop === 'true') {
            response = topTransfers;
        }

        if (leagueIds !== undefined) {
            response = transfersByLeagueId;
        }
        
        res.send(response);
    } catch (error) {
        res.status(500).send({ message: 'Error fetching transfers', error });

    }
});

app.get('/news', async (req,res) => {
    const { page } = req.query;
    const { id } = req.query;
    console.log('page:', page);

    
    
    try {
        const news = await getNews(page);
        const newsById = await getNewsById(id);
        if (page) {
            res.send(news);
            
        } else if (id) {
            res.send(newsById)
        }
    } catch (error) {
        res.status(500).send({ message: 'Error fetching news', error });
    }
})




app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
