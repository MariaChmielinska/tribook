// Your code here ...
const { Schema, model } = require('mongoose');


const apartmentSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    rules: {
        type: String,
        required: true
    },
    rooms: {
        type: Number,
        required: true
    },
    beds: {
        type: Number,
        required: true
    },
    bathroom: {
        type: Number,
        required: true
    },

    price: {
        type: Number,
        required: true
    },
    size: {
        type: Number,
        required: true,
        min: 0
    },
    mainPhoto: {
        type: String,
        required: true,
    },
    photo2: {
        type: String,
    },
    photo3: {
        type: String,
    },
    photo4: {
        type: String,
    },
    mainPhotoTitle: {
        type: String,
        required: true,
    },
    photo2Title: {
        type: String,
    },
    photo3Title: {
        type: String,
    },
    photo4Title: {
        type: String,
    },
    city: {
    type: String,
    },
    province: {
    type: String,
    },
    gpsLat: {
    type: String,
    }, 

    gpsLng: {
        type: String,
    }, 

    capacity: {
        type: Number
    },

    services: {
        // array de strings 
        // ["wifi", "air aconditionar"]
        // objeto con los servicios { wifi: true, airConditioner: false}
       
        air: { type: Boolean, default: false },
        heating: { type: Boolean, default: false },
        kitchen: { type: Boolean, default: false },
        accessible: { type: Boolean, default: false },
        tv: { type: Boolean, default: false },
        wifi: { type: Boolean, default: false },

    },
    isDisabled: {
        type: Boolean,
        default: false 
    },
    // services: {
    //     type: [String], // enum
    //     validate: {
    //         validator: function (v) {
    //             return "Devuelve false si el valor 'v' a insertar no es Wifi o Kitchem o Air conditionating bla bla"
    //         },
    //         message: props => `${props.value} is not a valid service!`
    //     },
    // }

});

const Apartment = model('Apartment', apartmentSchema);

// Exporta un único recurso
module.exports = Apartment;