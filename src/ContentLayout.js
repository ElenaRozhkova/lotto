import React from 'react'
import './ContentLayout.css'
import { ContentTitle } from './ContentTitle'

export const ContentLayout = (props) => {

    return (
        <>

            <div className='content'>
                <ContentTitle img={props.img} text={props.text} />
                {props.children}
            </div>
        </>
    )

}