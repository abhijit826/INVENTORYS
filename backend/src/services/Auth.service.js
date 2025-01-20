const httpStatus = require("http-status")
const { UserModel,ProfileModel } = require("../models")
const ApiError = require("../utils/ApiError")
const { generatoken } = require("../utils/Token.utils")
const axios =  require("axios");
class AuthService{
       static  async RegisterUser(body){

             
                const {email,password,name,token} = body

               

                const response = await axios.post(`https://www.google.com/recaptcha/api/siteverify`,{},{
                    params:{
                    secret:process.env.CAPTCHA_SCREATE_KEY,
                    response:token,
                }
                })

                const data =await response.data;
                

                if(!data.success){
                       

                        throw new ApiError(httpStatus.BAD_REQUEST,"Captcha Is  Not Valid,Refresh it")
                }





                const checkExist = await UserModel.findOne({email})
                if(checkExist){
                    throw new ApiError(httpStatus.BAD_REQUEST,"User  Is Alrady Regisrered")
                    return
                }

            const user =     await UserModel.create({
                    email,password,name
                })

                const tokend = generatoken(user)
                const refresh_token = generatoken(user,'2d')
                await ProfileModel.create({
                            user:user._id,
                            refresh_token
                })  


                return {
                    msg:"User Registered Successfully",
                    token:tokend
                }    

       }
        static  async LoginUser(body){
        const {email,password,name,token} = body

        
                const response = await axios.post(`https://www.google.com/recaptcha/api/siteverify`,{},{
                    params:{
                    secret:process.env.CAPTCHA_SCREATE_KEY,
                    response:token,
                }
                })

                const data =await response.data;
              

                if(!data.success){
                   

                        throw new ApiError(httpStatus.BAD_REQUEST,"Captcha Is Not Valid")
                }
                const checkExist = await UserModel.findOne({email})
                if(!checkExist){
                    throw new ApiError(httpStatus.BAD_REQUEST,"User Is Not Regisrered,Please Register First")
                    return
                }

                if(password !==checkExist.password){
 throw new ApiError(httpStatus.BAD_REQUEST,"Invalid Credentials,please type correct password")
                    return
                }
             
   const tokend = generatoken(checkExist) 
              
                return {
                    msg:"User Login Successflly! Congrats",
                    token:tokend
                }    

       }
         static  async ProfileService(user){ 

                      const checkExist = await UserModel.findById(user).select("name email")
                if(!checkExist){
                    throw new ApiError(httpStatus.BAD_REQUEST,"User Is Not Regisrered,please register first")
                    return
                }


   
              
                return {
                    msg:"Data fetched! Let's Go",
                    user:checkExist
                }    

       }
}

module.exports = AuthService