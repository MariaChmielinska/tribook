/** Crear un conjunto de funciones que van a dar respuesta a nuestras rutas  */
const mongoose = require('mongoose');

// Importamos el modelo
const Apartment = require('../models/apartment.model.js');
const Reservation = require('../models/reservation.model.js');

const getApartments = async (req, res) => {

    // Obtenemos todos los apartamentos de la base de datos
    const apartments = await Apartment.find().sort({ _id: -1 });
    console.log(res.locals.success_msg)

    res.render('home', {
        apartments,

    });
}

const getApartmentById = async (req, res) => {
    // 1. Voy al modelo para obtener el apartamento dado su id
    const { idApartment } = req.params;

    const selectedApartment = await Apartment.findById(idApartment);

    res.render('detail-apartment', {
        selectedApartment
    });
};

const searchApartments = async (req, res) => {
    console.log("MARIA REQUEST: ", req.query);

    // Parsear la query string que recibo del formulario
    const { maxPrice, capacity, city, checkInDate, checkOutDate} = req.query;

   /* Diccionario para criterios de ordenación
    const orderDict = {
        "default": { _id: -1 },
        "minPrice": { price: 1 }
    };

    const sortCriteria = orderDict[orderBy] || orderDict["default"]; */

    // Construir el objeto de búsqueda para los apartamentos
    const query = {};

    if (maxPrice) {
        query.price = { $lte: maxPrice };
    }

    if (capacity) {
        query.capacity = { $gte: capacity };
    }

    if (city) {
        query.city = new RegExp(city, 'i');
    }

    if (checkInDate && checkOutDate) {
        const start = new Date(checkInDate);
        const end = new Date(checkOutDate);

        // Find all apartment IDs with overlapping reservations
        const overlappingReservations = await Reservation.find({
            $or: [
                { startDate: { $lte: end, $gte: start } },
                { endDate: { $gte: start, $lte: end } },
                { startDate: { $lte: start }, endDate: { $gte: end } }
            ]
        }).select('apartment'); // Only return the apartment field

        // Extract the apartment IDs that are reserved
        const reservedApartmentIds = overlappingReservations.map(reservation => reservation.apartment);

        // Add a condition to exclude apartments that are reserved during the selected dates
        query._id = { $nin: reservedApartmentIds };
    }

    console.log("🚀 ~ file: index.js:43 ~ searchApartments ~ query:", query);

    // Obtener del modelo todos los apartamentos filtrados
   const apartments = await Apartment.find(query);
    console.log("MARIA FILTERED apartments: ", apartments);
    // Renderizar los apartamentos filtrados en la vista
    res.render('home', {
        apartments
    });
};



const postNewReservation = async (req, res) => {
    // 1. Es una petición tipo POST-> desestructurar el req.body y obtener todos los datos de la reserva
    const { email, startDate, endDate, idApartment } = req.body;

    const start = new Date(startDate);
    const end = new Date(endDate);
    // 2A. DAdo el id del apartmento,  recuperar el Apartment de la colección. Luego crear la reserva Reservation.create() pasandole el apartamento que acabamos de recuperar
    const apartment = await Apartment.findById(idApartment);

    const overlappingReservations = await Reservation.find({
        apartment: idApartment,
        $or: [
            { startDate: { $lte: end, $gte: start } },
            { endDate: { $gte: start, $lte: end } },
            { startDate: { $lte: start }, endDate: { $gte: end } }
        ]
    });

    if (overlappingReservations.length > 0) {
        return res.status(400).json({ message: 'Apartment is already reserved for the selected dates.' });
    }

    const newReservation = await Reservation.create({
        email,
        startDate,
        endDate,
        apartment: apartment._id
    });

  
    // 2B. Crear directamente la reserva con Reservation.create() y establecer el campo apartment, que de tipo ObjectID, con el identificador del apartamento recuperado del formulario
    // const newReservation = await Reservation.create({
    //     email,
    //     startDate,
    //     endDate,
    //     apartment: new mongoose.Types.ObjectId(idApartment)
    // });
    // 3. Podemos contestar con algun tipo mensaje al usuario sobre la reservada creada
    res.json(newReservation);
};

module.exports = {
    getApartments,
    getApartmentById,
    searchApartments,
    postNewReservation
}