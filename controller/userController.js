const model = require('../model/index');
const { Op } = require('sequelize');
const controller = {};

controller.getAll = async function (req, res) {
    try {
        const userData = await model.user.findAll();
        if (userData.length > 0) {
            res.status(200).json({ message: "Connection successfully ", data: userData });
        }else {
            res.status(200).json({ message: "Connection failed ", data: []})
        }
    } catch(error) {
        res.status(404).json({ message: error })
    }
}

controller.getUsername = async function (req, res) {
    try {
        var userData = await model.user.findAll({
        where: { username: { [Op.like]: `%${req.params.username}%` } },
        });
        if (userData.length > 0) {
            res
            .status(200)
            .json({ message: "Connection successful", data: userData });
        } else {
        res.status(200).json({ message: "Connection failed", data: [] });
        }
    } catch (error) {
        res.status(404).json({ message: error });
    }
};

controller.createNew = async function (req, res) {
    try {
        //   check data has already been created
        const checkData = await model.user.findAll({
        where: {
            [Op.or]: {
                username: req.body.username,
                password: req.body.password,
                },
            },
        });
    if (checkData.length > 0) {
        res.status(500).json({ message: "username/password has already in use" });
    } else {
        await model.user
            .create({
            username: req.body.username,
            password: req.body.password,
            token: req.body.username + req.body.password,
        })
        .then((result) => {
            res.status(201).json({
            message: "user successful created",data: {
            username: req.body.username,
            password: req.body.password,
            token: req.body.username + req.body.password,
                },
            });
        });
    }
    } catch (error) {
        res.status(404).json({ message: error });
    }
};

controller.editAt = async function (req, res) {
    try {
        await model.user
            .findAll({ where: { id: req.body.id } })
            .then(async (result) => {
                if (result.length > 0) {
                    await model.user.update(
                       {
                           username: req.body.username,
                           password: req.body.password,
                           token: req.body.username + req.body.password,
                        },
                        { where: { id: req.body.id } }
                    );
                    res.status(200).json({
                        message: "update successful",
                        data: {
                        id: req.body.id,
                        username: req.body.username,
                        password: req.body.password,
                        token: req.body.username + req.body.password,
                        },
                    });
                } else {
                    res.status(500).json({ message: "update failed" });
                }
            });
    } catch (error) {
        res.status(404).json({ message: error });
    }
};

controller.deleteUser = async function (req, res) {
    try {
        await model.user
            .findAll({ where: { id: req.body.id } })
            .then(async (result) => {
        if (result.length > 0) {
            await model.user.destroy({ where: { id: req.body.id } });
            res.status(200).json({ message: "delete user successfully" });
        } else {
            res.status(404).json({ message: "id user not found" });
            }
        });
    } catch (error) {
        res.status(404).json({ message: error });
    }
};

module.exports = controller;