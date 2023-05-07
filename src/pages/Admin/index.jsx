import './admin.css'

import { useState, useEffect } from 'react'

import { auth, db } from '../../firebaseConnection'
import { signOut } from 'firebase/auth'

import { 
    addDoc,
    collection,
    onSnapshot,
    query,
    orderBy,
    where,
    doc,
    deleteDoc,
    updateDoc
} from 'firebase/firestore'

export default function Adimin() {

    const [ task, setTask ] = useState('')
    const [ user, setUser ] = useState({})
    const [ edit, setEdit ] = useState({})

    const [ taskUser, setTaskUser ] = useState([])

    useEffect(() => {
        async function loadTasks() {
            const userDetail = localStorage.getItem('@detailUser')
            setUser(JSON.parse(userDetail))

            if(userDetail) {
                const data = JSON.parse(userDetail)

                const taskRef = collection(db, 'tasks')
                const q = query(taskRef, orderBy('created', 'desc'), where('userUid', '==', data?.uid))
                const unsub = onSnapshot(q, (snapshot) => {
                    let list = [] 

                    snapshot.forEach((doc) => {
                        list.push({
                            id: doc.id,
                            task: doc.data().task,
                            userUid: doc.data().userUid
                        })
                    })
                    
                    console.log(list)
                    setTaskUser(list)
                })
            }
        }

        loadTasks()
    }, [])

    async function handleRegister(e) {

        e.preventDefault()

        if(task === '' ) {
            alert('Digite sua tarefa...')
            return
        }

        if(edit?.id) {
            handleUpdateTask()
            return
        }

        await addDoc(collection(db, 'tasks'), {
            task: task,
            created: new Date(),
            userUid: user?.uid
        })
        .then(() => {
            console.log('tarefa registrada')
            setTask('')
        })
        .catch((error) => {
            console.log('ERRO AO REGISTRAR ' + error)
        })

    }

    async function handleLogout() {
        await signOut(auth)
    }

    async function deleteTask(id) {
        const docRef = doc(db, 'tasks', id)
        await deleteDoc(docRef)
    }

    function editTask(item) {
        setTask(item.task)
        setEdit(item)
    }

    async function handleUpdateTask() {
        const docRef = doc(db, 'tasks', edit?.id)
        await updateDoc(docRef, {
            task: task,

        })
        .then(() => {
            console.log('Tarefa atualizada')
            setTask('')
            setEdit({})
        })
        .catch((error) => {
            console.log('Erro ao atualizar')
            setTask('')
            setEdit({})
        })
    }

    return(
        <div className='admin-container'>

            <h1>Minhas tarefas</h1>

            <form className='form' onSubmit={handleRegister}>
                <textarea name=""
                placeholder='Digite sua tarefa...'
                value={ task } 
                onChange={e => setTask(e.target.value)}/>

                {Object.keys(edit).length > 0 ? (
                    <button className='btn-register' 
                    type='submit'>Atualizar Tarefa</button>
                ) : (
                    <button className='btn-register' 
                    type='submit'>Registrar Tarefa</button>
                )}
            </form>

            {taskUser.map(item => (
                <article key={item.id} className='list'>
                    <p>{item.task}</p>

                    <div>
                        <button onClick={() => editTask(item)}>Editar</button>
                        <button onClick={() => deleteTask(item.id)} className='btn-delete'>Concluir</button>
                    </div>
                </article>
            ))}

            <button onClick={handleLogout} className='btn-logout'>Sair</button>
            
        </div>
    )
}