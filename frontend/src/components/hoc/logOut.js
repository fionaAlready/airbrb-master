import React,{ useState } from "react";
import { Button } from 'antd'
import { useNavigate } from 'react-router-dom'
import axios from "axios";


const Logout = () => {
    const navigate = useNavigate()
    const token = localStorage.getItem('token')
    const [showElem] = useState(token == null ? false : true)

   const handleClick = () => {
      if(showElem){
        logout()
      }

      if(!showElem){
         toLoginPage()
      }
   }


  const toLoginPage = ()=>{
    navigate('/login')
  }


   const logout = async () => {
    // 清空token
    await axios.post('http://localhost:5005/user/auth/logout', {}, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    })
    localStorage.removeItem('token');
    navigate('/',{replace:true})
    window.location.reload()
  }



    return (
        <React.Fragment>
            <Button type={!showElem ? 'primary' : 'default'} danger={!showElem} onClick={handleClick}>
                {
                    !showElem ? 'Login' : 'Logout'
                }
            </Button>
        </React.Fragment>
    )
}

export default Logout