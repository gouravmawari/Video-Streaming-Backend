const { registerUserService, loginUserService, subUserRegistration} = require('./auth.service');

const register = async (req, res) => {
  try {
    const response = await registerUserService(req.body);
    res.status(response.status).json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const subUser=async(req,res)=>{
  const{parentUserId,subUserName} = req.body;
  try{
    if(!parentUserId && !subUserName){
      return res.status(400).json("parentUserId and subUserName are not provided");
    }
    const SubUserReg = await subUserRegistration(req.body);
    res.status(SubUserReg.status).json(SubUserReg.data);
  }
  catch(err){
    res.status(500).json({error:err.message});
  }
}

const login = async (req, res) => {
  try {
    const response = await loginUserService(req.body);
    res.status(response.status).json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { register, login , subUser };
