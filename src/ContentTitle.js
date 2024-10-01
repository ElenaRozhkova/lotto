import './ContentLayout.css'

export const ContentTitle = ({ img, text }) => {

    return (
        <div className='content_title'>
            <img src={img} alt={img} />
            <h4>{text}</h4>
        </div>
    )
}