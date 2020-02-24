from flask import Flask, Response, request
import requests
import os

app = Flask(__name__)

@app.route('/search', methods=['GET'])
def search():
	if not ('lat' in request.args and 'lon' in request.args):
		return "Please provide location", 400
	try:
		lat = float(request.args['lat'])
		lon = float(request.args['lon'])
	except ValueError:
		return "Invalid lat/lon", 400

	response = requests.get(
		'https://api.yelp.com/v3/businesses/search',
		params = {
			'term': '"Chili\'s"',
			'latitude': str(lat),
			'longitude': str(lon)
		},
		headers = {
			'Authorization':'Bearer {}'.format(os.environ['YELP_TOKEN'])
		}
	)
	return Response(response.text, mimetype="application/json")