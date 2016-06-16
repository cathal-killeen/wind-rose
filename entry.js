module.exports = function(sequelize, DataTypes){
    return sequelize.define('entry', {
        timestamp: {
            type: DataTypes.STRING,
            allowNull: false
        },
        speed: {
            type: DataTypes.DOUBLE,
            allowNull: true
        },
        direction: {
            type: DataTypes.STRING,
            allowNull: true
        }
    });
}
