import { useHistory } from 'react-router-dom';
import { Button } from '../components/Button';
import{ThemeButton} from '../components/ThemeButton'

import ilustrationImg from '../assets/images/illustration.svg'
import logoImg from '../assets/images/logo.svg';
import googleIconImg from '../assets/images/google-icon.svg'
import '../styles/auth.scss'
import { useAuth } from '../hooks/useAuth';
import { FormEvent, useState } from 'react';
import { database } from '../services/firebase';
import { useTheme } from '../hooks/useTheme';

export function Home(){
    const history = useHistory();
    const {theme, toggleTheme}= useTheme();
    const {signInWithGoogle, user} = useAuth();
    const [roomCode,setRoomCode] =useState('')


    async function handleCreateRoom(){
        if(!user){
            await signInWithGoogle();
        }
        history.push('rooms/new')

    }

    async function  handleJoinRoom(event:FormEvent) {

        event.preventDefault();
        if (roomCode.trim()===''){
            return;
        }

        const roomRef = await database.ref(`rooms/${roomCode}`).get(); 

        if(!roomRef.exists()){
            alert('Room does not exists');
            return;
        }

        if(!roomRef.val().endedAt){
            alert('Room already closed');
            return;

        }
        history.push(`admin/roms/${roomCode}`)


    }
    return(
        <div className ={theme} id ="page-auth">
              
            
            <aside>
                <img src={ilustrationImg} alt="Ilustração simbolizando perguntas e respostas " ></img>
                <strong>Crie salas de Q&amp;A ao vivo</strong>
                <p>Tire as dúvidas da sua audiência em tempo real</p>
            </aside>
            <main>
             
               
                <div className="main-content">
              
            

                    <img src={logoImg} alt="letmeask"></img>
                    <button onClick={handleCreateRoom}className="create-room">
                        <img src={googleIconImg} alt="logo do google"></img>
                        Crie sua sala com o google
                    </button>
                    <div className="separator">ou entre em uma sala</div>
                    <form onSubmit={handleJoinRoom}>
                        <input
                            type="text"
                            placeholder="digite o código da sala"
                            onChange={event=> setRoomCode(event.target.value)}
                            value={roomCode}
                        />
                        <Button type="submit">Entrar na sala</Button>
                    </form>
                </div>
            </main>
        </div>
    )

} 