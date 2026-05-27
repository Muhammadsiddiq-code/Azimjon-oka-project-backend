module.exports = (sequelize, DataTypes) => {
    const Group = sequelize.define("Group", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        speciality: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    })

    return Group
}