
const ApiUtils = {
    dataResponse: (res, data, httpStatusCode = 200) => {
        res.status(httpStatusCode);
        res.json({
            ok: true,
            data: data
        });
    },
    emptyResponse: (res) => {
        res.status(ApiUtils.HttpStatusCode.NoContent).send({});
    },
    errorResponse: (res, err, data, httpStatusCode = 400) => {
        res.status(httpStatusCode);
        res.json({
            ok: false,
            error: err,
            data: data
        });
    },
    HttpStatusCode: {
        /* 200 */
        OK: 200,
        Created: 201,
        Accepted: 202,
        NoContent: 204,
        /* 400 */
        BadRequest: 400,
        Unauthorized: 401,
        Forbidden: 403,
        NotFound: 404,
        MethodNotAllowed: 405,
        NotAcceptable: 406,
        Timeout: 408,
        Gone: 410,
        Teapot: 418,
        Locked: 423,
        TooManyRequests: 429,
        UnavailableLegal: 451,
        /* 500 */
        ServerError: 500,
        NotImplemented: 501,
    }
};

module.exports = ApiUtils;
