
module.exports = function(app, API_URL) {
    const BOOKS_API_URL = `${API_URL}/book`;
    const mkQuery = require('../db/dbutil');

    const getBookById = mkQuery('select * from book2018 where book_id = ?');

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
                            timestamp: (new Date()).getTime()
                        });
                    resp.status(200).json({
                        // BookResponse object
                        data: result.map(v => {
                            // Removes author/genre names that are duplicated in DB e.g. for "Love and Ruin"
                            v.authors = Array.from(new Set(v.authors.split('|')));
                            v.genres = Array.from(new Set(v.genres.split('|')));
                            return v;
                        }),
                        timestamp: (new Date()).getTime(),
                    });
                })
                .catch(error => {
                    resp.status(500).json({ message: JSON.stringify(error) });
                })
        }
    );

}