import React, { useCallback, useEffect, useState } from 'react';
import Footer from '../../partials/Footer';
import NavBar from '../../partials/NavBar';
import useAxios from 'axios-hooks'
import "../../css/timeline.css"
import { Link } from 'react-router-dom';
import GetUserAge from '../../utils/GetUserAge';
import { useGlobalState } from '../../state/GlobalState';
import { BrandColor } from '../../utils/Colors';

enum FILTER_KEY {
    GENDER = "GENDER",
    ORIENTATION = "ORIENTATION",
    COUNTY = "COUNTY",
    LOCATION = "LOCATION",
    SERVICE = "SERVICE",
}

const getTownsFromUsers = (users: any = []) => {
    const town = users.map((u: any) => u.town).filter((c: any) => c)
    return Array.from(new Set(town).values())
}

type FilterObject = { forSearchKey: FILTER_KEY, val: any }

const useFilters = () => {
    const [filters, setFilters] = useState<FilterObject[]>([]);

    const addValueFor = (forKey: FILTER_KEY, val: any) => {
        const filtersOfThisKey = filters.filter(f => f.forSearchKey == forKey)
        const found = filtersOfThisKey.find(f => f.val == val)

        setFilters(prev => {
            let newState = prev
            if (found) {
                newState = prev.filter(f => f.forSearchKey == found.forSearchKey && f.val != found.val)
            } else {
                newState.push({ forSearchKey: forKey, val })
            }

            return [...newState]
        })
    }

    const setValueFor = (forKey: FILTER_KEY, val: any) => {
        setFilters(prev => {
            return prev
                .filter(f => f.forSearchKey != forKey)
                .concat([{ forSearchKey: forKey, val }])
        })
    }

    const clearFilterFor = (forKey: FILTER_KEY) => {
        setFilters(prev => {
            return prev
                .filter(f => f.forSearchKey != forKey)
        })
    }

    const getValuesFiltersFor = (forKey: FILTER_KEY) => {
        return filters.filter(f => f.forSearchKey == forKey).map(f => f.val)
    }

    return {
        filters,
        clearFilterFor,
        setValueFor,
        addValueFor,
        getValuesFiltersFor
    }
}

const userIsVerified = (u: any) => {
    return u.authenticationProfilePicIsAuthenticated == true
}

