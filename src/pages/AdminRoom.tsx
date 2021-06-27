import { FormEvent, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import logoImg from '../assets/images/logo.svg';
import checkImg from '../assets/images/check.svg'
import answerImg from '../assets/images/answer.svg'
import deleteImg from '../assets/images/delete.svg';
import { Button } from '../components/Button';
import { ThemeButton } from '../components/ThemeButton';
import { Question } from '../components/Question';
import { RoomCode } from '../components/RoomCode';
import { useAuth } from '../hooks/useAuth';
import { useRoom } from '../hooks/useRoom';
import { database } from '../services/firebase';
import { useTheme } from '../hooks/useTheme';
import '../styles/room.scss'







type RoomParams = {
    id:string;
}


export function AdminRoom (){
    const {user} = useAuth();
    const history = useHistory();
    const params = useParams<RoomParams> ();
    const roomId = params.id; 
    const [newQuestion, setNewquestion] = useState('');
    const {title,questions}= useRoom(roomId)
    const {theme, toggleTheme}= useTheme();



    
  async function handleEndRoom() {
    await database.ref(`rooms/${roomId}`).update({
      endedAt: new Date(),
    })

    history.push('/');
  }

    
    async function handleDeleteQuestion(questionId:string){
       if(window.confirm('Tem certeza que você deseja excluir esta pergunta?')){
             await database.ref(`rooms/${roomId}/questions/${questionId}`).remove()
       }

    }
    async function handleCheckQuestionAsAnswered(questionId:string){
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isAnswered:true
        })
 
    }

    async function handleHighlightQuestion(questionId:string){
       
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isHighlighted:true
        })
    }
    async function handleSendQuestion(event:FormEvent){
        event.preventDefault()
        if ( newQuestion.trim()===''){
            return;
        }
        if(!user){
             throw new Error('you must be logged in')
        }
        const question ={
            content: newQuestion, 
            author:{
                name: user.name, 
                avatar:user.avatar
            },
            isHilighted:false,
            isAnswered:false
        };
        await database.ref(`rooms/${roomId}/questions`).push(question);

        setNewquestion('');
    
    }
    return (
      <div className ={theme} id="page-room">
          <header>
              <div className="content">
                <img src= {logoImg} alt="letmeask"></img>
                <div>
                    <RoomCode code={roomId}/>
                    <Button onClick={handleEndRoom} isOutlined> Encerrar sala</Button>
                    <ThemeButton toggleTheme={toggleTheme}/>
                
                </div>
               

              </div>
          </header>
          <main className="content">
                <div className="room-title">
                    <h1>Sala {title} </h1>
                    {questions.length>0 &&<span>{questions.length}</span>}

                </div>
               

                <div className={`question-list ${theme}`}>
                    {questions.map(question=>{
                        return(
                            <Question
                                key={question.id}
                                content= {question.content}
                                author= {question.author}
                                isAnswered={question.isAnswered}
                                isHighlighted={question.isHighlighted}

                            >
                                {!question.isAnswered &&(
                                    <>
                                    
                                        <button type="button" onClick={()=>handleCheckQuestionAsAnswered(question.id)}>
                                        <img src={checkImg} alt="rmarcar pergunta como respondida"></img>
                                        </button>
                                        <button type="button"onClick={()=>handleHighlightQuestion(question.id)} >
                                            <img src={answerImg} alt="Dar destaque na pergunta"></img>
                                        </button>
                                            
                                    
                                    
                                    </>



                                )}
                          

                                <button type="button" onClick={()=>handleDeleteQuestion(question.id)}>
                                    <img src={deleteImg} alt="remover pergunta"></img>
                                </button>
                            </Question>
                        )
                 
                    })}
                    
                </div>
          </main>


      </div>
    )
}