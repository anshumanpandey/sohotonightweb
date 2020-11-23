import { useMediaQuery } from 'react-responsive'

const UseIsMobile = () => {
    return useMediaQuery({ maxWidth: 767 })
}

export default UseIsMobile