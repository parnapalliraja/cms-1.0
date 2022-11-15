import React,{useContext,useState} from 'react'
import { useEffect } from 'react'
import { toast } from 'react-toastify'
import { DataContext } from '../../GlobalContext'
import axios from 'axios'

const Loading = ()=> {
  return <div className='spinner-border text-success' role={'status'}>
          <span className='visually-hidden'>Loading...</span>
  </div>
}

function StudentProfile() {

const context = useContext(DataContext)
const token = context.token
const [currentUser] = context.data.authApi.currentUser

const [img, setImg] = useState(false)
const [loading, setLoading] = useState(false)

const [user, setUser] = useState({
  name: "",
  email: "",
  mobile: ""
})
const [isEdit, setIsEdit] = useState(false)

const readValue = (e) =>{
  const {name, value} = e.target;
  setUser({...user, [name]: value})
}

const toggleEdit = ()=>{
  setIsEdit((prevState)=> !prevState)
}

useEffect(()=>{
  setImg(currentUser.image)
  setUser(currentUser)
},[img,currentUser])

const updateHandler = async (e)=>{
  e.preventDefault()
  try {
    const updateUser = {
      name: user.name,
      email: user.email,
      mobile: user.mobile
    }
    console.log("update user", updateUser)

    //update db file
    await axios.patch(`/api/v1/user/update`, updateUser,{
      headers: {
        Authorization: token
      }
    })
    toast.success("Profile data updated successfully")
    window.location.href = "/student/profile"

  } catch (err) {
    toast.error(err.data.response.msg)
  }
}
const handleUpload = async (e)=>{
  e.preventDefault();
  try {
    const file = e.target.files[0];
    //console.log('img data = ', file)
    //file validation
    if(!file)
      return toast.error('file not exist.. choose image to upload')
    //size validation
      if(file.size > 1 * 1024 * 1024)
      return toast.warning('file size must below 1Mb')
//append in form constructor
    let formData = new FormData()
    formData.append('profileImg', file)
    setLoading(true)

//post image to the server
    const res = await axios.post(`/api/v1/image/profileImage/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: token
      }
    })
    
    //update db file
    await axios.patch(`/api/v1/user/update`, { image: res.data},{
      headers: {
        Authorization: token
      }
    })
    toast.success("Profile image updated successfully")

    //after upload
    setLoading(false)
    setImg(res.data)
    window.location.href = "/student/profile"
      
  } catch (err) {
    toast.error(err.data.response.msg)
  }
}

const handleDestroy = async (e) => {
  try {
    if(window.confirm(`Are you to delete Profile Image?`)){
      setLoading(true)
      await axios.post(`/api/v1/image/profileImage/delete`,{ public_id: img.public_id },{
        headers: {
          Authorization: token
        }
      })
//update db file
      await axios.patch(`/api/v1/user/update`, { image: { url: "https://www.ncenet.com/wp-content/uploads/2020/04/No-image-found.jpg"}},
      {
        headers: {
          Authorization: token
        }
      })
      toast.success("Profile image deleted successfully")

      setImg(false)
      setLoading(false)
      window.location.href = "/student/profile"
    }
  } catch (err) {
    toast.error(err.response.data.msg)
  }
}
const submitHandler = async (e)=>{

}
    
  return (
    <div className='container'>
      <div className="row">
        <div className="col-md-12">
            <h3 className="display-3 text-center">Student Profile</h3>
        </div>
      </div>

      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <div className="row">
                <div className='col-md-4'>
                    <div className='card border-0'>
                        <div className='position-relative'>
                          {
                            img ? (<button className='position-absolute top-0 start-100 bg-danger border border-light rounded-circle translate-middle pt-0 ps-2 pe-2 text-white' onClick={handleDestroy}>
                              X
                            </button>) : null
                          }
                          {
                            img ? <img src={img ? img.url : ""} alt='No image found' className='card-img' /> :
                            <img src={currentUser.image ? currentUser.image.url : ""} alt='No image found' className='card-img' />
                          }

                          {
                            loading ? <Loading/> : null
                          }
                        </div>
                    
                    <div className='card-footer'>

                        <div className='form-group'>
                          <input type="file" name={"profileImg"} id={"profileImg"} className='form-control' required onChange={handleUpload} />
                        </div>
                      
            
                    </div>
                    </div>
                </div>
                <div className='col-md-8'>
                  {
                    isEdit ? (<div className='card-body'>
                      <div className='d-flex justify-content-between'>
                        <h4 className='card-title text-center text-uppercase text-success'>{currentUser.name}</h4>
                        <button onClick={toggleEdit} className='btn btn-danger'><i className='bi bi-x-circle'></i></button>
                      </div>
                      <hr/>

                      <form autoComplete='off' onSubmit={updateHandler}>
                        <div className='form-control mt-2'>
                          <label htmlFor='name'>Name</label>
                          <input type="text" id='name' name='name' value={user.name} onChange={readValue} className='form-control' required/>
                        </div>
                        <div className='form-control mt-2'>
                          <label htmlFor='email'>Email</label>
                          <input type="email" id='email' name='email'value={user.email} onChange={readValue} className='form-control' required />
                        </div>
                        <div className='form-control mt-2'>
                          <label htmlFor='mobile'>Mobile</label>
                          <input type="number" id='mobile' name='mobile' value={user.mobile} onChange={readValue} className='form-control' required/>
                        </div>
                        <div className='form-control mt-2'>
                          <input type='submit' value='Update' className='btn btn-warning' />
                        </div>
                      </form>
                      
                    </div>) :
                    (<div className='card-body'>

                      <div className='d-flex justify-content-between'>
                        <h4 className='card-title text-center text-uppercase text-success'>{currentUser.name}</h4>
                        <button onClick={toggleEdit} className='btn btn-info'><i className='bi bi-pen'></i></button>
                      </div>
                    <hr/>
                    <p className='card-text'>
                      <strong>Email</strong>
                      <strong className='float-end text-danger'>{currentUser.email}</strong>
                    </p>
                    <hr/>
                    <p className='card-text'>
                      <strong>Mobile</strong>
                      <strong className='float-end text-danger'>{currentUser.mobile}</strong>
                    </p>
                    <hr/>
                    <p className='card-text'>
                      <strong>Role</strong>
                      <strong className='float-end text-danger'>{currentUser.role}</strong>
                    </p>
                  </div>)
                  }
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentProfile
