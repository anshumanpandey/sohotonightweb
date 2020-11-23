import { useMediaQuery } from 'react-responsive'

const UseIsTablet = () => {
    return useMediaQuery({ minWidth: 768, maxWidth: 991 })
}

export default UseIsTablet