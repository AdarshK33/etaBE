
const isLogin= async(req,res,next)=>{
try{
if(req.session.user_id){

}else{
    res.redirect('/')
}
next();
}catch(error){
console.log(error)
}
}


const isLogOut= async(req,res,next)=>{
    try{
        
        if(req.session.user_id){
            res.redirect('/')
        }
        next();
    }catch(error){
    console.log(error)
    }
    }

module.exports={
        isLogin,
        isLogOut
    }