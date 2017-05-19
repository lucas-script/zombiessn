// criação do usuario inicial
var user = {
    name: "Lucas Costa",
    birthday: new Date(),
    gender: "Male",
    lastLocation: {
        lng: 10,
        lat: 20
    },
    inventory: [],
    infected: false,
    inctive: false,
    createdOn: new Date(),
    modifiedOn: new Date(),
    lastLogin: new Date()
}

var items = [
    { name: 'Water ', points: 4, inactive: false, createdOn: new Date('2016-12-27'), modifiedOn: new Date('2016-12-27') },
    { name: 'Food', points: 3, inactive: false, createdOn: new Date('2016-12-27'), modifiedOn: new Date('2016-12-27') },
    { name: 'Medication', points: 2, inactive: false, createdOn: new Date('2016-12-27'), modifiedOn: new Date('2016-12-27') },
    { name: 'Ammunition', points: 1, inactive: false, createdOn: new Date('2016-12-27'), modifiedOn: new Date('2016-12-27') }
]

db.items.save(items);