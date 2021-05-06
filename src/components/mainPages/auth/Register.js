import React,{useState} from 'react'
import {Link} from 'react-router-dom'
import axios from 'axios'

function Register() {
    const [user , setUser] = useState({
       name:'', email:'' , password:''
    })
    const onChangeInput = e => {
        const {name , vlaue} = e.target;
        setUser({...user , [name]:vlaue})
    }
    
    const registerSubmit = async  e =>{
        e.preventDefault();

        try {
          await axios.post('/user/register' , {...user})

          localStorage.setItem('firstLogin' , true)

            window.location.href= "/";
        } catch (err) {
            alert(err.response.data.message)
        }
    }
    return (
        <div className="login-page">
           <form onSubmit={registerSubmit}>
           <h2>Register page</h2>
           <input type="text" name="name" required 
               placeholder="Enter your name!" value={user.name}  onChange={onChangeInput} />

               <input type="email" name="email" required 
               placeholder="Enter your email!" value={user.email}  onChange={onChangeInput} />
              
                 <input type="password" name="password" required autoComplete="on"
               placeholder="Enter your password!" value={user.password} onChange={onChangeInput}  />

               <div className="row">
                   <button type="submit">Register</button>
                   <Link to="/login">Login</Link>

               </div>
           </form>
        </div>
    )
}

export default Register

