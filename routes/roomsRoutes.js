var express = require('express');
var router = express.Router();
var auth = require("../models/authentication")
var rModel = require("../models/roomsModel");
            
router.get('/', async function(req, res, next) {
    let result = await rModel.getAllRooms();
    res.status(result.status).send(result.result);
});

router.post('/create_room',auth.checkAuthentication, async function( req, res) {
    console.log("Create a room") 
    let result = await rModel.create_room(req.userId);
    res.status(result.status).send(result.result);
}) 

router.post('/join_room',auth.checkAuthentication, async function( req, res) {
    console.log("Join a room") 
    let room_num = req.body.room_num;
    let result = await rModel.join_room(req.userId,room_num);
    res.status(result.status).send(result.result);
})

router.post('/check_room_full',auth.checkAuthentication, async function( req, res) {
    console.log("see if a room is full") 
    let result = await rModel.check_room_full(req.userId);
    res.status(result.status).send(result.result);
}) 

module.exports = router;