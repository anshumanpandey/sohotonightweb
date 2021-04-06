import React, { useCallback, useEffect, useRef, useState } from 'react';
import Footer from '../../partials/Footer';
import NavBar from '../../partials/NavBar';
import useAxios from 'axios-hooks'
import "../../css/timeline.css"
import { useGlobalState } from '../../state/GlobalState';
import UseIsMobile from '../../utils/UseIsMobile';
import { UseQuery } from '../../hooks/UseQuery';
import { formatRelative, parseISO } from 'date-fns';
import { animateScroll } from "react-scroll";
import SohoLink from '../../partials/SohoLink';
import SohoButton from '../../partials/SohoButton';
import Color from 'color';
import { BrandColor } from '../../utils/Colors';
import { startSocketConnection } from '../../request/socketClient';


function MessagesPage() {
    const [userData] = useGlobalState("userData");
    const query = UseQuery();
    const isMobile = UseIsMobile();
    const divRef = useRef<null | HTMLDivElement>(null);

    const [userChats, setUserChats] = useState<any[]>([])
    const [selectedChat, setSelectedChat] = useState<undefined | any>()
    const [currentMessage, setCurrentMessage] = useState('')

    const [{ data, loading, error }, getChats] = useAxios({
        url: '/chat',
    }, { manual: true });

    const [startChatReq, startChat] = useAxios({
        url: '/chat',
        method: 'post'
    }, { manual: true });

    const [sendMessageReq, sendMessage] = useAxios({
        url: '/chat/message',
        method: 'post'
    }, { manual: true });

    useEffect(() => {
        const socket = startSocketConnection()
        socket?.on("NEW_MESSAGE", (m) => onNewMessage(m))

        return () => {
            socket?.off("NEW_MESSAGE")
        }
    }, [])

    useEffect(() => {
        goToEndOfChat()
    }, [divRef.current])

    useEffect(() => {
        goToEndOfChat()
    }, [selectedChat])

    useEffect(() => {
        const listener = (event: KeyboardEvent) => {
            if (event.code === "Enter" || event.code === "NumpadEnter") {
                sendMessageFn()
            }
        };

        document.addEventListener("keydown", listener);

        return () => {
            document.removeEventListener("keydown", listener);
        }
    }, [currentMessage])

    useEffect(() => {
        const forCreateWithId = query.get('startWith')
        if (forCreateWithId) {
            startChat({ data: { toUserId: forCreateWithId } })
                .then(() => updateUserChats())
                .catch(() => updateUserChats())
        } else {
            updateUserChats()
        }
    }, [])

    const sendMessageFn = () => {
        if (currentMessage == "") return 
        sendMessage({
            data: {
                conversationId: selectedChat.id,
                body: currentMessage
            }
        })
        .then(({ data }) => {
            selectedChat.messages.push(data)
            setSelectedChat({ ...selectedChat })
            setCurrentMessage("")
            goToEndOfChat()
        })
    }

    const onNewMessage = (m: any) => {
        setUserChats(prev => {
            const found = prev.find(c => c.id == m.conversationId)
            if (found) {
                found.messages.push(m)
                return [...prev.filter(c => c.id != found.id).concat([ found ])]
            }
            return prev
        })

        setSelectedChat((prev: any) => {
            if (m.conversationId == prev?.id) {
                //prev.messages.push(m)
                return { ...prev }
            }
            return prev
        })
    }

    const goToEndOfChat = () => {
        if (divRef.current) {
            //divRef.current?.scrollTo({ behavior: "smooth", top: 100 * 100 * 100 });
            animateScroll.scrollToBottom({ containerId: "chat-boz" })
        }
    }

    const updateUserChats = () => {
        getChats()
            .then(({ data }) => data)
            .then((chats) => setUserChats(chats))
    }

    const isFetchingChats = () => loading || startChatReq.loading


    return (
        <>
            <NavBar />
            <div style={{ display: 'flex', flexGrow: 1, flexDirection: 'column' }} className="container page-content">
                <div style={{ display: 'flex', flexGrow: 1, flexDirection: isMobile ? 'column': 'row' }}>
                    <div style={{ display: 'flex' }} className="col-md-3 col-xs-12">
                        <div style={{ display: 'flex', flexGrow: 1, flexDirection: 'column' }} className="row-xs">
                            <div style={{ flexGrow: 1 }} className="main-box clearfix">
                                <h4>Chats</h4>
                                {isFetchingChats() && <h5>Fetching...</h5>}
                                {!isFetchingChats() && (
                                    <>
                                        {userChats.length != 0 ? userChats.map((c: any) => {
                                            return (
                                                <SohoLink key={c.id} onClick={() => setSelectedChat(c)}>
                                                    <div style={{ display: 'flex', flexDirection: 'row', borderRight: selectedChat?.id == c.id ? `3px solid ${BrandColor}` : undefined }}>
                                                        <img style={{ borderRadius: "50%", maxWidth: "100%", maxHeight: 4, minHeight: 40 }} src={c.createdByUser.profilePic || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"} className="img-responsive" alt="profile" />
                                                        <div style={{ marginLeft: '1rem',width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                                            <p style={{ fontSize: 14 }}>{c.createdByUser.id == userData?.id ? c.toUser.nickname : c.createdByUser.nickname}</p>
                                                            <p style={{ color: 'gray', fontSize: 10, marginRight: '4px' }}>{c.messages[0]?.createdAt ? formatRelative(parseISO(c.messages[0]?.createdAt), new Date()) : "No messages"}</p>
                                                        </div>
                                                    </div>
                                                </SohoLink>
                                            )
                                        }) : <h6>Not chats to show</h6>}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column' }} className="col-md-9 col-xs-12">
                        {selectedChat === undefined ? <h4>Select a chat</h4> : (
                            <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                                <div id={'chat-boz'} ref={divRef} style={{ flexGrow: 1, maxHeight: '39vw', overflowY: 'scroll' }}>
                                    {selectedChat.messages.map((m: any, idx: number) => {
                                        const containerStyle = { width: '30%', marginLeft: 'auto', }
                                        const chipStyle: React.CSSProperties = { backgroundColor: '#00000080', padding: '0.2rem', marginBottom: '0.5rem', borderRadius: '25px' }
                                        const textStyles: React.CSSProperties = { color: '#ffffff', margin: '0.5rem' }

                                        if (m.createdByUserId != userData?.id) {
                                            containerStyle.marginLeft = 'right'
                                            chipStyle.backgroundColor = Color(BrandColor).lighten(0.2).toString()
                                        }
                                        return (
                                            <div key={`${idx}-key`} style={containerStyle}>
                                                <div style={chipStyle}>
                                                    <p style={textStyles} >{m.body}</p>
                                                </div>
                                                <p style={{ fontSize: 10 }}>{formatRelative(parseISO(m.createdAt), new Date())}</p>
                                            </div>
                                        )
                                    })}
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }} >
                                    <div style={{  flexGrow: 1, marginRight: '1rem' }} className="form-group">
                                        <input
                                            type="text"
                                            className="form-control input-sm"
                                            placeholder="Type your Message..."
                                            name="message"
                                            onChange={(e) => setCurrentMessage(e.target.value)}
                                            value={currentMessage}
                                        />
                                    </div>
                                    <SohoButton disabled={sendMessageReq.loading || currentMessage == ""} onClick={() => sendMessageFn()} value={"send"} />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
export default MessagesPage;