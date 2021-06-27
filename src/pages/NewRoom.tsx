
import {FormEvent, useState} from 'react'
import { Link, useHistory } from "react-router-dom"; 
import { Button } from "../components/Button";
import { ThemeButton } from "../components/ThemeButton";
import ilustrationImg from '../assets/images/illustration.svg'
import logoImg from '../assets/images/logo.svg';
import '../styles/auth.scss'
import { database } from '../services/firebase';
import { useTheme } from '../hooks/useTheme';

import { useAuth } from "../hooks/useAuth";
export function NewRoom() {
    const {user}= useAuth();
    const history = useHistory();
    const {theme, toggleTheme}= useTheme();

    const [newRoom,setNewRoom]= useState('');

    async function handleCreateRoom(event:FormEvent){
        event.preventDefault();
        if(newRoom.trim()===''){
            return;
        }

        const roomRef= database.ref('rooms');
        
        const firebaseRoom = await roomRef.push({
            title:newRoom,
            authorId:user?.id
        })
        history.push(`/rooms/${firebaseRoom.key}`)

    }
    return (

        <div className={theme} id ="page-auth">
        <aside>
            <img src={ilustrationImg} alt="Ilustração simbolizando perguntas e respostas " ></img>
            <strong>Crie salas de Q&amp;A ao vivo</strong>
            <p>Tire as dúvidas da sua audiência em tempo real</p>
        </aside>
        <main>

                <div className="theme-home">
                        <ThemeButton toggleTheme={toggleTheme}/>
                    </div>
                <div className="main-content">
                <img src={logoImg} alt="letmeask"></img>
            
                <h2> Criar uma nova sala</h2>
                <form onSubmit={handleCreateRoom}>
                    <input
                        type="text"
                        placeholder="Nome da sala"
                        onChange={event=> setNewRoom(event.target.value)}
                        value={newRoom}
                    />
                    <Button type="submit">Criar sala</Button>
                </form>

                <p> Quer entrar em uma sala existente? <Link to="/">Clique aqui</Link></p>
            </div>
        </main>
    </div>
    )

}