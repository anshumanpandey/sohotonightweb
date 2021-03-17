export interface UserData {
    id: string,
    nickname: string,
    firstName?: string,
    lastName?: string,
    phoneNumber?: string
    callNumber?: string
    town?: string
    gender?: string
    postCode?: string
    role: string
    tokensBalance: number
    aboutYouSummary?: string
    aboutYouDetail?: string
    orientation?: string
    railStation?: string
    password: string,
    emailAddress: string,
    dayOfBirth: string,
    monthOfBirth: string,
    yearOfBirth: string,
    country: string,
    county: string,
  
    inches: boolean,
    feet: boolean,
  
    escortServices: boolean,
    phoneChat: boolean,
    webcamWork: boolean,
    contentProducer: boolean,
    allowSocialMediaMarketing: boolean,  
  
    recievePromotions: boolean,
    hasAdultContentCertification: boolean,
  
    isTrans: string
  
    isLogged: boolean
  
    profilePic?: string
    bannerImage?: string
    authenticationProfilePic: string
    authenticationProfilePicIsAuthenticated: boolean
  }