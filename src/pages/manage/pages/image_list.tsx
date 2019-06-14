import React, { useState} from 'react';
import {getImageList,deleteImage} from "../../../api/image"
import {message, Icon, Popconfirm} from "antd"
import style from '../../../components/style.module.less'
import CopyToClipboard from 'react-copy-to-clipboard'
import QueueAnim from "rc-queue-anim"


interface ImageListProps {

}

const ImageList:React.FC<ImageListProps> = () => {
    const [imageList,setImageList] = useState<EntityImage[]>([])


    if (imageList.length === 0){
        getImageList().then(res=>{
            if(res.success){
                setImageList(res.data)
            }else{
                message.error(res.message)
            }
        })
    }

    const deleteImg=(id:number) => {
        deleteImage(id).then(res=>{
            if(res.success){
                message.success(res.message)
                setImageList(imageList.filter(v=>v.id!==id))
            }
        })
    }


    return (
    <div>
        <QueueAnim
            type={['right', 'left']}
            duration={700}
            interval={100}
        >
            {
                imageList.map((v,i)=>{
                    return <div className={style.img_box} key={i}>
                        <CopyToClipboard
                            text = {v.imgUrl}
                            onCopy = {()=>message.info("图片URI已复制到剪贴板")}
                        >
                            <img src={v.imgUrl} alt={v.description} />
                        </CopyToClipboard>
                        <div>{v.createdDate}</div>
                        <Popconfirm placement="bottomRight" title={"确定删除吗？\n删除后将无法恢复"} onConfirm={()=>deleteImg(v.id)} okText="删除" cancelText="取消">
                            <Icon className={style.delete_image_icon} type={'delete'}/>
                        </Popconfirm>
                    </div>
                })
            }
        </QueueAnim>
    </div>
    )
}

export default ImageList;