exports.cors = (req, res, next) => {
	if (req.headers.origin) {
		res.setHeader("Access-Control-Allow-Origin", req.headers.origin)
	}

	res.setHeader(
		"Access-Control-Allow-Methods",
		"GET, POST, PUT, DELETE",
		"OPTIONS"
	)
	res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")
	res.setHeader("Access-Control-Allow-Credentials", true)
	res.setHeader("Vary", "Origin")
	return next()
}
