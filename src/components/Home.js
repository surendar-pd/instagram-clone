import {React,useState,useEffect} from 'react';
import styled from 'styled-components';
import Story from './Story';
import Post from './Post';
import{Switch, Route, HashRouter,Link} from 'react-router-dom';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import { makeStyles } from '@material-ui/core/styles';
import {db,storage} from '../firebase';
import firebase from 'firebase';
import FlipMove from 'react-flip-move';


const useStyles = makeStyles((theme) => ({
    modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    },
    paper: {
    width: 'clamp(1300px, 90vw, 1300px)',
    backgroundColor: "white",
    display: 'flex',
    flexDirection:'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '750px',
    border: 'none',
    borderRadius: '10px',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    },
}));

function Home(props) {
    const classes = useStyles();
    const [open1, setOpen1] = useState(false);
    const [posts, setPosts] = useState([]);
    const [caption, setCaption] = useState('');

    const handleOpen1 = () => {
        setOpen1(true);
    };
    const handleClose1 = () => {
        setOpen1(false);
    };

    const fileUpload = () => {
        var uploader = document.getElementById('uploader');
        var file = document.getElementById('files').files[0];
        var storageRef = storage.ref(props.user.uid + '/');
        if(file){
            var thisRef = storageRef.child(file.name);
            var task = thisRef.put(file);
            task.on('state_changed',
                function progress(snapshot){
                    var percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    uploader.value = percentage;
                    if(uploader.value>0){
                        uploader.style.display = 'inline';
                    }
                },
                function error(err){
                    console.log(err)
                },
                function complete(){
                    uploader.value = 0;
                    uploader.style.display = 'none';
                    var fileRef = storage.ref(props.user.uid + '/' + file.name );
                    fileRef.getDownloadURL()
                    .then((url)=>{
                        db.collection('posts').add({
                            userName: props.user.name,
                            timeStamp: firebase.firestore.Timestamp.now(),
                            fileURL: url,
                            userPhoto: props.user.photo,
                            caption: caption,
                        }).then(handleClose1)
                    }).catch(error => alert(error))
                }
            )
        }
    }

    useEffect(() => {
        db.collection('posts').orderBy('timeStamp', 'desc').onSnapshot((snapshot) => {
            setPosts(snapshot.docs.map((doc)=>{
                return({postURL: doc.data().fileURL, userName: doc.data().userName,userPhoto:doc.data().userPhoto,caption: doc.data().caption})
            }))
        })
    },[])

    return (
        <HashRouter>
        <Container>
            <Navigation>
            <NavigationContent>
                <Title>Instagram</Title>
                <Search>
                <input type="search" placeholder="Search"></input>
                </Search>
                <Icons>
                <Link to="/home">
                    <svg aria-label="Home" class="_8-yf5 " fill="#262626" height="22" role="img" viewBox="0 0 48 48" width="22"><path d="M45.3 48H30c-.8 0-1.5-.7-1.5-1.5V34.2c0-2.6-2-4.6-4.6-4.6s-4.6 2-4.6 4.6v12.3c0 .8-.7 1.5-1.5 1.5H2.5c-.8 0-1.5-.7-1.5-1.5V23c0-.4.2-.8.4-1.1L22.9.4c.6-.6 1.5-.6 2.1 0l21.5 21.5c.4.4.6 1.1.3 1.6 0 .1-.1.1-.1.2v22.8c.1.8-.6 1.5-1.4 1.5zm-13.8-3h12.3V23.4L24 3.6l-20 20V45h12.3V34.2c0-4.3 3.3-7.6 7.6-7.6s7.6 3.3 7.6 7.6V45z"></path></svg>
                </Link>
                <Link>
                    <svg aria-label="Messenger" class="_8-yf5 " fill="#262626" height="22" role="img" viewBox="0 0 48 48" width="22"><path d="M36.2 16.7L29 22.2c-.5.4-1.2.4-1.7 0l-5.4-4c-1.6-1.2-3.9-.8-5 .9l-6.8 10.7c-.7 1 .6 2.2 1.6 1.5l7.3-5.5c.5-.4 1.2-.4 1.7 0l5.4 4c1.6 1.2 3.9.8 5-.9l6.8-10.7c.6-1.1-.7-2.2-1.7-1.5zM24 1C11 1 1 10.5 1 23.3 1 30 3.7 35.8 8.2 39.8c.4.3.6.8.6 1.3l.2 4.1c0 1 .9 1.8 1.8 1.8.2 0 .5 0 .7-.2l4.6-2c.2-.1.5-.2.7-.2.2 0 .3 0 .5.1 2.1.6 4.3.9 6.7.9 13 0 23-9.5 23-22.3S37 1 24 1zm0 41.6c-2 0-4-.3-5.9-.8-.4-.1-.8-.2-1.3-.2-.7 0-1.3.1-2 .4l-3 1.3V41c0-1.3-.6-2.5-1.6-3.4C6.2 34 4 28.9 4 23.3 4 12.3 12.6 4 24 4s20 8.3 20 19.3-8.6 19.3-20 19.3z"></path></svg>
                </Link>
                <Link>
                    <svg onClick={handleOpen1} aria-label="New Post" class="_8-yf5 " fill="#262626" height="22" role="img" viewBox="0 0 48 48" width="22"><path d="M31.8 48H16.2c-6.6 0-9.6-1.6-12.1-4C1.6 41.4 0 38.4 0 31.8V16.2C0 9.6 1.6 6.6 4 4.1 6.6 1.6 9.6 0 16.2 0h15.6c6.6 0 9.6 1.6 12.1 4C46.4 6.6 48 9.6 48 16.2v15.6c0 6.6-1.6 9.6-4 12.1-2.6 2.5-5.6 4.1-12.2 4.1zM16.2 3C10 3 7.8 4.6 6.1 6.2 4.6 7.8 3 10 3 16.2v15.6c0 6.2 1.6 8.4 3.2 10.1 1.6 1.6 3.8 3.1 10 3.1h15.6c6.2 0 8.4-1.6 10.1-3.2 1.6-1.6 3.1-3.8 3.1-10V16.2c0-6.2-1.6-8.4-3.2-10.1C40.2 4.6 38 3 31.8 3H16.2z"></path><path d="M36.3 25.5H11.7c-.8 0-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5h24.6c.8 0 1.5.7 1.5 1.5s-.7 1.5-1.5 1.5z"></path><path d="M24 37.8c-.8 0-1.5-.7-1.5-1.5V11.7c0-.8.7-1.5 1.5-1.5s1.5.7 1.5 1.5v24.6c0 .8-.7 1.5-1.5 1.5z"></path></svg>
                </Link>
                <Link>
                    <svg aria-label="Find People" class="_8-yf5 " fill="#262626" height="22" role="img" viewBox="0 0 48 48" width="22"><path clip-rule="evenodd" d="M24 0C10.8 0 0 10.8 0 24s10.8 24 24 24 24-10.8 24-24S37.2 0 24 0zm0 45C12.4 45 3 35.6 3 24S12.4 3 24 3s21 9.4 21 21-9.4 21-21 21zm10.2-33.2l-14.8 7c-.3.1-.6.4-.7.7l-7 14.8c-.3.6-.2 1.3.3 1.7.3.3.7.4 1.1.4.2 0 .4 0 .6-.1l14.8-7c.3-.1.6-.4.7-.7l7-14.8c.3-.6.2-1.3-.3-1.7-.4-.5-1.1-.6-1.7-.3zm-7.4 15l-5.5-5.5 10.5-5-5 10.5z" fill-rule="evenodd"></path></svg> 
                </Link>
                <Link>
                    <svg aria-label="Activity Feed" class="_8-yf5 " fill="#262626" height="22" role="img" viewBox="0 0 48 48" width="22"><path d="M34.6 6.1c5.7 0 10.4 5.2 10.4 11.5 0 6.8-5.9 11-11.5 16S25 41.3 24 41.9c-1.1-.7-4.7-4-9.5-8.3-5.7-5-11.5-9.2-11.5-16C3 11.3 7.7 6.1 13.4 6.1c4.2 0 6.5 2 8.1 4.3 1.9 2.6 2.2 3.9 2.5 3.9.3 0 .6-1.3 2.5-3.9 1.6-2.3 3.9-4.3 8.1-4.3m0-3c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5.6 0 1.1-.2 1.6-.5 1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z"></path></svg>
                </Link>
                <Link>
                    <img onClick={props.signOut} alt="userimage" src={props.user.photo} style={{width: "22px", height: "22px"}}></img>
                </Link>
                </Icons>
            </NavigationContent>
            </Navigation>
            <Content>
                <Switch>
                    <Route path='/'>
                        <Feed>
                                <Stories>
                                    <Story/>
                                    <Story/>
                                    <Story/>
                                    <Story/>
                                    <Story/>
                                    <Story/>
                                    <Story/>
                                    <Story/>
                                    <Story/>
                                    <Story/>
                                    <Story/>
                                    <Story/>
                                    <Story/>
                                    <Story/>
                                    <Story/>
                                    <Story/>
                                </Stories>
                            <Posts>
                                <FlipMove>
                                    {
                                        posts.map((item,index)=>(
                                            <Post caption={item.caption} userPhoto={item.userPhoto} userName={item.userName} src={item.postURL} key={index}/>
                                        ))
                                    }
                                </FlipMove>
                            </Posts>
                        </Feed>
                    </Route>
                    <Route path='/dm'>

                    </Route>
                </Switch>
            </Content>
        </Container>
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            className={classes.modal}
            open={open1}
            onClose={handleClose1}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
            timeout: 500,
            }}
        >
            <Fade in={open1}>
            <div className={classes.paper}>
                <NewPost>
                    <div></div>
                    <h3>New Post</h3>
                    <div style={{cursor: 'pointer'}} onClick={handleClose1}><svg aria-label="Close" class="_8-yf5 " fill="#262626" height="24" role="img" viewBox="0 0 48 48" width="24"><path clip-rule="evenodd" d="M41.1 9.1l-15 15L41 39c.6.6.6 1.5 0 2.1s-1.5.6-2.1 0L24 26.1l-14.9 15c-.6.6-1.5.6-2.1 0-.6-.6-.6-1.5 0-2.1l14.9-15-15-15c-.6-.6-.6-1.5 0-2.1s1.5-.6 2.1 0l15 15 15-15c.6-.6 1.5-.6 2.1 0 .6.6.6 1.6 0 2.2z" fill-rule="evenodd"></path></svg></div>
                </NewPost>
                <AddMedia>
                    <Caption>
                        <input placeholder='Caption' onChange={(e) => setCaption(e.target.value)} type="text"></input>
                    </Caption>
                    <progress className='progressbar' value='50' max='100' id='uploader'></progress>
                    <svg aria-label="Icon to represent media such as images or videos" class="_8-yf5 " fill="#262626" height="77" role="img" viewBox="0 0 97.6 77.3" width="96"><path d="M16.3 24h.3c2.8-.2 4.9-2.6 4.8-5.4-.2-2.8-2.6-4.9-5.4-4.8s-4.9 2.6-4.8 5.4c.1 2.7 2.4 4.8 5.1 4.8zm-2.4-7.2c.5-.6 1.3-1 2.1-1h.2c1.7 0 3.1 1.4 3.1 3.1 0 1.7-1.4 3.1-3.1 3.1-1.7 0-3.1-1.4-3.1-3.1 0-.8.3-1.5.8-2.1z"></path><path d="M84.7 18.4L58 16.9l-.2-3c-.3-5.7-5.2-10.1-11-9.8L12.9 6c-5.7.3-10.1 5.3-9.8 11L5 51v.8c.7 5.2 5.1 9.1 10.3 9.1h.6l21.7-1.2v.6c-.3 5.7 4 10.7 9.8 11l34 2h.6c5.5 0 10.1-4.3 10.4-9.8l2-34c.4-5.8-4-10.7-9.7-11.1zM7.2 10.8C8.7 9.1 10.8 8.1 13 8l34-1.9c4.6-.3 8.6 3.3 8.9 7.9l.2 2.8-5.3-.3c-5.7-.3-10.7 4-11 9.8l-.6 9.5-9.5 10.7c-.2.3-.6.4-1 .5-.4 0-.7-.1-1-.4l-7.8-7c-1.4-1.3-3.5-1.1-4.8.3L7 49 5.2 17c-.2-2.3.6-4.5 2-6.2zm8.7 48c-4.3.2-8.1-2.8-8.8-7.1l9.4-10.5c.2-.3.6-.4 1-.5.4 0 .7.1 1 .4l7.8 7c.7.6 1.6.9 2.5.9.9 0 1.7-.5 2.3-1.1l7.8-8.8-1.1 18.6-21.9 1.1zm76.5-29.5l-2 34c-.3 4.6-4.3 8.2-8.9 7.9l-34-2c-4.6-.3-8.2-4.3-7.9-8.9l2-34c.3-4.4 3.9-7.9 8.4-7.9h.5l34 2c4.7.3 8.2 4.3 7.9 8.9z"></path><path d="M78.2 41.6L61.3 30.5c-2.1-1.4-4.9-.8-6.2 1.3-.4.7-.7 1.4-.7 2.2l-1.2 20.1c-.1 2.5 1.7 4.6 4.2 4.8h.3c.7 0 1.4-.2 2-.5l18-9c2.2-1.1 3.1-3.8 2-6-.4-.7-.9-1.3-1.5-1.8zm-1.4 6l-18 9c-.4.2-.8.3-1.3.3-.4 0-.9-.2-1.2-.4-.7-.5-1.2-1.3-1.1-2.2l1.2-20.1c.1-.9.6-1.7 1.4-2.1.8-.4 1.7-.3 2.5.1L77 43.3c1.2.8 1.5 2.3.7 3.4-.2.4-.5.7-.9.9z"></path></svg>
                    <p>Drag photos and videos here.</p>
                    <AddButton>
                        <label htmlFor="files">
                            Select From Computer
                        </label>
                        <input onChange={() => fileUpload()} id="files" type="file"/>
                    </AddButton>
                </AddMedia>
            </div>
            </Fade>
        </Modal>
    </HashRouter>
    )
}

