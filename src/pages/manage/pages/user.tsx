import React, { useState} from 'react';
import {getUserList,changeUserState} from "../../../api/user";
import {message, Avatar, Button, Tag, Pagination} from 'antd'
import {Link} from "react-router-dom";
import style from '../../style.module.less'
import QueueAnim from "rc-queue-anim"

interface MyTableRowProps {
    user:EntityUser
}

const MyTableRow:React.FC<MyTableRowProps> = ({user})=>{
    const [enabled,setEnabled] = useState<boolean>(user.enabled as boolean)
    const {username, id, email, avatar, verified, createdDate} = user
    const changeState = ()=>changeUserState(id as number,!enabled).then(res=>{
        if (res.success){
            message.info(res.message)
            setEnabled(!enabled)
        } else{
            message.error(res.message)
        }
    })

    return <div className={style.user_table_tr}>
        <div><Link to={`/userDetail/${id}`}><Avatar src={avatar} size={"small"}/> {username}</Link></div>
        <div>{email}
            {verified?
                <Tag style={{marginLeft:'10px',display:'inline-block',width:'55px'}} color="green">已验证</Tag>:
                <Tag style={{marginLeft:'10px',display:'inline-block',width:'55px'}}>待验证</Tag>
            }
        </div>
        <div>{createdDate}</div>
        <div><Button onClick={changeState} type={enabled?"danger":"primary"}>{enabled?"封禁":"解封"}</Button></div>
    </div>
}

interface UserProps {
    pageSize?:number
}

const UserPage:React.FC<UserProps> = () =>{
    const pageSize=10
    const [page_,setPage_] = useState<number>(1)
    const [pageSize_,setPageSize_] = useState(pageSize)
    const [userList,setUserList] = useState<EntityUser[]>([])
    const [total,setTotal] = useState<number>(0)
    const getList = (page:number,pageSize?:number) => {
        if(!pageSize) pageSize = 10
        getUserList(page,pageSize).then(res=>{
        if (res.success){
            setUserList(res.data.content)
            setTotal(res.data.totalElements)
            setPage_(page)
            setPageSize_(pageSize as number)
        }
    })}
    if(userList.length === 0){
        getList(page_,pageSize_)
    }


    return (
        <div style={{margin:'50px'}}>

            <QueueAnim
                type={['right', 'left']}
                duration={300}
                interval={100}
            >
                {userList.map((v,i)=>{
                    return <MyTableRow user={v} key={v.id}/>
                })}
            </QueueAnim>

            <Pagination
                size="small"
                total={total}
                onChange={getList}
                onShowSizeChange={getList}
                current={page_}
                pageSize={pageSize_}
                pageSizeOptions={['10','20','50']}
                showSizeChanger
                hideOnSinglePage
                showQuickJumper />
        </div>
    )
}

export default UserPage;
