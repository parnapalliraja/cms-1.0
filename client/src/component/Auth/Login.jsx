import React,{useState} from 'react'
import { toast } from 'react-toastify';
import axios from 'axios'
import {useNavigate}  from 'react-router-dom'
import { omit } from "lodash"



function Login() {
  const [user, setUser] = useState({
    
    email: "",
    password: ""
})

const [errors, setErrors] = useState({})

    const navigate = useNavigate()

    //error logic
    const errPrint = (prop ,msg) => {
        setErrors({...errors, [prop] :msg})
    }

    const validate = (event,name,value)=>{
        switch(name) {
            
            case "email" :
                if(value.length === 0){
                    errPrint(name , "Email field must be filled")
                }else if (!new RegExp (/^[-a-z A-Z 0-9 \S]+@[a-z \s]+\.[c][o][m]+$/).test(value)){
                    errPrint(name , "Invalid email format")
                }else{
                    let newObj = omit (errors , name)
                    setErrors(newObj)
                }
                break;
                
                case "password" : 
                if(value.length === 0){
                    errPrint(name , "password field must be filled")
                }else if(value.length<8 || value.length>20){
                    errPrint(name , "password should have greaterthan 8 char and lessthan 20 char")
                }else{
                    let newObj = omit(errors , name);
                    setErrors(newObj)
                } break;

                default: break;
            }
    }

const readValue = (e)=>{
    const { name, value} = e.target;
    validate(e,name,value)
    //console.log(errors)
    setUser({...user, [name] :value})
}

const submitHandler = async (e)=>{
    e.preventDefault();
    try{

        console.log("user = ",user)
        await axios.post(`/api/v1/auth/login`, user)
        .then(res => {
            //console.log('after register = ', res.data);
            localStorage.setItem("loginToken", res.data.accessToken)
            toast.success(res.data.msg);
           // navigate('/')
            window.location.href = "/"
        }).catch(err => toast.error(err.data.response.msg))
    } catch(err){
        toast.error(err.message)
    }
}

return (
<div className="container">
    <div className="row">
        <div className='col-md-12'>
            <h2 className='display-3 text-center'>Login</h2>
        </div>

        <div className="row">
            <div className="col-md-6 offset-md-3">
                <div className="card">
                    <div className="card-body">
                        <form autoComplete='off' onSubmit={submitHandler} >
                            

                            <div className="form-group mt-2">
                                <label htmlFor='email'>Email</label>
                                <input type='text' name='email' id='email' value={user.email} onChange={readValue} className='form-control' required />
                                {
                                        errors && errors.email  ? (
                                            <div className="alert alert-danger" style={{padding:"8px"}}> {errors.email}</div>
                                        ) : null
                                    }
                            </div>

                            <div className="form-group mt-2">
                                <label htmlFor='password'>Password</label>
                                <input type='text' name='password' id='password' value={user.password} onChange={readValue} className='form-control' required />
                                {
                                        errors && errors.password  ? (
                                            <div className="alert alert-danger" style={{padding:"8px"}}> {errors.password}</div>
                                        ) : null
                                    }
                            </div>

                            

                            <div className='form-group mt-2'>
                                <input type='submit' value='submit' className='btn btn-outline-success' />
                            </div>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    </div>
</div>
)
}

export default Login