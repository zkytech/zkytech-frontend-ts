import React from 'react'
import style from './style.module.less'

const Loading:React.FC =():JSX.Element=>{
    return (
        <div className={style.loading} >
            <div className={style.loading_pic}>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
            </div>
        </div>
    )
}

export default Loading