export default Home

const Container = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    flex-direction: column;
`

const Feed = styled.div`
    width: 614px;
    overflow-y: scroll;
    ::-webkit-scrollbar{
        display: none;
    }

`
const Stories = styled.div`
    width:614px;
    height: 118px;
    background-color:white;
    border: 1px solid lightgray;
    margin: 24px 0px;
    display: flex;
    align-items: center;
    overflow-x: scroll;
    ::-webkit-scrollbar{
        display: none;
    }
`
const Posts = styled.div`
    min-width: 614px;
    max-height: calc(100vh - 54px - 145px - 24px);
    display: flex;
    flex-direction: column;
`
const Navigation = styled.div`
    width: 100%;
    height: 54px;
    background-color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
`
const NavigationContent = styled.div`
    width:935px;
    display: flex;
    align-items: center;
    justify-content: space-between;

`
const Title = styled.div`
    font-size:1.5rem;
`
const Search = styled.div`
    input{
        height:28px;
        background-color: #FAFAFA;
        border: 1px solid lightgray;
        border-radius:5px;
        padding: 10px;
        outline: none;
        width: 215px;
    }
`
const Icons = styled.div`
    width: 266px;
    display: flex;
    align-items: center;
    justify-content:space-around;
    img{
        border-radius: 50px;
    }
`
const Content = styled.div`
    width: 100%;
    height: calc(100vh - 54px);
    display: flex;
    justify-content: center;
    background-color:#FAFAFA;
`
const NewPost = styled.div`
    width: 100%;
    height: 54px;
    text-align: center;
    border-bottom: 1px solid lightgray;
    display: flex;
    justify-content:space-between;
    h3{
        font-weight: 500;
    }
    div{
        height: 54px;
    }
`
const AddMedia = styled.div`
    width: 100%;
    height: calc(100% - 54px);
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    p{
        font-size:1.25rem;
        font-weight:100;
    }
    #uploader{
        display:none;
        height:20px;
        width:40vw;
    }
`
const Caption = styled.div`
    margin-bottom: 10px;
    input{
        height:28px;
        background-color: #FAFAFA;
        border: 1px solid lightgray;
        border-radius:5px;
        padding: 10px;
        outline: none;
        width: 250px;
    }
`
const AddButton = styled.div`
    background-color:#0D98F6;
    padding: 5px;
    border-radius: 5px;
    color: white;
    font-size: 1rem;
    input{
        display:none;
        visibility: hidden;
    }
`