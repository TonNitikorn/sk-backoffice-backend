module.exports = (sequelize, DataTypes) => {
    const log_actions = sequelize.define("log_actions", {
        uuid: DataTypes.STRING(255),
        prefix: DataTypes.STRING(255),
        admins_uuid: DataTypes.STRING(255),
        actions: DataTypes.STRING(255),
        description: DataTypes.JSON,
        create_at: DataTypes.DATE,
      },
      {
        tableName: "log_actions",
        timestamps: false,
      },
  
    );
  
    log_actions.associate = (models) => {
      // associations can be defined here
    };
  

    
    return log_actions;
  
  };