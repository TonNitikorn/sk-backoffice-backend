module.exports = (sequelize, DataTypes) => {
  const web_setting = sequelize.define("web_setting", {
    uuid: DataTypes.STRING(255),
    prefix: DataTypes.STRING(255),
    type: DataTypes.JSON,
    img_url: DataTypes.JSON,
    logo: DataTypes.JSON,
    banner: DataTypes.JSON,
    slide: DataTypes.JSON,
    update_at: DataTypes.DATE,
    create_at: DataTypes.DATE,
  },
    {
      tableName: "web_setting",
      timestamps: false,
    },

  );

  web_setting.associate = (models) => {
    // associations can be defined here
  };



  return web_setting;

};