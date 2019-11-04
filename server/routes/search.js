
module.exports = function(app, API_URL) {
    const SEARCH_API_URL = `${API_URL}/search`;
    const mkQuery = require('../db/dbutil');

    const searchBooks = mkQuery('select book_id, title, authors, rating from book2018 where title like ? or authors like ? limit ? offset ?');
    const countSearchBooks = mkQuery('select count(*) as book_count from book2018 where title like ? or authors like ?');
    
    // GET /api/search?terms=love&limit=10&offset=0
    app.get(`${SEARCH_API_URL}`, (req, resp) => {
        const limit = parseInt(req.query.limit) || 10;
        const offset = parseInt(req.query.offset) || 0;
        const q = `%${req.query.terms}%` || '';

        const p0 = searchBooks([q, q, limit, offset]);
        const p1 = countSearchBooks([q, q]);
        Promise.all([p0, p1])
            .then(results => {
                const r0 = results[0];
                const r1 = results[1];
                resp.status(200).json({
                    // BooksResponse Object
                    data: r0.map(v => {
                        // Removes author names that are duplicated in DB e.g. for "Love and Ruin"
                        v.authors = Array.from(new Set(v.authors.split('|')));
                        // un-comment below to not remove duplicates
                        // v.authors = v.authors.split('|');
                        return v;
                    }),
                    terms: req.query.terms,
                    timestamp: (new Date()).getTime(),
                    total: r1[0].book_count,
                    limit: limit,
                    offset: offset
                })
            })
            .catch(error => {
                resp.status(500).json({message: error});
            });
    });

}