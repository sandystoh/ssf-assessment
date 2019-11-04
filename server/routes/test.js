
module.exports = function(app, API_URL) {
    const FILMS_API_URL = `${API_URL}/films`;
    const mkQuery = require('../db/dbutil');

    const getFilms = mkQuery('select * from film limit ? offset ?');
    const countFilms = mkQuery('select count(*) as film_count from film where title like ? or description like ?');
    const searchFilms = mkQuery('select * from film where title like ? or description like ? limit ? offset ?');
    const getFilmsById = mkQuery('select * from film where film_id = ?');

  // GET /api/films?limit=10&offset=20
    app.get(FILMS_API_URL, (req, resp) => {
        const offset = parseInt(req.query.offset) || 0;
        const limit = parseInt(req.query.limit) || 20;

        getFilms([limit, offset])
            .then(result=> {
                result.map(v => {
                    v.comment = `api/film/${v.film_id}`;
                    return v;
                });
                const reply = {films: result, num_results: 1000};

                resp.status(200).json(reply);
            })
            .catch(error=> { 
                resp.status(500).json({error: error});
            })
    });

    // GET /api/films/search?q=boy&limit=10&offset=20
    app.get(`${FILMS_API_URL}/search`, (req, resp) => {
        const offset = parseInt(req.query.offset) || 0;
        const limit = parseInt(req.query.limit) || 20;
        const q = `%${req.query.q}%` || '';

        const p0 = searchFilms([q, q, limit, offset]);
        const p1 = countFilms([q, q]);
        Promise.all([p0, p1])
            .then(results => {
                const r0 = results[0];
                const r1 = results[1];
                resp.status(200).json({
                    films: r0.map(v => {
                        v.comment = `api/film/${v.film_id}`;
                        return v;
                    }),
                    num_results: r1[0].film_count
                })
            })
            .catch(error => {
                resp.status(500).json({error: error});
            });
    });

    // GET /api/films/:fid
    app.get(`${FILMS_API_URL}/:fid`,
        (req, resp) => {
            const fid = parseInt(req.params.fid);
            
            getFilmsById([ fid ])
                .then(result => {
                    resp.status(200).json(result);
                })
                .catch(error => {
                    resp.status(500).json({ message: JSON.stringify(error) });
                })
        }
    );


}
