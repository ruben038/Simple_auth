
const  token= (sequelize,DataTypes)=>{
    const Token = sequelize.define ("token",{
        id:{
            type:DataTypes.INTEGER,
            allowNull:false,
            primaryKey:true,
            autoIncrement:true
        },
        userId:{
            type:DataTypes.INTEGER,
            allowNull:false,
            onUpdate:"cascade",
            onDelete:"cascade",
            references:{model:"users",key:"id"}
        },
        token:{
            type:DataTypes.STRING
        },
    },{timestamps:true})
    return Token
}

export default token