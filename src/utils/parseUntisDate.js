module.exports = dateString => {
	return new Date(dateString.toString().replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3 00:00:00'));
};
