const bcrypt = require("bcrypt");


module.exports = (sequelize, DataTypes) => {
    const Admin = sequelize.define("Admin", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },

    })

    Admin.beforeSave(async (admin, options) => {
        if (admin.changed("password")) {
            admin.password = await bcrypt.hash(admin.password, 10);
        }
    });

    return Admin;
}