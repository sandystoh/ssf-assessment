require('dotenv').config();
const request = require('request'); 

module.exports = function(app, API_URL) {
    const BOOKS_API_URL = `${API_URL}/book`;
    const mkQuery = require('../db/dbutil');

    const getBookById = mkQuery('select * from book2018 where book_id = ?');

    const TIMES_API_KEY = process.env.TIMES_API_KEY;
    const TIME = (new Date()).getTime();

    // GET /api/books/:id
    app.get(`${BOOKS_API_URL}/:id`,
        (req, resp) => {
            const id = req.params.id;
            
            getBookById([ id ])
                .then(result => {
                    if (result.length == 0)
                    // ErrorResponse object
                        resp.status(404).json({
                            status: 404,
                            message: `Book ID ${id} not valid`,
                            timestamp: TIME
                        });
                    console.log(result);
                    resp.status(200).json({
                        // BookResponse object
                        data: result.map(v => {
                            // Removes author/genre names that are duplicated in DB e.g. for "Love and Ruin"
                            v.authors = Array.from(new Set(v.authors.split('|')))
                            v.genres = Array.from(new Set(v.genres.split('|')));
                            return v;
                        })[0],
                        timestamp: TIME
                    });
                })
                .catch(error => {
                    resp.status(500).json({
                        status: 500,
                        message: error,
                        timestamp: TIME
                    });
                })
        }
    );

        // GET /api/books/:id/review
        app.get(`${BOOKS_API_URL}/:id/review`,
        (req, resp) => {
            const id = req.params.id;
            
            getBookById([ id ])
                .then(result => {
                    if (result.length == 0)
                    // ErrorResponse object
                        resp.status(404).json({
                            status: 404,
                            message: `Book ID ${id} not valid`,
                            timestamp: TIME
                        });

                    const title = result[0].title;
                    console.log(`https://api.nytimes.com/svc/books/v3/reviews.json?api-key=${TIMES_API_KEY}&title=${title}`);
                    request.get(`https://api.nytimes.com/svc/books/v3/reviews.json?api-key=${TIMES_API_KEY}&title=${title}`
                        , (error, response, body) => { 
                        if (error) 
                            resp.status(404).json({
                                status: 404,
                                message: error,
                                timestamp: TIME
                            });
                        const rev = (JSON.parse(body));
                        console.log(rev);
                        if (!error && response.statusCode == 200) {
                            resp.status(200).json({
                                data: (rev.num_results === 0) ? [] : rev.results.map(v => {
                                    const review = {
                                        book_id: id,
                                        title: v.book_title,
                                        authors: v.book_author.split(' and '),
                                        byline: v.byline,
                                        summary: v.summary,
                                        url: v.url
                                    };
                                    return review;
                                }),
                                timestamp: TIME
                            });
                        };
                    });
                })
                .catch(error => {
                    resp.status(500).json({
                        status: 500,
                        message: error,
                        timestamp: TIME
                    });
                })
        }
    );

}