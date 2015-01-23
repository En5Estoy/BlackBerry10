define([], function() {
	return {
		get_saldo : 'http://54.243.218.97:3000/wrapget',
		send_saldo : 'http://54.243.218.97:3000/wrappost',
		captcha_saldo : 'http://54.243.218.97:3000/wrapimg/',

		streets : 'http://en5estoy.com/api/v1/streets',

		news : 'http://en5estoy.com/api/v1/news',

		stops : 'http://en5estoy.com/api/v1/bus_stops/',
		geocode : 'http://maps.googleapis.com/maps/api/geocode/json?sensor=true&address=',

		lines : 'http://en5estoy.com/api/v1/bus/lines',

		taxi : 'http://54.243.218.97:3000/api/taxi'
	};
});