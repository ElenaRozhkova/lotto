import './ContentLayout.css'

export const ContentTitle = ({ img, text }) => {

    return (
        <div className='content_title'>
            <img src={img} alt={img} />
            <h1>{text}</h1>
        </div>
    )
}