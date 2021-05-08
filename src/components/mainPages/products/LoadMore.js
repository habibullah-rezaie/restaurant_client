import React,{useContext} from 'react'
import {GlobalState} from '../../../GlobalState'


function LoadMore() {
    const state = useContext(GlobalState)
    const [page , setPage] = state.productsAPI.page
    const [productCount] = state.productsAPI.count


    return (
        <div className="load_more">
            {
                productCount < page * 9 ? ""
                : <button onClick={()=> setPage(page+1)}>Load more</button>
            }
            
        </div>
    )
}

export default LoadMore
