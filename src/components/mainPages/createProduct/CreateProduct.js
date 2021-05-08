import React,{useState , useContext, useEffect} from 'react'
import axios from 'axios'
import {GlobalState} from '../../../GlobalState'
import Loading from '../utils/loading/Loading'
import {useHistory, useParams} from 'react-router-dom'
import './createProduct.css';

const initialState ={
    title: '',
    price:'0',
    description:'this Restaurant is very atractive most for jappaness how live in Germany',
    content: 'this app make by  BAKWAH community this community is start in 2021 in feb in kabul Afghanistan :)',
    category: '',
}

function CreateProduct() {
    const state = useContext(GlobalState)
    const [product , setProduct] = useState(initialState)
    const [categories] = state.categoriesAPI.categories
    const [images, setImages] = useState(true)
    const [loading , setLoading] = useState(false)

    const [isAdmin] = state.authAPI.isAdmin
    const [token] = state.authAPI.token

    const history = useHistory()
    const param = useParams()

    const [products] = state.productsAPI.products
    const [onEdit , setOnEdit] = useState(false)
    const [callback, setCallback] = state.productsAPI.callback
    useEffect(()=>{
        if(param.id){
            setOnEdit(true)
            products.forEach(product => {
                if(product.id === param.id) 
                setProduct(product)
                setImages(product.images)
            })
        }else{
            setOnEdit(false)
            setProduct(initialState)
            setImages(false)
        }
    }, [param.id, products])
    const handleUpload = async e =>{
        e.preventDefault()
        try {
            if(!isAdmin) return alert('You are not an admin')
            const file = e.target.files[0]

            if(!file) return alert("file not Exist.")

            if(file.size > 1024 *1024 )
            return alert( "Size too large!")

            if(file.type !== 'image/jpeg' && file.type !== 'image/png')
            return alert( "file format is incorrect")

            let formData = new FormData();
            formData.append('file' , file)

            setLoading(true)
            const res = await axios.post('/api/upload' , formData, {
                headers:{'content-type': 'multipart/form-data', Authorization :token}
            })

            setLoading(false)
            setImages(res.data)

        } catch (err) {
            alert(err.response.date.msg)
        }
    }
    const handleDestroy = async ()=>{
        try {
            if(!isAdmin) return alert("You're not an admin!")
            setLoading(true)
            await axios.post('/api/destroy' , {public_id :images.public.id} , {
                headers:{Authorization: token}
            })
            setLoading(false)
            setImages(false)
        } catch (err) {
            alert(err.response.data.message)
        }
    }

    const handleChangeInput = e => {
        const {name , value} = e.target
        setProduct({...product, [name]:value})
    }

    const styleUpload ={
        dislay:images ? "block" : "none"
    }

    const handleSubmit = async e => {
        e.preventDefault()
        try {
            if(!isAdmin) return alert("You're not an admin!")
            if(!images) return alert("No images please upload the images!")

            if(onEdit){

                await axios.put(`/api/produtcs/${product.id}`  , {...product , images},{
                    headers :{Authorization: token}
                })
            }else{
                await axios.post('/api/produtcs' , {...product , images},{
                    headers :{Authorization: token}
                })
            }

            setCallback(!callback)
            history.push("/")
             
            
        } catch (err) {
            alert(err.response.data.message)
        }
    }

    return (
        <div className="create_product">
            <div className="upload">
                <input type="file" name="file" id="file_up" onChange={handleUpload}/>
                {
                    loading ?   <div id="file_img"><Loading/></div>
                    :<div id="file_img" style={styleUpload}>
                        <img src={images ? images.url : ''} alt=""/>
                        <span onClick={handleDestroy}>X</span>
                     </div>
               }
            </div>

            <form onSubmit={handleSubmit}>
                <div className="row">
                    <label htmlFor="product.id">Product ID</label>
                    <input type="text" name="product.id" id="product.id"
                     required value={product.id} onChange={handleChangeInput}
                     disabled={product.id} />
                </div>

                <div className="row">
                    <label htmlFor="title">Product Title</label>
                    <input type="text" name="title" id="title"
                     required value={product.title} onChange={handleChangeInput} />
                </div>

                <div className="row">
                    <label htmlFor="price">Price</label>
                    <input type="number" name="price" id="price" 
                    required value={product.price} onChange={handleChangeInput} />
                </div>

                <div className="row">
                    <label htmlFor="description">Description</label>
                    <textarea type="text" name="description" id="description"
                     required value={product.description} rows="5" onChange={handleChangeInput} />
                </div>

                
                <div className="row">
                    <label htmlFor="content">Content</label>
                    <textarea type="text" name="content" id="content" 
                    required value={product.content} rows="7" onChange={handleChangeInput} />
                </div>

                
                <div className="row">
                    <label htmlFor="categories">Categories:</label>
                    <select name="category" value={product.category} onChange={handleChangeInput} >
                            <option value="">Please select a category</option>
                        {
                            categories.map(category =>(
                                <option value={category.id} key={category.id}>
                                    {category.name}
                                </option>
                            )) 
                        }
                    </select>
                </div>

                <button type="submit">{onEdit ? "Update" : "Create"}</button>
            </form>
        </div>
    )
}

export default CreateProduct
