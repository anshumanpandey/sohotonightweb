import { differenceInYears, parse } from 'date-fns'

export default (user: any) => {
    return differenceInYears(new Date(), parse(`${user?.dayOfBirth}-${user?.monthOfBirth}-${user?.yearOfBirth}`, "d-MMMM-yyyy", new Date()))
}