function ListPostPage() {
    const { filters, addValueFor, setValueFor, clearFilterFor, getValuesFiltersFor } = useFilters()
    const [selectedTown] = useGlobalState("selectedTown")

    const [filteredUsers, setFilteredUsers] = useState<any>([])

    const [{ data, loading, error }, getUser] = useAxios({
        url: '/user/public/getUsers',
    }, { manual: true });

    const [servicesReq, getServices] = useAxios({
        url: '/services/',
    });

    useEffect(() => {
        getUser()
            .then(({ data }) => setFilteredUsers(data.filter(userIsVerified)))
    }, [])

    useEffect(() => {
        if (!data) return
        const r = data
            .filter(userIsVerified)
            .filter((a: any) => {
                const filters = getValuesFiltersFor(FILTER_KEY.GENDER)
                return filters.length != 0 ? filters.includes(a.gender) : true
            })
            .filter((a: any) => {
                const filters = getValuesFiltersFor(FILTER_KEY.ORIENTATION)
                return filters.length != 0 ? filters.includes(a.orientation) : true
            })
            .filter((a: any) => {
                const filters = getValuesFiltersFor(FILTER_KEY.COUNTY)
                return filters.length != 0 ? filters.includes(a.county) : true
            })
            .filter((a: any) => {
                const filters = getValuesFiltersFor(FILTER_KEY.LOCATION)
                return filters.length != 0 ? filters.some(f => a.town?.startsWith(f)) : true
            })
            .filter((a: any) => {
                const filters = getValuesFiltersFor(FILTER_KEY.SERVICE)
                return filters.length != 0 ? filters.some(f => a.Services?.find((s: any) => s.name == f)) : true
            })
        setFilteredUsers([...r])
    }, [filters, data])

    return (
        <>
            <NavBar />
            <div className="container page-content">
                <div className="row">
                    <div className="col-md-3 col-xs-12">
                        <div className="row-xs">
                            <div className="main-box clearfix">
                                <h4>Advanced Search</h4>

                                <div className="profile-details">
                                    <div className="widget-body bordered-top bordered-sky">
                                        <div className="form-group">

                                            <h5 style={{ fontWeight: "normal" }}>Gender</h5>

                                            <div className="checkbox">
                                                <label>
                                                    <input onChange={() => { addValueFor(FILTER_KEY.GENDER, "Male") }} type="checkbox" />
                                                    <span className="text">Male</span>
                                                </label>
                                            </div>
                                            <div className="checkbox">
                                                <label>
                                                    <input onClick={() => { addValueFor(FILTER_KEY.GENDER, "Female") }} type="checkbox" />
                                                    <span className="text">Female</span>
                                                </label>
                                            </div>
                                            <div className="checkbox">
                                                <label>
                                                    <input onClick={() => { addValueFor(FILTER_KEY.GENDER, "Couple") }} type="checkbox" />
                                                    <span className="text">Couple</span>
                                                </label>
                                            </div>
                                            <div className="checkbox">
                                                <label>
                                                    <input onClick={() => { addValueFor(FILTER_KEY.GENDER, "Trans") }} type="checkbox" />
                                                    <span className="text">Trans</span>
                                                </label>
                                            </div>

                                            <h5 style={{ fontWeight: "normal" }}>Orientation</h5>

                                            <div className="checkbox">
                                                <label>
                                                    <input onClick={() => { addValueFor(FILTER_KEY.ORIENTATION, "Bi-curious") }} type="checkbox" />
                                                    <span className="text">Bi-curious</span>
                                                </label>
                                            </div>

                                            <div className="checkbox">
                                                <label>
                                                    <input onClick={() => { addValueFor(FILTER_KEY.ORIENTATION, "Bi-sexual") }} type="checkbox" />
                                                    <span className="text">Bi-sexual</span>
                                                </label>
                                            </div>

                                            <div className="checkbox">
                                                <label>
                                                    <input onClick={() => { addValueFor(FILTER_KEY.ORIENTATION, "Gay") }} type="checkbox" />
                                                    <span className="text">Gay</span>
                                                </label>
                                            </div>

                                            <div className="checkbox">
                                                <label>
                                                    <input onClick={() => { addValueFor(FILTER_KEY.ORIENTATION, "Straight") }} type="checkbox" />
                                                    <span className="text">Straight</span>
                                                </label>
                                            </div>

                                            <h5 style={{ fontWeight: "normal" }}>Cities</h5>

                                            {getTownsFromUsers(data).map((t: any) => {
                                                return (
                                                    <div className="checkbox">
                                                        <label>
                                                            <input onClick={() => { addValueFor(FILTER_KEY.LOCATION, t) }} type="checkbox" />
                                                            <span className="text">{t}</span>
                                                        </label>
                                                    </div>
                                                );
                                            })}

                                            <h5 style={{ fontWeight: "normal" }}>Services</h5>
                                            {servicesReq?.data?.map((t: any) => {
                                                return (
                                                    <div className="checkbox">
                                                        <label>
                                                            <input onClick={() => { addValueFor(FILTER_KEY.SERVICE, t.name) }} type="checkbox" />
                                                            <span className="text">{t.name}</span>
                                                        </label>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>


                            </div>
                        </div>
                    </div>

                    <div className="col-md-7 ">
                        <div className="col-inside-lg decor-default activities animated fadeInUp" id="activities">
                            {loading && <p style={{ fontSize: 20, textAlign: 'center', color: "#d32a6b" }}>Loading...</p>}
                            {!loading && filteredUsers.length == 0 && <p style={{ fontSize: 20, textAlign: 'center', color: "#d32a6b" }}>No user found</p>}

                            {filteredUsers.map((g: any) => {
                                return (
                                    <div style={{ display: 'flex', flexDirection: 'row', borderBottom: "1px solid #d8d8d8" }}>
                                        <div style={{ width: '20%', paddingLeft: 0, paddingTop: '2rem', paddingBottom: '2rem', paddingRight: '2rem' }}>
                                            <Link style={{ display: 'block' }} to={`/profile/${g.id}`}>
                                                <img style={{ borderRadius: "50%", maxWidth: "100%", height: "100%" }} src={g.profilePic || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"} className="img-responsive" alt="profile" />
                                            </Link>
                                            <div style={{ alignItems: "center", flex: 1, display: "flex", justifyContent: "center" }}>
                                                {g?.isLogged ? (
                                                    <>
                                                        <i style={{ color: 'green', marginRight: '0.5%' }} className="fa fa-circle" aria-hidden="true"></i>
                                                        <p style={{ fontSize: 18, color: 'green', margin: 0 }}>Online</p>
                                                    </>
                                                ) : (
                                                        <>
                                                            <i style={{ color: 'gray', marginRight: '0.5%' }} className="fa fa-circle" aria-hidden="true"></i>
                                                            <p style={{ fontSize: 18, color: 'gray', margin: 0 }}>Offline</p>
                                                        </>
                                                    )}
                                            </div>
                                        </div>
                                        <div style={{ width: '80%', paddingTop: '2rem', display: 'flex', flexDirection: 'row' }}>
                                            <div style={{ width: '100%' }}>
                                                <Link style={{ marginBottom: '10px', fontSize: 15, display: 'inline-block', color: 'black', fontWeight: 'bold' }} to={`/profile/${g.id}`}>
                                                    {g.nickname}
                                                </Link>
                                                <p>{g.orientation} {GetUserAge(g)} year old {g.gender}</p>
                                                {g.aboutYouDetail && <p style={{ wordWrap: "break-word" }}>{g.aboutYouDetail}</p>}
                                            </div>
                                            <div style={{ width: '100%' }}>
                                                {g.callNumber && (
                                                    <div>
                                                        <p style={{ fontFamily: 'AeroliteItalic', fontSize: 16, textAlign: "end" }}>Call me now for one to one live chat: </p>
                                                        <p style={{ fontWeight: 'bold', textAlign: "end" }}>{g.callNumber}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}

                        </div>
                    </div>
                    <div className="col-md-2 ">
                        <div className="add_cont">
                            <div className="add_area"><img src="img/Photos/add1.jpg" alt="" className="profile-img img-responsive center-block show-in-modal" /></div>
                            <div className="add_area"><img src="img/Photos/add2.jpg" alt="" className="profile-img img-responsive center-block show-in-modal" /></div>
                            <div className="add_area"><img src="img/Photos/add3.jpg" alt="" className="profile-img img-responsive center-block show-in-modal" /></div>

                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
export default ListPostPage;