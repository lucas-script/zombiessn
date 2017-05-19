// (post) /users
body = {
    "name": "Ranger Black",
    "birthday": "1991-03-20 03:00:00.000Z",
    "gender": "Male",
    "lastLocation": {
        "lng": 18.90,
        "lat": -20.90
    },
    "inventory": [
        { 
            "item": "5863161d678db09a310ef672",
            "amount": 10
        },
        {
            "item": "5863161d678db09a310ef673",
            "amount": 20
        }
    ]
}

// (post) /traderequests
body = {
	"responder": "587695a2ffb60c206419442f",
	"requesterItems": [
		{
			"item": "5863161d678db09a310ef672",
			"amount": 5
		}
	],
	"responderItems": [
		{
			"item": "5863161d678db09a310ef673",
			"amount": 80
		}
	]
}