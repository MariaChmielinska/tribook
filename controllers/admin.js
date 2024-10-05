// importar el modelo
const Apartment = require('../models/apartment.model.js');


const getNewApartmentForm = (req, res) => {
    res.render('new-apartment', {
        apartment: {}
    })
}

const getEditAparmentForm = async (req, res) => {
    // 1. Recuperar el apartmento identificado por su idApartment de la base de datos
    const { idApartment } = req.params;

    // 2. Ir a la base de datos y obtener el apartamento dada su id
    const apartment = await Apartment.findById(idApartment);

    // 3. Pasar este apartmento a la vista para pre rellenar todos los campos
    res.render('new-apartment', {
        apartment
    })
}

const postNewApartment = async (req, res) => {

    // Me han metido más servicios en el req.services que los servicios que yo quiero? kitchen, wifi, etc. res.status(400).send('Ha ocurrido un error');

    // ¿Cómo detecto si estoy añadiendo un apartamento o editando un apartamento? Si lo estoy editando, ya tengo id
    const { id } = req.body;

    if (id) {
        // TODO: Completar
        // 1. Utlizar el método más adecuado para buscar un documento dado su id y actualizar sus campos a partir del req.body
        await Apartment.findByIdAndUpdate(id, req.body);

        req.flash('success_msg', `Datos del apartamento acutalizados.`);

        // req.get('referer') -> devuelve la ruta en la que ya estabas
        return res.redirect(req.get('referer'));
    }

    await Apartment.create({
        title: req.body.title,
        description: req.body.description,
        rules: req.body.rules,
        rooms: req.body.rooms,
        beds: req.body.beds,
        bathroom: req.body.bathroom,
        price: req.body.price,
        size: req.body.size,
        mainPhoto: req.body.mainPhoto,
        mainPhotoTitle: req.body.mainPhotoTitle,
        photo2: req.body.photo2 || '',
        photo2Title: req.body.photo2Title || '',
        photo3: req.body.photo3 || '',
        photo3Title: req.body.photo3Title || '',
        photo4: req.body.photo4 || '',
        photo4Title: req.body.photo4Title || '',
        services: {
            air: req.body.air === 'selected',
            heating: req.body.heating === 'selected',
            kitchen: req.body.kitchen === 'selected',
            accessible: req.body.accessible === 'selected',
            tv: req.body.tv === 'selected',
            wifi: req.body.wifi === 'selected'
        },
        capacity: req.body.capacity,
        province: req.body.province,
        city: req.body.city,
        gpsLat: req.body.gpsLat,
        gpsLng: req.body.gpsLng,
        isDisabled: req.body.isDisabled === 'true',
    });
    

    req.flash('success_msg', `Apartamento  ${req.body.title} creado correctamente`);
    res.redirect('/');
}

// named exports (expotamos varios recursos, lo hacemos como un objeto)
module.exports = {
    getNewApartmentForm,
    postNewApartment,
    getEditAparmentForm
}

