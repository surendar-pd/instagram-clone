import React from 'react';
import {auth,provider,db,storage} from '../firebase';
import styled from 'styled-components';

function Login(props) {
    const signIn = () => {
        auth.signInWithPopup(provider)
        .then((result) => {
            const newUser = {
                name: result.user.displayName,
                photo: result.user.photoURL,
                uid: result.user.uid
            }
            localStorage.setItem('user', JSON.stringify(newUser));
            props.setUser(newUser);
            db.collection('/users').doc(newUser.uid).set({
                name : newUser.name,
                photo: newUser.photo 
            })
            var storageRef = storage.ref('/'+ (newUser.uid));
            storageRef.child(newUser.name).put();
        }).catch(err => {console.log(err)})
    }
    return (
        <Container>
            <Card>
                <h1>INSTAGRAM CLONE</h1>
                <SignIn onClick={()=>signIn()}>
                    Sign in
                </SignIn>
            </Card>
        </Container>
    )
}

export default Login

const Container = styled.div`
    width: 100%;
    height: 100vh;
    background-color:white;
    display: flex;
    align-items: center;
    justify-content: center;
`
const Card = styled.div`
    width: 500px;
    height: 400px;
    background-color: #fafafa;
    border: 1px solid lightgray;
    display: flex;
    align-items: center;
    justify-content: space-around;
    flex-direction: column;
    border-radius: 10px;
    
`
const SignIn = styled.div`
    background-color:#0D98F6;
    padding: 5px;
    border-radius: 5px;
    color: white;
    font-size: 1rem;
    width: 150px;
    text-align: center;
    cursor: pointer;
`