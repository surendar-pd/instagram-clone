import React from 'react';
import styled from 'styled-components'


function Story() {
    return (
        <Container>
            <img src="https://www.seekpng.com/png/full/356-3562377_personal-user.png" alt='story'></img>
            <small>Username</small>
        </Container>
    )
}

export default Story

const Container = styled.div`
    min-width:66px;
    height:100%;
    margin-left: 15px;
    border-radius: 50px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    img{
        width: 100%;
        object-fit: contain;
    }
`